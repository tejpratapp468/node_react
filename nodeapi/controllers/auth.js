//we will having authentication method in this file like login,registration etc.

const jwt=require('jsonwebtoken');//Using jsonwebtoken package  login authentication status will be maintained
require('dotenv').config();//because we want to import some variables from .env file
const expressJwt = require('express-jwt');
const User=require("../models/user.js");

exports.signup= async(req,res) => { //this is a async function so we will wait for certain data to come to us.
  //to check if user already exist this process will take some time few sec or msec not instantly so we will
  //await for the result
  const userExist= await User.findOne({email:req.body.email});
  if(userExist) return res.status(403).json({
    error:"This email already exist!"
  });
  const user=await new User(req.body); //await to create a new user
  await user.save();//await for user to save as this will take time
    //await Promise.reject(new Error('test'));
  res.status(200).json({ message:"Signup Success!Please login" });
}

exports.signin = (req,res) => {
  //find the user based on Email
  const {email,password}=req.body;
  User.findOne({email},(err,user) => {
     //if error or no user
     if(err || !user){
       return res.status(401).json({ //The HTTP 401 Unauthorized client error status response code
          error:"User with that email doesn't exist.Please Signin."
       })
     }
     //if user is found make sure that email and password should match means authenticate
     //create authentication method in User model and use here
     if(!user.authenticate(password)) {
       return res.status(401).json({ //The HTTP 401 Unauthorized client error status response code
          error:"Email and password doesn't match."
       })
     }

    //if user is authenticated then generate a signed token with userid and secret that we created in .env file
     const token=jwt.sign({_id:user.id},process.env.JWT_SECRET);
     //persist the token as 't' as cookie with expiry date ,this token is available in res.cookie()
     res.cookie("t",token,{expire: new Date()+9999});//t is the name of token,& 9999sec is the expiry time after signin

     /*return response with user{name,email,basic info etc.} and token(to be used in frontend
     to authenticate user) to frontend client */
     const {_id,name,email}=user;
     //this res is actual response,later we use this token to identify that user is logged in &
     //we give them certain authority like create,delete,update post ect
     return res.json({token,user:{ _id,name,email }});

  });

}

exports.signout = (req,res) => {
  //to signout we need to clear the cookie with name "t" as above
  res.clearCookie("t"); //now user will not be authenticated & all tokens will be invalid
  return res.json({message: "Signout Success!"});
}

exports.requiredSignin = expressJwt({
  //this function check if secret key is present request token or not,if present then allow
  /*when user tries to access some protected routes we expect the client app to send
  the secret key & token to server, we will get this only if user is signedin bcz when
  we created jwt token on sigin we passes user.id as well as JWT_SECRET*/
  //If the token is valid, express jwt appends the verified user id in an auth key to the
  //request object
   secret: process.env.JWT_SECRET,
   userProperty: "auth", //we have added a property called auth to userProperty key for authentication purpose,
                         //we have added auth property to request so that we know user is authenticated
   algorithms: ['HS256']
});
