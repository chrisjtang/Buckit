// load in environment variable
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const path = require('path');
const express = require('express');
const session = require('express-session');
const apiRouter = require('./routes/api.js');
require('../auth');
const flash = require('express-flash');
const jwt = require('jsonwebtoken');

const app = express();

const PORT = process.env.PORT || 3000;

// Standard middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));

// passport authentication
const passport = require('passport');
const initializePassport = require('../passport-config');
initializePassport(passport);
app.use(flash());

// google oauth/passport session initialization
app.use(session({ 
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

//google oauth
app.use('/auth/google', passport.authenticate('google', { scope: ['email', 'profile']}));
app.get('/google/callback',
  passport.authenticate('google', {
    successRedirect: '/auth/success',
    failureRedirect: '/auth/failure'
  }));

app.post('/login', passport.authenticate('local', {
  successRedirect: '/success',
  failureRedirect: '/failure', 
  failureMessage: true }))

app.use('/success', (req, res) => {
  const username = req.user.email;
  const accessToken = jwt.sign(req.user, process.env.ACCESS_TOKEN_SECRET)
  res.json({ accessToken: accessToken })
})

app.use('/success/protected', authenticateToken, (req, res) => {
  res.send(`welcome ${req.user.name}`)
})

app.use('/failure', (req, res) => {
  res.send('login failure');
})
  
app.use('/auth/failure', (req, res) => {
  res.send('failure route for oauth');
})

app.use('/auth/success', (req, res) => {
  res.send(`success route. Welcome ${req.user.displayName}!`);
})

app.use('/logout', (req, res) => {
  req.logout();
  req.session.destroy();
  res.send('Goodbye!');
  return req.redirect('/login');
})

// Routes to api router 
app.use('/api', apiRouter); 

// Local error handler
app.use((req, res) => res.status(404).send('404: PAGE DOES NOT EXIST'));

// Global error handler
app.use((err, req, res, next) => res.status(500).json(err));

// middleware for checking authentication. can use this to protect all routes
function checkAuthenticated (req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}

// middleware for checking if the user is not authenticated.  for example, can use this to stop them from being able to go to the login page again if already authenticated.  redirecting to '/' puts it back to the page that it's on.
function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect('/');
  }
  next();
}

//jwt authenticate token middleware
function authenticateToken (req, res, next) {
  console.log('authenticate token middleware');
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    return next();
  })
}

app.listen(PORT, () => console.log(`Server is running on localhost:${PORT}`));;

module.exports = app;
