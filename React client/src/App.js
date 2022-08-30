import car from '.public/car.jpg';
import './App.css';
import React from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";


function App() {

    const [selected, setSelected] = React.useState("");
    const [isLoading, setIsLoading] = React.useState(true);
    const [details, setDetails] = React.useState([]);
    const navigate = useNavigate();

    const changeSelectOptionHandler = (event) => {
    setSelected(event.target.value);
  };

    const toLogin = () => {
        navigate("/");
    }

    const mercedes = [
    "All",
    "A Class",
    "SL Class",
    "GLC Class",
  ];

    const prices = ["All", 5000, 10000, 15000, 20000, 25000, 30000, 35000, 40000, 45000, 50000, 60000, 70000,
        80000, 90000, 100000]
    const kms = ["All", 5000, 10000, 20000, 25000, 30000, 35000, 40000, 45000, 50000, 60000, 70000, 80000, 90000,
                    100000, 110000, 120000, 130000, 140000, 150000, 160000, 170000, 180000, 190000, 200000]
    const years = ["All", 2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013,
                    2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022]
    const bmw = ["All", "X5", "X6", "i8", "Z3"];
    const toyota = ["All", "Corolla", "Camry", "Prius", "Land Cruiser"];

    let type = null;
    let options = null;

    if (selected === "Mercedes") {
    type = mercedes;
  } else if (selected === "BMW") {
    type = bmw;
  } else if (selected === "Toyota") {
    type = toyota;
  }

    if (type) {
    options = type.map((el) => <option key={el}>{el}</option>);
  }

    function handleSubmit (event) {
        event.preventDefault();
        const brand = event.target[0].value
        const model = event.target[1].value
        const fuel = event.target[2].value
        const kms = event.target[3].value
        const yearF = event.target[4].value
        const yearT = event.target[5].value
        const priceF = event.target[6].value
        const priceT = event.target[7].value
        let data = {"brand" : brand, "model" : model, "fuel" : fuel, "kms" : kms, "yearf" : yearF, "yeart" : yearT,
                    "pricef" : priceF, "pricet" : priceT}
        let token = localStorage.getItem("JWT");

        axios.post("http://localhost/cars", data, {headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin' : '*',
                'Access-Control-Allow-Methods': 'GET, PUT, POST, OPTIONS, HEAD',
                'Authorization': token
                }
            })
        .then((response) => {
            console.log(response);
            setDetails(response.data);
            console.log(details);
        })
        .catch((error) => {
            console.log(error);
        });
        setTimeout(() => (setIsLoading(false)), 1000);
        }
        function handleChange (event) {
        event.preventDefault();
        setIsLoading(true);
        }


  return (
    <div className="App">
      <header className="App-header">
      <button onClick={toLogin}>Sign Out</button>
        <h1 className="App-link">Car Search Engine</h1>
        <img src={car} className="App-logo" alt="logo" />
        <h2 className="App-link">
          Please enter the car details below.
        </h2>
        <form onSubmit={handleSubmit} onChange={handleChange}>
            <div className="sideBy">
                <div className="downBy">
                    <label>Car brand:</label>
                    <select onChange={changeSelectOptionHandler}>
                        <option>All</option>
                        <option>Mercedes</option>
                        <option>BMW</option>
                        <option>Toyota</option>
                    </select>
                    <br></br>
                    <label>Car model:</label>
                    <select>
                        {options}
                    </select>
                </div>
                <pre>   </pre>
                <div className="downBy">
                    <label>Fuel type:</label>
                    <select>
                        <option>All</option>
                        <option>Petrol</option>
                        <option>Diesel</option>
                        <option>Gas</option>
                        <option>Electric</option>
                    </select>
                    <br></br>
                    <label>Kms up to:</label>
                    <select>
                        {kms.map(km => {
                        return (
                            <option value={km}> {km} </option>
                        )
                        })}
                    </select>
                </div>
                <pre>   </pre>
                <div className="downBy">
                    <label>Year from:</label>
                    <select>
                        {years.map(year => {
                        return (
                            <option value={year}> {year} </option>
                        )
                        })}
                    </select>
                    <br></br>
                    <label>Year to:</label>
                    <select>
                        {years.map(year => {
                        return (
                            <option value={year}> {year} </option>
                        )
                        })}
                    </select>
                </div>
                <pre>   </pre>
                <div className="downBy">
                    <label>Price from:</label>
                    <select>
                        {prices.map(price => {
                        return (
                            <option value={price}> {price} </option>
                        )
                        })}
                    </select>
                    <br></br>
                    <label>Price to:</label>
                    <select>
                        {prices.map(price => {
                        return (
                            <option value={price}> {price} </option>
                        )
                        })}
                    </select>
                </div>
            </div>
            <br></br>
            <input type="submit" value="Search"></input>
        </form>
        <div>
            {isLoading === false &&
            <table>
                <thead>
                    <tr>
                        <th> ID </th>
                        <th> Brand </th>
                        <th> Model </th>
                        <th> Fuel </th>
                        <th> Kilometers </th>
                        <th> Year </th>
                        <th> Price </th>
                    </tr>
                </thead>
                <tbody>
                    {details.map(item => {
                    return (
                        <tr key={item[0]}>
                            <td> {item[0]} </td>
                            <td> {item[1]} </td>
                            <td> {item[2]} </td>
                            <td> {item[3]} </td>
                            <td> {item[4]} </td>
                            <td> {item[5]} </td>
                            <td> {item[6]} </td>
                        </tr>
                        );
                        })}
                </tbody>
            </table>
            }
        </div>
      </header>
    </div>
  );
};
export default App;
