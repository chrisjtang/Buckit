const express = require('express');

const router = express.Router();

//we should refactor these to be sending the data back to the front end 
//these routes are missing final middleware: (req, res) => {res.sendStatus(200)}
const apiController = require('../controller/apiController.js')

//endpoint for when a user logs in
router.get('/home/:username', apiController.getBuckitList,  
    (req, res) => {
        // console.log('res.locals******', res.locals.buckits);
        return res.status(202).json(res.locals.buckits);
    }
);

router.delete('/home/:username', apiController.deleteBuckitList, (req, res) => {
    return res.status(202).json(res.locals.deletedBuckit)
});

router.patch('/home/:username', apiController.updateBuckitList, (req, res) => {
    return res.status(202).json(res.locals.updatedBuckit)
});

//on successful login, we verify if the credentials are legit, and then redirect to the home/:username
//unsuccessful login, refresh the page
router.get('/login', apiController.verifyUser, (req, res) => {
    const username = res.locals.userInfo[0].username;
    console.log('user verified', username);
    if (res.locals.userInfo) res.redirect(`/home/`)
    return res.status(204).json(res.locals.userInfo)
});

//On successful signup, we want users redirected to the login page
router.post('/signup', apiController.checkUnique, apiController.addUser, (req, res) => {
    //on successful sign up, redirect to the login page
    // console.log('I made it to the middleware mom!');
    res.sendStatus(205);
    // res.redirect('http://localhost:8080/');
    // return res.status(202).json(res.locals.createdUser.user_id)
});

router.post('/addBuckit', apiController.createBuckit, (req, res) => {
    return res.status(203).json(res.locals.body);
});


module.exports = router;