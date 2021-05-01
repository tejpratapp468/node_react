import React, {Component} from "react";
import {signup} from "../auth"; //index name loads automatically
import {Link} from "react-router-dom";

class Signup extends Component {
    constructor(){
        super()
        //we will grab user's value from form & will populate the state field
        this.state ={
            name:"",
            email:"",
            password:"",
            error:"",
            open:false
        }
    }

    handleChange = name => event => {
        this.setState({error:""});//on change clear the old errors
        this.setState({[name] : event.target.value});
    };

    clickSubmit = event => {
        event.preventDefault();/*this will prevent the deafault behaviour, 
                               e.g. page will not reload on clicking submit button*/
        const {name,email,password}=this.state;   

        //creating new user
        const user={
            name, //same as name:name since key:value pair is same so we can write {name}
            email, //email:email
            password //passsword:password
        }

        //console.log(user);
       signup(user).then(data => {
          if(data.error) this.setState({error:data.error});
          else
             this.setState({ //after creating newuser clear all values so they don't stay
                 error:"",
                 name:"",
                 email:"",
                 password:"",
                 open:true
             });
       });

    }


    signupForm = (name,email,password) => (
        <form>
            <div className="form-group">
                <label className="text-muted">Profile Photo</label>
                <input 
                    onChange={this.handleChange("photo")}
                    type="file" 
                    accept="image/*" //Accept any file with an image/*
                    className="form-control"  
                />
            </div>
            <div className="form-group">
                <label className="text-muted">Name</label>
                <input 
                    onChange={this.handleChange("name")}
                    type="text" 
                    className="form-control"
                    value={name} //changes will be available in the state with name   
                />
            </div>
            <div className="form-group">
                <label className="text-muted">Email</label>
                <input 
                    onChange={this.handleChange("email")}
                    type="email" 
                    className="form-control"
                    value={email}
                />
            </div>
            <div className="form-group">
                <label className="text-muted">Password</label>
                <input  
                    onChange={this.handleChange("password")} 
                    type="password" 
                    className="form-control"
                    value={password} 
                />
            </div>
            <button onClick={this.clickSubmit} className="btn btn-raised btn-primary"> 
            Submit </button>
        </form>
    );

    render() {
        const {name,email,password,error,open}=this.state; //Destructuring
        return (
            <div className="container">
                <h2 className="mt-5 mb-5">Signup</h2>

                <div 
                    className="alert alert-warning"
                    style={{display:error?"":"none"}} 
                >
                    {error}
                </div>

                <div 
                    className="alert alert-info"
                    style={{display:open?"":"none"}} 
                >
                    New Account Created Successfully!! Please {" "}
                    <Link to="/signin">Sign In</Link>
                </div>

                {this.signupForm(name,email,password)}
              
            </div>
        );
    }
}

export default Signup;

/* value={this.state.name} //changes will be available in the state with name,In this
way input field and state will sync with each other, known as controlled component*/
/* fetch is a method that provides an easy, logical way to fetch resources asynchronously across the 
network.*/