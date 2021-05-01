import React, {Component} from "react";
import {Redirect} from "react-router-dom";
import {signin, authenticate} from "../auth"; //index name loads automatically

class Signin extends Component {
    constructor(){
        super()
        //we will grab user's value from form & will populate the state field
        this.state ={  
            email:"",
            password:"",
            error:"",
            redirecToReferer:false,
            loading:false
        };
    }

    handleChange = name => event => {
        this.setState({error:""});//on change clear the old errors
        this.setState({[name] : event.target.value});
    };
    

    clickSubmit = event => {
        event.preventDefault();
        this.setState({loading:true});
        const {email,password}=this.state;   

        //creating new user
        const user={
            email, //email:email
            password //passsword:password
        };

       // console.log(user);
       signin(user).then(data => {
          if(data.error) {
            this.setState({error:data.error, loading:false});
          } else{
             //step 1:Authenticate
             authenticate(data, () => {
                this.setState({redirecToReferer:true});
             });//data contains user info,jwt token etc upon successful signin
             //step 2:Redirect
          }
       });

    }

    signinForm = (email,password) => (
        <form>
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
            <button 
                onClick={this.clickSubmit} 
                className="btn btn-raised btn-primary"> 
                Submit 
            </button>
        </form>
    );

    render() {
        const {email,password,error,redirecToReferer,loading}=this.state; //Destructuring

       if(redirecToReferer) {
           return <Redirect to="/" />
       }

        return (
            <div className="container">
                <h2 className="mt-5 mb-5">Sign In</h2>

                <div 
                    className="alert alert-warning"
                    style={{display:error?"":"none"}} 
                >
                    {error}
                </div>

                {loading? (
                    <div className="jumbotron text-center">
                       <h2>Loading...</h2>
                    </div>):("")}


                {this.signinForm(email,password)}
              
            </div>
        );
    }
}

export default Signin;

//1.mt=margint-top
/*2. value={this.state.name} //changes will be available in the state with name,In this
way input field and state will sync with each other, known as controlled component*/
/*3. fetch is a method that provides an easy, logical way to fetch resources asynchronously across the 
network.*/
/*4.  event.preventDefault(); this will prevent the deafault behaviour, e.g. page will
 not reload on clicking submit button*/
/*5. Rendering a <Redirect> will navigate to a new location. The new location will 
 override the current location in the history stack, like server-side redirects 
 (HTTP 3xx) do.*/
 //6. we should have window object to acess local storage