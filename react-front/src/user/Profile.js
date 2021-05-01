import React, {Component} from "react";
import { isAuthenticated } from "../auth";
import {Link, Redirect, withRouter} from "react-router-dom";
import { read } from "./apiUser";
import DefaultProfile from "../images/avatar.png";
import DeleteUser from "./DeleteUser";

class Profile extends Component {
    //to create a state
    constructor(props){
       super(props)
       this.state = {
          user:"",
          redirectToSignin:false  //if the user is not signed in redirect to /signin
       }
    }
    
//this refers to the enclosing context of a class
    init = (userId) => {
        const token=isAuthenticated().token;
        read(userId,token).then(data => { //read method gives user's info from backend
          if(data.error){
            //console.log("ram" ,data.error);
              this.setState({redirectToSignin:true});
          } else {
             this.setState({user:data});      
          }
       })
    }

    componentDidMount() { //we can also write it as function componentDidMount() {}
      const userId= this.props.match.params.userId;
      this.init(userId);
      //console.log(this.state.user);
    }

    componentWillReceiveProps(props) {
        const userId = props.match.params.userId;
        this.init(userId);
     }
    

   render() {
       const {redirectToSignin,user}=this.state;
       if(redirectToSignin) {
        return(<Redirect to="/signin" />);
       }

       const photoUrl=user._id?
      `${process.env.REACT_APP_API_URL}/user/photo/${user._id}?${new Date().getTime()}`:DefaultProfile;
      
      
       return (
           <div className="container">
            <h2 className="mt-5 mb-5">Profile</h2>
              <div className="row">
                <div className="col-md-6">
                <img 
                style={{height:"200px" , width:"auto"}}
                className="img-thumbnail"
                src={photoUrl} alt={user.name} />
                </div>
                <div className="col-md-6">
                <div className="lead mt-2">
                  <p>Hello {user.name}</p>
                  <p>Email: {user.email}</p>
                  <p>{`Joined ${new Date(user.created).toDateString()}`}</p>
                </div>
                  {isAuthenticated().user && 
                    isAuthenticated().user._id === user._id && (
                      <div className="d-inline-block">
                          <Link className="btn btn-raised btn-success mr-5"
                          to={`/user/edit/${user._id}`}>
                            Edit Profile
                          </Link>
                          <DeleteUser userId={user._id}/>
                      </div>
                  )}
                </div>
              </div>
           </div>
       );
   }
}

//export default withRouter(Profile);
export default Profile;

//mt-5 +. marginfrom top 5px