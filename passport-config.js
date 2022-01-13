const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const db = require('./server/models/buckitModels.js');
const passport = require('passport');

const initialize = (passport) => {
  const authenticateUser = async (email, password, done) => {
    //function getUserByEmail will either return a user or null
    try {
      const getUser = `SELECT * FROM users WHERE username = '${await email}'`
      const userFromDatabase = await db.query(getUser);
      if (userFromDatabase.rows.length > 0) {
        const passwordFromDatabase = await userFromDatabase.rows[0].password;
        //use bcrypt.compare to compare the passwords.  returns boolean.  if true, then go to next middleware.  if false, then send failure message.
        if (await bcrypt.compare(password, passwordFromDatabase)) {
          const user = {'email': userFromDatabase.rows[0].username}
          return done(null, user);
        } else {
          return done(null, false, { message: 'Passwords did not match' });
        }
      } else {
        return done(null, false, { message: 'User not found' });
      }
    } catch (err) {
      console.log(err);
      return done(err);
    }}
  passport.use(new LocalStrategy({
    usernameField: 'email'
  }, authenticateUser))
  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser((id, done) => {
    return done(null, getUserById(id))
  })
}

module.exports = initialize;