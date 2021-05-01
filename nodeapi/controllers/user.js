//Features like user profile update etc will be in this user controller file
const _=require("lodash"); //we use '_' to use lodash by convention
const User=require("../models/user.js");
//formidable Node.js module for parsing form data, especially file uploads.
const formidable=require("formidable");
//'fs'=file-system is a core nodejs module which gives access to file system on yuor pc
const fs=require("fs");

exports.userById = (req, res, next, id) => { //here id is coming from req parameter userId
  // console.log("userid",typeof(id)); 
  //id = mongoose.Types.ObjectId(id);
  User.findById(id)
  .exec( (err, user) => {
     if(err || !user){
      console.log("err user1",err);
       return res.status(400).json({
         error:"User not found!"
       })
     }
     //Now we will append that user object which contain information like(email,name) to req
     req.profile = user;/*this will add a new property called profile in req object that
    will contain all user info*/
    //console.log("req profile",req.profile);
    next();//Now our application will go to next phase,lets the application flow

   })
}

//this method will be used when user tries to create,post,update or delete his post
exports.hasAuthorization = (req, res, next) => {
    const authorized = req.profile && req.auth && req.profile._id === req.auth._id;
    if(!authorized) {
      return res.status(403).json({
        error: "User is not authorized to perform this action"
      })
    }
}

//to get all the users info
exports.allUsers = (req,res) => {
  User.find((err,users) => {
    if(err){
      return res.status(400).json({
        error:err
      });
    }
    res.json(users); //can be written as res.json({users:users})
  }).select("name email updated created");
};

//to fetch a single user's infor
exports.getUser = (req,res) => {
  req.profile.hashed_password=undefined;//to hide these data to other users
  req.profile.salt=undefined;
  //console.log("req prof2",req.profile);
  return res.json(req.profile);//return profile object from request
}

//method to update user profile
// exports.updateUser = (req, res, next) => {
//   let user=req.profile //as long as we have userId in the request userById method will be
//                        //executed & we will have user profile in request

//   //extend method mutates the source object i.e. first parameteris updated by 2nd parameter
//   user=_.extend(user, req.body);//we extend the user object with this updated req.body new info
//   user.updated=Date.now();
//   user.save( err => {
//     if(err) {
//       return res.status(400).json({
//         error: "You are not authorized to perform this action"
//       })
//     }
//       //we don't want to send hashed_password ans salt
//       user.hashed_password=undefined;
//       user.salt=undefined;
//       res.json({user});
//   });
// }
exports.updateUser = (req,res,next) => {
    let form=new formidable.IncomingForm(); //this will handle the incoming form request
    form.keepExtensions=true; //we want to keep the extension of the file e.g.jpg,png

    form.parse(req, (err,fields,files) => { //function is how we want to handle data in req,we parse the request to have err,fields,files
       if(err) {
         return res.status(400).json({
           error:"Photo could not be uploaded"
         })
       }
       //save user
       let user=req.profile; //whenever we get userId in url that will run userById method and that makes user avaialable in req.profile
       user=_.extend(user,fields); //extend method mutates the source object i.e. first parameteris updated by 2nd parameter
                                //Here we extend the user object with this updated field info
       user.updated=Date.now();

       if(files.photo) {//if files have photo
        //store the file using readFileSync() method
        user.photo.data=fs.readFileSync(files.photo.path);//read file synchronously will read photo.path
        user.photo.contentType=files.photo.type;
      }
      
        user.save( err => {
        if(err) {
          return res.status(400).json({
            error: err
          })
        }
          //we don't want to send hashed_password ans salt to frontend
          user.hashed_password=undefined;
          user.salt=undefined;
          res.json({user});
      });

    })
  }

exports.userPhoto = (req,res,next) => {
   if(req.profile.photo.data) {
      res.set(("Content-Type",req.profile.photo.contentType)); //before sending res set the headers
      return res.send(req.profile.photo.data);
    }
}

//method to deleteuser profile
exports.deleteUser=(req,res,next) => {
  let user=req.profile;
  // remove() removes all documents that match the query expression.
  user.remove((err,deletedUser) => {
    if(err) {
      res.status(400).json({
        error:err
      });
    }
    res.json({message:"User account has been deleted Successfully!"});//this is optional we can also send json response of deleted user"
  })
}


//MongoDB is happy to accommodate large documents of up to 16 MB in collections,