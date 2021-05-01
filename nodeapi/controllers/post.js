const Post=require("../models/post.js");
//formidable Node.js module for parsing form data, especially file uploads.
const formidable=require("formidable");
//'fs'=file-system is a core nodejs module which gives access to file system on yuor pc
const fs=require("fs");
const _=require("lodash"); //we use '_' to use lodash by convention

exports.postById = (req,res,next,id) => { //here id is coming from url req parameter postId
  Post.findById(id)
   .populate("postedBy","_id name") //bcz we need user info from User model
   .exec((err, post) => {  //execute a callback function to handle error or post
      if(err || !post){
        return res.status(400).json({
          error:err
        })
      }
      /*this will add a new property called post in req object that will contain post info based on id*/
      req.post=post;
      next();//continue with the flow of application, app will continue to next middleware
   })
}

exports.getPosts = (req,res) => {
  //json format is just like an JS object
  //Post model gives us the post collection from database
  const posts=Post.find()
  .populate("postedBy","_id name") //populate() method lets you reference documents in other collections.
                                  //since postedByfield reference to User model not post model
  .select("_id title body")
  .then(posts => res.json({posts})) //since key:value name is same we can write it as ({posts:posts}) to ({posts})
  .catch(error => console.log(error.message));
};

exports.createPost = (req,res,next) => {
  /*here createPost method expects incoming data as form data bz we are using formidable package
  since we have to upload image later,so in postman use x-www-form-urlencoded to send post request*/
  let form=new formidable.IncomingForm();//This will give us the Incoming form fields

  form.keepExtensions=true;//we want to keep the extension of the file e.g.jpg,png

  form.parse(req,(err, fields, files) => { //we parse the request to have err,fields,files
    if(err) {
      return res.status(400).json({
        error:"Image could not be uploaded"
      })
    }
    let post=new Post(fields);//creating new post with all of fields coming from request

    //to hide these data to other users
    req.profile.hashed_password=undefined;
    req.profile.salt=undefined;
    post.postedBy=req.profile;//we are assigning new post to the user
    //console.log("PROFILE",req.profile);

    if(files.photo) {//if files have photo
      //store the file using readFileSync() method
      post.photo.data=fs.readFileSync(files.photo.path);//read file synchronously will read photo.path

      post.photo.contentType=files.photo.type;
    }
    post.save((err,result) => {
      if(err){
        res.status(400).json({
          error:err
        })
      }
      res.json(result); //we will return json result i.e. post  as it is without any wrap like {result};
    })

  })

  // const post=new Post(req.body);
  // post.save()
  // .then(result => {
  //   res.status(200).json({
  //      post:result  //here first value is key we can give it any name,second is value of key
  //   });
  // });
  //No need of error check since we are checking errors in validator
};

//we can get all the posts of user based on postedBy field of post model
exports.postByUser = (req,res) => {
  /*populate() method lets you reference documents in other collections, since postedByfield reference to
User model not post model so we will use populate() method, Otherwise if everything inside same model
then we can use select() method to select particular property.*/

  Post.find({postedBy: req.profile._id}) //user will come from req.profile._id
    .populate("postedBy","_id name")
    .sort("created") //basedon created date posts of particular user will be sorted out
    .exec((err, posts) => { //after finding all the post,populate & then sort we will execute a particular callback funcn
       if(err) {
         return res.status(400).json({
           error:err
         })
       }
       res.json(posts);//not({posts}) bcz we don't want to wrap a post
    })

}

exports.isPoster = (req,res,next) => {
    //isPoster will be true only if we have authenticated correct user who actually created the post
    let isPoster= req.post && req.auth && req.post.postedBy._id == req.auth._id;
    if(!isPoster)
    {
      /*The HTTP 403 Forbidden client error status response code indicates that the server understood
      the request but refuses to authorize it. */
      return res.status.json(403).json({
         error:"User is authorized"
      })
    }
    next();//if no error then continue to next middleware
}

exports.updatePost = (req,res,next) => {
   let post=req.post; //currently req.post=post
   //extend method mutates the source object i.e. first parameteris updated by 2nd parameter
   post=_.extend(post, req.body);//we extend the post object with this updated req.body new info
   //now req.post.body=req.body
    post.updated=Date.now();
    post.save(err => {
      if(err){
        res.status(400).json({
          error:err
        });
      }
      res.json(post);
    })
}


//method to delete post
exports.deletePost = (req,res) => {
  /*The remove() method is unique in that it sends a remove command directly to MongoDB with
  no Mongoose documents involved,this method returns deleted object*/
  let post=req.post; //from postById we will be having req.post
  post.remove((err,deleted_post) => {  //we can also write this method as post.remove(), but practice to write proper method
      if(err) {
        return res.status(400).json({
          error:err
        })
      }
      res.json({
        message:"Post deleted Successfully"
      })
  });
};
