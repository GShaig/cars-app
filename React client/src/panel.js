import './App.css';
import React from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";

function Panel() {

    const navigate = useNavigate();

    const toLogin = () => {
        navigate('/admin');
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        const brand = event.target[0].value
        const model = event.target[1].value
        const fuel = event.target[2].value
        const kms = event.target[3].value
        const year = event.target[4].value
        const price = event.target[5].value

        let data = {"brand" : brand, "model" : model, "fuel" : fuel, "kms" : kms, "year" : year, "price" : price}
        console.log(data);
        let token = localStorage.getItem("JWT");

        axios.post("http://localhost/data", data, {headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin' : '*',
                'Access-Control-Allow-Methods':'GET, PUT, POST, OPTIONS, HEAD',
                'Authorization': token}
                })
        .then((response) => {
            console.log(response);
            document.getElementById("res").innerHTML=response.data;
        })
        .catch((error) => {
            console.log(error);
        });
    }


    return (
    <div className="App">
      <header className="App-header">
      <button onClick={toLogin}>Sign Out</button>
      <h1 className="App-link">Admin Panel</h1>
      <h2 className="App-link">
          Please enter the car details below.
      </h2>
        <form onSubmit={handleSubmit}>
            <div className="sideBy">
                <div className="downBy">
                    <label>Car brand:</label>
                    <input type="text"></input>
                    <br></br>
                    <label>Car model:</label>
                    <input type="text"></input>
                </div>
                <pre>   </pre>
                <div className="downBy">
                    <label>Fuel type:</label>
                    <input type="text"></input>
                    <br></br>
                    <label>Kilometers:</label>
                    <input type="number" step="1"></input>
                </div>
                <pre>   </pre>
                <div className="downBy">
                    <label>Year:</label>
                    <input type="number" step="1"></input>
                    <br></br>
                    <label>Price ($):</label>
                    <input type="number" step="1"></input>
                </div>
            </div>
            <br></br>
            <input type="submit" value="Enter"></input>
        </form>
        <p id="res"></p>
      </header>
    </div>
    );
};
export default Panel;