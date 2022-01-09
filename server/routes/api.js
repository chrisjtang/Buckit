const express = require('express');

const router = express.Router();

const apiController = require('../controller/apiController.js')

// router for get request that grabs the userID from database and returns it to front-end
router.get('/home/getuserid/:username', apiController.getUserId, (req, res) => {
    return res.status(200).json(`user id is ${res.locals.userid} and username is ${res.locals.user}`);
});

//endpoint for when a user logs in
router.get('/home/:username', apiController.getBuckitList,  (req, res) => {
        return res.status(202).json(res.locals.buckits);
});

router.delete('/home/:username', apiController.deleteBuckitList, (req, res) => {
    return res.status(202).json(res.locals.deletedBuckit)
});

router.patch('/home/:username', apiController.updateBuckitList, (req, res) => {
    return res.status(202).json(res.locals.updatedBuckit)
});


//on successful login, we verify if the credentials are legit, and then redirect to the home/:username
router.post('/login', apiController.verifyUser, (req, res) => {
    if (res.locals.userInfo) {
        const username = res.locals.userInfo[0].username;
        // on success, we send status of 204 so the frontend knows to let the user into the dashboard
        res.sendStatus(204);
        // return res.sendStatus(204);
    } else {
        console.log('failed login attempt')
        // on fail, we send status of 205
        res.sendStatus(205).send(`failure in the post request to /login`);
    }
});

//when a user tries to sign up, we first check that the username doesn't already exist.
//if it doesn't exist, then we'll add the user to our database
//on completion, we should redirect the user to the login page.
router.post('/signup', apiController.checkUniqueUser, apiController.addUser, (req, res) => {
    //on successful sign up, redirect to the login page
    res.sendStatus(200).send('successfully added user');
    // res.redirect('http://localhost:8080/');
    // return res.status(202).json(res.locals.createdUser.user_id)
});


router.post('/addBuckit', apiController.createBuckit, (req, res) => {
    return res.status(203).json(res.locals.body);
});


module.exports = router;