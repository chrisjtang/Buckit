if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth2').Strategy;
const db = require('./server/models/buckitModels.js');
const uuid = require('uuid');

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

passport.use(new GoogleStrategy({
    clientID:     GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/google/callback",
    passReqToCallback: true
  },
  async (request, accessToken, refreshToken, profile, done) => {
    try {
    //this is the functionality that happens after the authentication.  either creating a new user or finding the existing user.
    //write a query to check to see if the user already exists in the database
    console.log('profile from response', profile.email);
    const email = await profile.email;
    const getUser = `SELECT * FROM users WHERE username='${email}';`;
    const userFromDatabase = await db.query(getUser);
    console.log('query result userfromdatabase rows->', userFromDatabase.rows);
    //if the user does exist, log the user in.
    if (userFromDatabase.rows.length !== 0) {
      console.log('the user exists!')
    } else {
      //if the user doesn't exist, create the new user
      //create the new userId
      const userId = uuid.v4();
      // pass in a password because the SQL table requires it
      const password = 'googleAuth'
      //query for adding user with userid and email
      const createUser = `INSERT INTO users VALUES ('${userId}', '${email}', '${password}');`
      //run the query
      console.log('made it to the end of the else block');
      db.query(createUser);
    }
    return done(null, profile);
    } catch {
      console.log('catch statement in auth.js');
      return done(null, profile);
    }
  }));

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});