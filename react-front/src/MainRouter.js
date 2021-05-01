import React from "react";
import {Route, Switch, withRouter}  from "react-router-dom";
import Home from "./core/Home";
import Menu from "./core/Menu";
import Signup from "./user/Signup";
import Signin from "./user/Signin";
import Profile from "./user/Profile";
import Users from "./user/Users";
import EditProfile from "./user/EditProfile";
import PrivateRoute from "./auth/PrivateRoute";

const MainRouter = () => (
  <div>
     <Menu />
     <Switch>
        <Route exact path="/"><Home /></Route>
        <Route exact path="/users"><Users /></Route>
        <Route exact path="/signup"><Signup /></Route>
        <Route exact path="/signin"><Signin /></Route>
        <PrivateRoute exact path="/user/edit/:userId" component={EditProfile} />
        <PrivateRoute exact path="/user/:userId" component={Profile} />
     </Switch>
  </div>
);

export default MainRouter;


//Switch component is used to switch between componenets based on URL
//user/:userId means anything after user/ will be grabbed as userId
{/* <Route exact path="/user/:userId" location={this.props.location} 
key={this.props.location.key} render={({ location, match }) => (
<Profile key={this.props.location.key} match={match} /> )} /> */}