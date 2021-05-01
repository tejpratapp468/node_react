import React from 'react';
import {Link, withRouter} from 'react-router-dom';
//withRouter is a higher order componenet which means it takes another component as argument
import {signout, isAuthenticated} from "../auth"; //index name loads automatically

const isActive = (history,path) => {
    if(history.location.pathname===path) return {color:"#ff9900"};
    else return{color:"#ffffff"}
};


//we don't need class component as we don't need states,so we wil create functional component.
const Menu = ({history}) => (
    <div>
        <ul className="nav nav-tabs bg-primary">
            <li class="nav-item">
                <Link class="nav-item nav-link" style={isActive(history,"/")} 
                to="/">Home</Link>
            </li>

            <li class="nav-item">
                <Link class="nav-item nav-link" style={isActive(history,"/users")} 
                to="/users">Users</Link>
            </li>
           
           {!isAuthenticated() && (
            <>
                <li class="nav-item">
                    <Link class="nav-item nav-link" style={isActive(history,"/signup")} 
                    to="/signup">Sign up</Link>
                </li>
                <li class="nav-item">
                    <Link class="nav-item nav-link" style={isActive(history,"/signin")} 
                    to="/signin">Sign in</Link>
                 </li>
            </>
           )}
           
           {isAuthenticated() && (
            <>
            <li class="nav-item">
                <span class="nav-item nav-link" style={isActive(history,"/signout"),
                {cursor:"pointer",color:"#fff"} } 
                onClick = {() => signout(() => history.push("/")) } >
                Sign out</span>
            </li>

            <li class="nav-item">
                <Link to={`/user/${isAuthenticated().user._id}`}
                  style={isActive(history,`/user/${isAuthenticated().user._id}`)} 
                  class="nav-item nav-link" >
                   {`${isAuthenticated().user.name}'s profile`}
                </Link>
            </li>
            </>
           )}
        </ul>
    </div>
);

export default withRouter(Menu); 
//we are giving menu component to higher order component withRouter as an argument
//with this we get access to props,with this we get access to history object i.e.props.history
//Benefit of Link: Only component will change environment stays same
