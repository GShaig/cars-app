# Cars App

Cars App is a car listing app which gets a list of cars from a database based on user input filters.

### Client: React JS
### API: Flask
### Reverse proxy: Nginx
### Databases: MariaDB; MSSQL Express
### Deployment: Docker

## Client
Application frontend was developed on JavaScript React framework. Will run on React default port (http://localhost:3000/).

## API
Application backend was developed on Python Flask framework. Will run on Flask default port (http://localhost:5000/).

## Reverse proxy
Nginx server is used as a reverse proxy in this application. This server will run on port 80.

## Database
Aplication can work with both MariaDB MySQL and Microsoft SQL Express databases. Configuration for MSSQL Express was commented out for testing and deployment purposes. SQLAlchemy library is used for querying and managing the databases.

## Deployment technology
Docker and docker-compose was used for deployment of the application as Docker images. You can find Dockerfiles in relevant folders for each part of the application. Please find 'Docker-compose.yaml' file in repository root folder.

## Environment variables
Environment variables will be pulled from your .flaskenv file automatically by docker-compose configuration.

## Authentication
Json Web Token (JWT) is used for user authentication. Returned token is saved in a browser cookie and returned with every request the user makes. 

## Admin panel
You can reach to the admin panel with the help of '/admin' relative pass. Admin panel will be used mainly for data entry purposes. User accounts will not be able to sign in to the admin panel. Admin accounts can be created only by system administrators. 

## Running
In order to run the API on localhost, please go to the folder where 'api.py' located and run below command:
### `py api.py`

To run the client on localhost, go to the 'src' folder and run below command:
### `npm start`

For docker deployment, please go to the folder where 'docker-compose.yaml' file is located and run below command:
### `docker-compose up`

Thank you!
