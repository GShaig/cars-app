import './App.css';
import React from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";


function Login() {

    const navigate = useNavigate();

    const handleClick = () => {
        navigate("/signup");
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        const email = event.target[0].value
        const password = event.target[1].value

        let data = {"email" : email, "password" : password, "role" : "User"}
        axios.post("http://localhost/", data, {headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin' : '*',
                'Access-Control-Allow-Methods':'GET, PUT, POST, OPTIONS, HEAD'}
                })
        .then((response) => {
        console.log(response);
        localStorage.setItem("JWT", response.data.token);
        navigate("/cars");
        })
        .catch((error) => {
            console.log(error);
            document.getElementById("res").innerHTML=error.response.data;
        });
    }

    return (
    <div className="App">
      <header className="App-header">
      <h1 className="App-link">Please Login</h1>
        <form onSubmit={handleSubmit}>
            <div className="downBy">
                <label>Email:</label>
                <input type="email"></input>
                <br></br>
                <label>Password:</label>
                <input type="password"></input>
                <br></br>
                <input type="submit" value="Login"/>
            </div>
        </form>
        <h3 className="App-link">Not a member yet?</h3>
        <button onClick={handleClick}>Sign Up</button>
        <p id="res"></p>
      </header>
    </div>
    );
};

export default Login;