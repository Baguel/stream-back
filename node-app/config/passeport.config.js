const passport = require('passport');
const GithubStrategy = require("passport-github2").Strategy;

passport.serializeUser((user, done) => {
     done(null, user.id);
})

passport.deserializeUser((id, done) => {
     User.findById(id).then(user => {
          done(null, user.id);
     })
})

passport.use(new GithubStrategy({
  clientID: "Ov23liE3ANP7Mg7L7wV4",
  clientSecret: "f3492b2f68a127a5a671cd6a52097136bd819f46",
  callbackURL: "http://localhost:3000/github/auth/callback"
},
  
  function(accessToken, refreshToken, profile, done) {
    return done(err, user);
  }
));
