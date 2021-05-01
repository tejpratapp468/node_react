import React, {Component} from "react";
import { list } from "./apiUser";
import DefaultProfile from "../images/avatar.png";
import { Link } from "react-router-dom";

class Users extends Component { //user is child className of Componenet
  constructor(){
    super();
    this.state={
        users: []
    };
  }

  componentDidMount() {
    console.log('changed');
    list().then(data => {
      if(data.error) {
        console.log(data.error);
      } else {
        this.setState({users:data});
      }
    });
  }

 renderUsers = users => (
    <div className="row">
    {users.map( (user, i) => 
      <div className="card col-md-4" key={i}>
        <img 
        style={{height:"200px" , width:"auto"}}
        className="img-thumbnail"
        src={`${process.env.REACT_APP_API_URL}/user/photo/${user._id}`} alt={user.name}
        onError={i => (i.target.src=`${DefaultProfile}`)} //On any error set image src=DefaultProfile
        alt={user.name}
      />
      <div className="card-body">
        <h5 className="card-title">{user.name}</h5>
        <p className="card-text">{user.email}</p>
        <Link to={`/user/${user._id}`}
        className="btn btn-raised btn-primary btn-sm">View Profile</Link>
      </div>
      </div>
    )}
   </div>
 );

  render(){
    const {users} = this.state;
      return (
          <div className="container">
             <h2 className="mt-5 mb-5">Users</h2>
             {this.renderUsers(users)}
          </div>
      );
  }
}

export default Users;

//-React require us to have unique key for each element we are rendering.
