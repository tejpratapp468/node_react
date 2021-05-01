import React, {Component} from "react";
import { BrowserRouter,Switch,Route,Link} from "react-router-dom";
import  MainRouter from "./MainRouter";

const App = () => (
  <BrowserRouter>
    <MainRouter />
  </BrowserRouter>
);


export default App;

//BrowserRouter is used to wrap up all the routes
