const mongoose = require("mongoose");
const {ObjectId} =mongoose.Schema; //we can refer to the object id of any of the schema

//method to make new Schema
const postSchema=new mongoose.Schema({
    title:{
      type: String,
      required: true
      // minlength: 4, :we get rid of this because we have validation in validator
      // maxlength: 150
    },

    body:{
      type: String,
      required: true
      // minlength: 4,
      // maxlength: 2000
    },

    photo:{
      type:Buffer, /*buffer is used to store binary data like img,videos which are big in size,when we upload img it go from
      fontend to backend in request.body.So it takes some time to receive entire img,until it is fully received by backend
      it is avaialable in buffer.In buffer we store data  in binary format.*/
      contentType:String //this stores img info such as file format
    },

    postedBy: { //this field buids relationship b/w user & post i.e. 'This post created by this user'
      type:ObjectId,
      ref:"User" //reference is of type User model
    },

    created:{
      type:Date,
      default:Date.now
    }

});

const Post=mongoose.model("Post",postSchema);
module.exports=Post;
