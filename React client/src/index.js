import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Admin from './admin';
import Panel from './panel';
import Login from './login';
import App from './App';
import Signup from './signup';
import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Router>
    <Routes>
        <Route exact path='/' element={< Login />}></Route>
        <Route exact path='/cars' element={< App />}></Route>
        <Route exact path='/signup' element={< Signup />}></Route>
        <Route exact path='/admin' element={< Admin />}></Route>
        <Route exact path='/panel' element={< Panel />}></Route>
    </Routes>
  </Router>
);
