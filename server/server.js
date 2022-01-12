const path = require('path');
const express = require('express');
const session = require('express-session');
const apiRouter = require('./routes/api.js');
const passport = require('passport');
require('../auth');

const app = express();

const PORT = process.env.PORT || 3000;

// Standard middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));

// google oauth session initialization
app.use(session({ 
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
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
})

// Routes to api router 
app.use('/api', apiRouter); 

// Local error handler
app.use((req, res) => res.status(404).send('404: PAGE DOES NOT EXIST'));

// Global error handler
app.use((err, req, res, next) => res.status(500).json(err));

app.listen(PORT, () => console.log(`Server is running on localhost:${PORT}`));;

module.exports = app;
