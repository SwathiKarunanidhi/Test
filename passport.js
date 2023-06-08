//Importing Passport -- to handle authentication 
//Google passport strategy with its property strategy  -- to instruct passport to authenticate with google OAuth
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const keys =require('../config/keys');
const mongoose = require('mongoose');
const User = mongoose.model('users'); 

passport.serializeUser(
  (user, done) => {
   done(null, user.id);
   }
  );
passport.deserializeUser(
  (id,done) => {
    //Accessing MonggoDB to search and fetch, asynchronous call, chain with promise
    User.findById(id).then(user => {
      done(null,user);
    })
  }
)  
passport.use(new GoogleStrategy (
    {
    clientID : keys.googleClientID,
    clientSecret : keys.googleClientSecret,
   // Callback URL to which user has to be sent after consent screen
    callbackURL : '/auth/google/callback',
    proxy : true
   },
    async (accessToken,refreshToken, profile,done) =>
    {
      //Accessing MongoDB to search and fetch, asynchronous call, chain with promise - Later refactored...
      const existingUser = await User.findOne({googleId : profile.id});
        if(existingUser)
        {
          done(null, existingUser);
        }
        else
        {
          //create new record for the new user
          //Accessing MonggoDB to search and fetch, asynchronous call, chain with promise - Later refactored...
          const user = await new User({ googleId : profile.id }).save();
          done(null, user);
        }
        
     
    }
) 
);