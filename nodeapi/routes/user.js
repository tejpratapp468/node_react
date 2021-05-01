const express=require("express");
const { userById, allUsers, getUser, updateUser, 
deleteUser, userPhoto }=require("../controllers/user.js");
const { requiredSignin }=require("../controllers/auth");

//Router is a method from express is used when you want to create a new router object in your program
//to handle requests.
const router=express.Router();

//this route(to show all the users) is accessible for everyone we don't want authentication
router.get("/users",allUsers);

//anything we pass after user/ will be captured as userId e.g user/5cthehrtt987 i.e. user/userId & with this we will be able to grab userId
router.get("/user/:userId",requiredSignin, getUser); //getUser() will return req.profile & profile will be
                                  //available bcz userById() method has already run
//to update info we use http route put
router.put("/user/:userId",requiredSignin, updateUser);

//to delete info we use http routr delete
router.delete("/user/:userId",requiredSignin, deleteUser);

// to show user photo
router.get("/user/photo/:userId", userPhoto);

/*we are looking for the parameter 'userId' in the incoming request url by using param() method,
so any route containing parameter called 'userId' our app will first execute a method  userById()*/
router.param("userId", userById);

module.exports=router;
