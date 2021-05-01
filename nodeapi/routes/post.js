const express=require("express");
const {getPosts, createPost, postByUser, postById, isPoster, deletePost,
   updatePost}=require("../controllers/post.js");
const { requiredSignin }=require("../controllers/auth");
const { userById }=require("../controllers/user.js");
const { createPostValidator } = require("../validator"); //we don't need to write validator/index.js bcz
//index.js file will be loaded automatically by using name of folder, Benefit of creating index file

//Router is a method from express is used when you want to create a new router object in your program
//to handle requests.
const router=express.Router();

router.get("/posts", getPosts); //router.get("/",postController.getPosts);

//this is a post request bcz from frontend we are going to post to backend
/*requiredSignin will check for secret if secret is not found access to "/post" route will
 not be given, To create a new post user must be signed in*/
//after createPostValidator method flow will go to next midlleware createPost
/*anything we pass after post/new/ will be captured as userId e.g post/new/5cthehrtt987 i.e. user/userId
& with this we will be able to grab userId*/
router.post("/post/new/:userId",
 requiredSignin ,createPost, createPostValidator );/*currently create post is handled by formidable
 package,so this package t.e.createPost should run first before we go for validator*/

//to get all the posts of a particular user
 router.get("/posts/by/:userId",requiredSignin, postByUser);

//method to delete a post
//User must be signed in and user should be correct user(i.e. he must be same who created post)
router.delete("/post/:postId", requiredSignin, isPoster, deletePost);

//method to update post to update info we use http route put
router.put("/post/:postId", requiredSignin, isPoster, updatePost);

/*we are looking for the parameter 'userId' in the incoming request url by using param() method,
so any route containing parameter called 'userId' our app will first execute a method  userById()*/
router.param("userId", userById);

//any route containing :postId, our app will first execute postById()
router.param("postId", postById);

module.exports=router;

//method 2)
// module.exports = {
//   getPosts
// };
