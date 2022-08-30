from flask import Flask, request, jsonify, make_response
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
import json
from flask_cors import CORS, cross_origin
import jwt
from datetime import datetime, timedelta
from functools import wraps
import uuid
import urllib
import os
from sqlalchemy import create_engine

app = Flask(__name__)
cors = CORS(app)

maria_user = os.environ.get('MARIADB_USER')
maria_pass = os.environ.get('MARIADB_PASSWORD')
secret_key = os.environ.get('SECRET_KEY')

# For MariaDB database connection (Tested):
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://' + maria_user + ':' + maria_pass + '@myservice-db00007607.mdb0002659.db1.skysql.net:5001/cars'

# For MSSQL database connection (Tested):
# params = urllib.parse.quote_plus('DRIVER={SQL Server};SERVER=SQLEXPRESS;DATABASE=cars;Trusted_Connection=yes;')
# app.config['SQLALCHEMY_DATABASE_URI'] = "mssql+pyodbc:///?odbc_connect=%s" % params
app.config['SECRET_KEY'] = secret_key
app.config['CORS_HEADERS'] = 'Content-Type'

db = SQLAlchemy(app)

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key = True)
    public_id = db.Column(db.String(50), unique = True)
    name = db.Column(db.String(100))
    email = db.Column(db.String(70), unique = True)
    password = db.Column(db.String(150))
    role = db.Column(db.String(10))

    def __repr__(self):
        return '<User %r>' % self.public_id

class Car(db.Model):
    __tablename__ = 'cars'
    id = db.Column(db.Integer, primary_key=True)
    brand = db.Column(db.String(50))
    model = db.Column(db.String(50))
    fuel = db.Column(db.String(50))
    kms = db.Column(db.Integer)
    year = db.Column(db.Integer)
    price = db.Column(db.Integer)

    def __repr__(self):
        return '<Car %r>' % self.brand

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        if 'Authorization' in request.headers:
            token = request.headers['Authorization']
        if not token:
            return make_response(jsonify({'message': 'Token is missing !!'}), 401)

        try:
            data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=["HS256"])
            current_user = User.query \
                .filter_by(public_id=data['public_id']) \
                .first()
        except:
            return make_response(jsonify({
                'message': 'Token is invalid !!'
            }), 401)
        return f(*args, **kwargs)

    return decorated

@app.route('/', methods=['POST'])
@cross_origin()
def login():
    auth = json.loads(request.data)
    email = auth['email']
    password = auth['password']
    role = auth['role']

    if not auth or not email or not password:
        return make_response(
            'Please enter your email and password above.',
            401,
            {'WWW-Authenticate': 'Basic realm ="Login required !!"'}
        )

    user = User.query \
        .filter_by(email=email, role=role) \
        .first()

    if not user:
        return make_response(
            'User does not exist.',
            401,
            {'WWW-Authenticate': 'Basic realm ="User does not exist !!"'}
        )

    if check_password_hash(user.password, password):
        token = jwt.encode({
            'public_id': user.public_id,
            'exp': datetime.utcnow() + timedelta(minutes=30)
        }, app.config['SECRET_KEY'])

        return make_response(jsonify({'token': token}), 201)
    return make_response(
        'Password is wrong.',
        403,
        {'WWW-Authenticate': 'Basic realm ="Wrong Password !!"'})


@app.route('/signup', methods=['POST'])
@cross_origin()
def signup():
    record = json.loads(request.data)
    name, email = record['name'], record['email']
    password = record['password']

    if name=='' or email=='' or password=='':
        return make_response('Please fill all the boxes.', 202)
    else:
        user = User.query \
            .filter_by(email=email) \
            .first()
        if not user:
            user = User(
                public_id=str(uuid.uuid4()),
                name=name,
                email=email,
                password=generate_password_hash(password),
                role='User'
            )
            db.session.add(user)
            db.session.commit()

            return make_response('Successfully registered.', 201)

        else:
            return make_response('User already exists. Please Log in.', 202)

@app.route('/data', methods=['POST'])
@cross_origin()
@token_required
def data_entry():
    record = json.loads(request.data)
    brand, model, fuel, kms, year, price = record["brand"], record["model"], record["fuel"], record["kms"], record["year"], record["price"]
    mycar = Car(brand=brand, model=model, fuel=fuel, kms=kms, year=year, price=price)
    db.session.add(mycar)
    db.session.commit()
    return make_response("Successfully posted.", 201)

@app.route('/cars', methods=['POST'])
@cross_origin()
@token_required
def get_data():
    record = json.loads(request.data)

    for key in list(record):
        if record[key] == "All":
            del record[key]

    year = ''
    price = ''
    kms = ''

    if "yearf" in record and "yeart" in record:
        year += ("year between " + record["yearf"] + " and " + record["yeart"])
        del record["yearf"], record["yeart"]
    elif "yearf" in record and "yeart" not in record:
        year += ("year>=" + record["yearf"])
        del record["yearf"]
    elif "yearf" not in record and "yeart" in record:
        year += ("year<=" + record["yeart"])
        del record["yeart"]

    if "pricef" in record and "pricet" in record:
        price += ("price between " + record["pricef"] + " and " + record["pricet"])
        del record["pricef"], record["pricet"]
    elif "pricef" in record and "pricet" not in record:
        price += ("price>=" + record["pricef"])
        del record["pricef"]
    elif "pricef" not in record and "pricet" in record:
        price += ("price<=" + record["pricet"])
        del record["pricet"]

    if "kms" in record:
        kms += ("kms<=" + record["kms"])
        del record["kms"]

    if "model" in record and record["model"] == '':
        del record["model"]

    keys = list(record)
    strings = list(record.values())

    values = []
    for string in strings:
        values.append("'" + string + "'")

    pairlist = []
    for i in range(len(keys)):
        pairlist.append(keys[i] + "=" + values[i])

    if year != '':
        pairlist.append(year)

    if price != '':
        pairlist.append(price)

    if kms != '':
        pairlist.append(kms)

    conditions = ' and '.join(pairlist)

    if conditions == '':
        query = "select * from cars"
    else:
        query = "select * from cars where " + conditions
    result = db.engine.execute(query)
    mydata = [tuple(row) for row in result]
    json_string = json.dumps(mydata)

    return json_string

if __name__ == '__main__':
    app.run()
