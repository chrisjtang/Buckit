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
router.post('/login', apiController.verifyUser, (req, res) => {
    const username = res.locals.userInfo[0].username;
    if (res.locals.userInfo) {
        // on success, we send status of 204 so the frontend knows to let the user into the dashboard
        return res.redirect(`/home/${username}`)
        // return res.sendStatus(204);
    } else {
        // on fail, we send status of 205
        return res.sendStatus(205);
    }
    // console.log('res.locals', res.locals)
    // console.log('user verified', username);
    // // if (res.locals.userInfo) res.redirect(`/home/${username}`)
    // return res.status(204).json(res.locals);
});


//On successful signup, we want users redirected to the login page
router.post('/signup', apiController.createUser, (req, res) => {
    //on successful sign up, redirect to the login page
    //res.redirect(localhost:8080/login)
    return res.status(202).json(res.locals.createdUser.user_id)
});


router.post('/addBuckit', apiController.createBuckit, (req, res) => {
    return res.status(203).json(res.locals.body);
});


module.exports = router;