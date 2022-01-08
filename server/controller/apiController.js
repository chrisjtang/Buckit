const { v4: uuidv4 } = require('uuid');

const db = require('../models/buckitModels.js');

const apiController = {};

const bcrypt = require('bcrypt');

/*
instead of having the middleware function in controller send data back,
we need to store the relevant data in our res.locals, and pass it 
down the middleware chain by invoking next(). The final middleware in the router
is then responsible for sending the data back to the front-end 
*/
apiController.verifyUser = async (req, res, next) => {
  try {
    const { username } = req.body;
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const getUser = `SELECT * FROM users WHERE password='${hashedPassword}' AND username = '${username}'`;

    db.query(getUser)
      .then((data) => {
        //sql values is in key: rows
        const userAccData = [...data.rows]; 
        console.log('data', data);
        if (userAccData[0]) {
          res.locals.userInfo = userAccData;
          return next()
        }
        if (userAccData.length === 0) {
          return next();
          // return res.status(200).json(userAccData);
        }
      })
      .catch((err) => {
        // console.log('getUser error: ', err);
        return next(err);
      });
  } catch {
    res.status(500);
    next(err);
  }
  
}

//checkUnique refactored with async/await syntax
apiController.checkUnique = async (req, res, next) => {
  try {
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
      res.status(500).send(`there was an error in ${this}`);
  }
};

apiController.getUserId = (req, res, next) => {
  // console.log('request******', req.params)
  const { username } = req.params; 
  // console.log('username: ', username)
  const getUser = `SELECT * FROM users WHERE username='${username}';`;

  res.locals.user = req.body;
  
  db.query(getUser)
    .then((data) => {
      // console.log('data in line 70 api controller.js', data.rows)
      
      // console.log('datarows', data.rows[0].user_id)
      res.locals.userid = data.rows[0].user_id

      // console.log('USERACCOUNTDATA******', userAccData);
      return next();
    })
}

apiController.addUser = async (req, res, next) => {
  try {
    const hashedPassword = await bcrypt.hash(res.locals.newUser.password, 10);
    const { userId, username } = res.locals.newUser;
    console.log('hashedpassword', hashedPassword);
    const addUser = `INSERT INTO users VALUES ('${userId}', '${username}', '${hashedPassword}');`;
  
      db.query(addUser)
        .then(() => {
          return next();
        })
        .catch((err) => {
          console.log('addUser error: ', err);
          return next(err);
        });
  } catch {
    res.status(500).send();
  }
}


  //dependent on user login
apiController.getBuckitList = (req, res, next) => {
  const { username } = req.params;
  
  const getUserBuckits = `SELECT buckits.*, users.username as username FROM buckits LEFT OUTER JOIN users ON users.user_id = buckits.user_id WHERE users.username = '${username}'`
  
  db.query(getUserBuckits)
    .then(data => {
      // console.log('data.rows: ', data)
      res.locals.buckits = data.rows;
      return next();
    })
    .catch(err => {
      console.log(err);
      return next(err);
    })
};


apiController.createBuckit = (req, res, next) => {
  const buckitId = uuidv4();
  const { title, description, url, rating, user_id } = req.body;
  const addBuckit =  `INSERT INTO buckits (buckit_id, title, description, url, rating, user_id) \
    VALUES ('${buckitId}', '${title}', '${description}', '${url}', '${rating}', '${user_id}');`;

  db.query(addBuckit)
    .then(data => {
      res.locals.body = req.body;
      return next(); 
    })
    .catch((err) => {
      console.log('addBuckit error: ', err);
      return next(err); 
    }); 
};

apiController.updateBuckitList = (req, res, next) => {
  const {buckit_id, title, text, url, rating, user_id} = req.body;
  const updateQuery = `UPDATE buckits SET title = '${title}', description = '${text}', url = '${url}', rating = '${rating}', user_id = '${user_id}' WHERE buckit_id = '${buckit_id}'`;

  db.query(updateQuery)
    .then(data => {
      console.log('I updated everything because I do not know how to update only one');
      console.log(req.body);
      res.locals.updatedBuckit = req.body;
      return next();
    })
    .catch((err) => {
      console.log('updated err', err);
      return next(err);
    });
}



apiController.deleteBuckitList = (req, res, next) => {
  const id = req.body.buckit_id;
  console.log('id*******', req.body);
  const deleteQuery = `DELETE FROM buckits WHERE buckit_id = '${id}'`;
  
  db.query(deleteQuery) 
    .then(data => {
      console.log('I think I am deleted');
      console.log(req.body);
      res.locals.deletedBuckit = req.body;
      return next();
    })
    .catch((err) => {
      console.log('delete buckit had an err', err);
      return next(err);
    })
}

module.exports = apiController;
