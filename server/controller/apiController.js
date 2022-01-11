const { v4: uuidv4 } = require('uuid');

const db = require('../models/buckitModels.js');

const apiController = {};

const bcrypt = require('bcrypt');

apiController.verifyUser = async (req, res, next) => {
  try {
    const { username, password } = await req.body;
    //run the query to find the hashed password
    const getUser = `SELECT * FROM users WHERE username = '${username}'`;
    const userFromDatabase = await db.query(getUser);
    //if userfromdatabase is empty, return an error
    //assign the password from the query result if there's a result
    if (userFromDatabase.rows.length > 0) {
      const passwordFromDatabase = userFromDatabase.rows[0].password;
      //use bcrypt.compare to compare the passwords.  returns boolean.  if true, then go to next middleware.  if false, then send failure message.
      if (bcrypt.compare(password, passwordFromDatabase)) {
        res.locals.userInfo = username;
        return next();
      } else {
        return res.send(`incorrect credentials, please try again`);
      }
    }
  } catch (err) {
    return res.status(500).send(`error in the apicontroller.verifyuser middleware`)
  }
  
}

//checkUnique refactored with async/await syntax
apiController.checkUniqueUser = async (req, res, next) => {
  try {
    console.log('request body', await req.body);
    //destructure the req.body object and pull the username from it
    const { username } = req.body;
    //write the sql query with the username passed into it 
    const getUser = `SELECT * FROM users WHERE username='${username}';`;
    //data contains the return value of the fulfilled promise from the sql query
    const data = await db.query(getUser);
    //if the user doesn't exist, we expect data.rows to be empty
    if (!data.rows[0]) {
      //assign the req.body to the res.locals object to pass it to the next middleware
      res.locals.newUser = req.body;
      // move onto the next middleware
      return next();
    } else {
      //if the user exists, then we'll return the below error message
      return next({err: `username ${username} already exists!`});
    }
    } catch (err) {
      res.status(500).send(`error in apiController.checkuniqueuser middleware`);
  }
};

apiController.addUser = async (req, res, next) => {
  try {
    const hashedPassword = await bcrypt.hash(res.locals.newUser.password, 10);
    const { userId, username } = res.locals.newUser;
    
    const addUser = `INSERT INTO users VALUES ('${userId}', '${username}', '${hashedPassword}');`;
    db.query(addUser);
    return next();
  } catch {
    res.status(500).send(`error in apiController.addUser middleware`);
  }
}

apiController.getUserId = async (req, res, next) => {
  try {
    //retrieve the username property from the req.params object
    const { username } = await req.params; 

    // write the query
    const getUser = `SELECT * FROM users WHERE username='${username}';`;

    //pass username to res.locals.user so that it can be returned back to frontend to be used to query buckit items
    res.locals.user = req.params.username;
    // run the query
    const data = await db.query(getUser);
    // grab the user_id from the array that is returned by the query
    res.locals.userid = data.rows[0].user_id;
    return next();
  } catch {
    return res.status(400).send(`error in apiController.getUserId middleware`);
  }
}

apiController.getBuckitList = async (req, res, next) => {
  try {
    const { username } = await req.params;
      
    const getUserBuckits = `SELECT buckits.*, users.username as username FROM buckits LEFT OUTER JOIN users ON users.user_id = buckits.user_id WHERE users.username = '${username}'`
    
    const data = await db.query(getUserBuckits);
    res.locals.buckits = data.rows;
    return next();
  } catch {
    return res.status(400).send(`error in apiController.getBuckitList middleware`);
  }
  
};


apiController.createBuckit = async (req, res, next) => {
  try {
    const { title, description, url, rating, user_id } = await req.body;
    const buckitId = uuidv4();
    const addBuckit =  `INSERT INTO buckits (buckit_id, title, description, url, rating, user_id) \
      VALUES ('${buckitId}', '${title}', '${description}', '${url}', '${rating}', '${user_id}');`;

    const data = await db.query(addBuckit);
    res.locals.body = req.body;
    return next();
  } catch {
    return res.status(400).send(`error in the apiController.createBuckit middleware`);
  }
  
};

apiController.updateBuckitList = async (req, res, next) => {
  try {
    const {buckit_id, title, text, url, rating, user_id} = await req.body;
    const updateQuery = `UPDATE buckits SET title = '${title}', description = '${text}', url = '${url}', rating = '${rating}', user_id = '${user_id}' WHERE buckit_id = '${buckit_id}'`;

    const data = await db.query(updateQuery);
    res.locals.updatedBuckit = req.body;
    return next();
  } catch {
    return res.status(400).send(`error in the apiController.updateBuckitList middleware`);
  }
  
}

apiController.deleteBuckitList = async (req, res, next) => {
  try {
    const id = await req.body.buckit_id;
    const deleteQuery = `DELETE FROM buckits WHERE buckit_id = '${id}'`;
    
    const data = await db.query(deleteQuery);
    res.locals.deletedBuckit = req.body;
    return next();
  } catch {
    return res.status(400).send(`error in apiController.deleteBuckitList middleware`);
  }
}

module.exports = apiController;
