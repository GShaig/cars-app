import './App.css';
import React from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";

function Signup() {

    const navigate = useNavigate();

    const handleSubmit = (event) => {
        event.preventDefault();
        const name = event.target[0].value
        const email = event.target[1].value
        const password = event.target[2].value

        let data = {"name" : name, "email" : email, "password" : password}
        console.log(data);

        axios.post("http://localhost/signup", data, {headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin' : '*',
                'Access-Control-Allow-Methods':'GET, PUT, POST, OPTIONS, HEAD'}
                })
        .then((response) => {
        console.log(response);
        if (response.data === "Successfully registered.") {
            navigate("/");
        } else {
            document.getElementById("res").innerHTML=response.data;
        }
        })
        .catch((error) => {
            console.log(error);
        });
    }


    return (
    <div className="App">
      <header className="App-header">
      <h1 className="App-link">Please Signup</h1>
        <form onSubmit={handleSubmit}>
            <div className="downBy">
                <label>Name:</label>
                <input type="text"></input>
                <br></br>
                <label>Email:</label>
                <input type="email"></input>
                <br></br>
                <label>Password:</label>
                <input type="password"></input>
                <br></br>
                <input type="submit" value="Sign Up"/>
            </div>
        </form>
        <p id="res"></p>
      </header>
    </div>
    );
};
export default Signup;