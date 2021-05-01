 //this file will have all auth routes like login,signup
const express=require("express");
const { signup, signin, signout }=require("../controllers/auth");
const { userById }=require("../controllers/user.js");
const { userSignupValidator } = require("../validator"); //we don't need to write validator/index.js bcz
//index.js file will be loaded automatically by using name of folder, Benefit of creating index file

//Router is a method from express is used when you want to create a new router object in your program
//to handle requests.
const router=express.Router();


//this is a post request bcz from frontend we are going to post to backend
//userSignupValidator will apply validation, if all those validation pass only then flow will go to controller signup
router.post("/signup", userSignupValidator, signup);
router.post("/signin",signin); //we don't need validator since we are authenticating user in sigin method

//Signout is a get request bcz we are not posting anything
router.get("/signout",signout);

/*we are looking for the parameter 'userId' in the incoming request url by using param() method,
so any route containing parameter called 'userId' our app will first execute a method  userById()*/
router.param("userId", userById);

module.exports=router;
