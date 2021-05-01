exports.createPostValidator=(req,res,next) => {
   //Checking errors for Title
   req.check("title","Write a title").notEmpty();
   req.check("title","Title must be between 4 to 150 characters").isLength({
       min: 4,
       max: 150
   });

   //Checking body for Title
   req.check("body","Write a title").notEmpty();
   req.check("body","Body must be between 4 to 2000 characters").isLength({
       min: 4,
       max: 2000
   });

   //check for  errors
  const errors=req.validationErrors();

   //If error show the first one as they happen
   if(errors) {
     const firstError = errors.map(error => error.msg)[0];
     return res.status(400).json({error:firstError});
   }

   //error will not halt out nodejs application & we will proceed to next middleware
   next();
};

exports.userSignupValidator=(req,res,next) => {
   //name is not null and between 4-10 characters
   req.check("name","Name is required").notEmpty();
   //email is not null valid ans normalized
   req.check("email","Email must be between 3 to 32 characters")
   .matches(/.+\@.+\..+/)
   .withMessage("Email must contain @")
   .isLength({
     min:4,
     max:2000
   })
   //check for _password
   req.check("password","Password is required").notEmpty();
   req.check("password")
   .isLength({min: 6})
   .withMessage("Password must contain atleast 6 characters")
   .matches(/\d/)
   .withMessage("Password must contain a number")
   //check for errors
   const errors=req.validationErrors();

    //If error show the first one as they happen
    if(errors) {
      const firstError = errors.map(error => error.msg)[0];
      return res.status(400).json({error:firstError});
    }

    //proceed to next middleware
    next();
};
