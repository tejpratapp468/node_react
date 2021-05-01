import React , {Component} from "react";
import { isAuthenticated } from "../auth";
import {read, update} from "./apiUser";
import {Redirect} from "react-router-dom";
import DefaultProfile from "../images/avatar.png";

class EditProfile extends Component {

    constructor(){
        super();
        this.state={
            id:"",
            name:"",
            email:"",
            password:"",
            redirectToProfile:false,
            error:"",
            fileSize:0,
            loading:false,
            fileSize:0
        };
     }
    init = (userId) => {
        const token=isAuthenticated().token;
        read(userId,token).then(data => { //read method gives user's info from backend
          if(data.error){
              this.setState({redirectToProfile:true});
          } else {
            //we are not storing password if user wants to change they can change their password
             this.setState({
                 id:data._id, name:data.name, email:data.email, error:""
                });    
          }
       })
    }

    componentDidMount() { //we can also write it as function componentDidMount() {}
      this.userData=new FormData(); //userData is a form type data not json type data
      const userId= this.props.match.params.userId;
      this.init(userId);
    }
    
    isValid = () => {
        const {name,email,password,fileSize}=this.state;
        if (fileSize > 100000) { //1000000=1mb
            this.setState({
              error: "File size should not be more than 100kb",
              loading: false
            });
            return false;
        }
        if(name.length === 0) {
            this.setState({error:"Name is required"});
        }
        //we have regular exprtession for email validation email@domain.com
        if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
            this.setState({
              error: "A valid Email is required",
              loading: false
            });
            return false;
          }
          if (password.length >= 1 && password.length <= 5) {
            this.setState({
              error: "Password must be at least 6 characters long",
              loading: false
            });
            return false;
          }
          return true;
    };

    handleChange = name => event => {
        this.setState({error:""});
        const value = name==="photo"?event.target.files[0]:event.target.value;
        const fileSize = name==="photo"?event.target.files[0].size: 0 ;
        this.userData.set(name,value);
        this.setState({[name] : value, fileSize});
    };

    clickSubmit = event => {
        event.preventDefault();/*this will prevent the deafault behaviour, 
                               e.g. page will not reload on clicking submit button*/
        this.setState({loading:true});
       if(this.isValid()) {
          //creating new user
            // const user={
            //     name, //same as name:name since key:value pair is same so we can write {name}
            //     email, //email:email
            //     password: password || undefined //passsword:password
            // };
        
            const userId= this.props.match.params.userId;
            const token=isAuthenticated().token;
            update(userId,token,this.userData).then(data => {
                if(data.error) this.setState({error:data.error});
                else
                    this.setState({ 
                        redirectToProfile:true
                    });
            });
       }
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
            Update </button>
        </form>
    );


   render() {
    const {id,name,email,password,redirectToProfile,error,loading}=this.state;
      if(redirectToProfile) return <Redirect to={`/user/${id}`} />

      const photoUrl=id?
      `${process.env.REACT_APP_API_URL}/user/photo/${id}?${new Date().getTime()}`:DefaultProfile;
      
       return(
           <div className="container">
               <h2 className="mt-5 mb-5">Edit Profile</h2>
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

                <img 
                style={{height:"200px" , width:"auto"}}
                className="img-thumbnail"
                src={photoUrl} alt={name} />

               {this.signupForm(name,email,password)}
           </div>
       )
   }
};

export default EditProfile;

//photo display is based on behaviour of browser, it might take some time to display image