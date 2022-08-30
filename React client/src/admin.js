import './App.css';
import React from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";


function Admin() {

    const navigate = useNavigate();

    const handleSubmit = (event) => {
        event.preventDefault();
        const email = event.target[0].value
        const password = event.target[1].value

        let data = {"email" : email, "password" : password, "role" : "Admin"}
        axios.post("http://localhost/", data, {headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin' : '*',
                'Access-Control-Allow-Methods':'GET, PUT, POST, OPTIONS, HEAD'}
                })
        .then((response) => {
        console.log(response);
        localStorage.setItem("JWT", response.data.token);
        navigate("/panel");
        })
        .catch((error) => {
            console.log(error);
            document.getElementById("res").innerHTML=error.response.data;
        });
    }

    return (
    <div className="App">
      <header className="App-header">
        <h1 className="App-link">Admin Login</h1>
        <form onSubmit={handleSubmit}>
            <div className="downBy">
                <label>Email:</label>
                <input type="text" label="Email"></input>
                <br></br>
                <label>Password:</label>
                <input type="password" label="Password"></input>
                <br></br>
                <input type="submit" value="Login"/>
            </div>
        </form>
        <p id="res"></p>
      </header>
    </div>
    );
};

export default Admin;