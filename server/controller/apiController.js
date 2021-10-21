const { v4: uuidv4 } = require('uuid');

const db = require('../models/buckitModels.js');

const apiController = {};

/*
instead of having the middleware function in controller send data back,
we need to store the relevant data in our res.locals, and pass it 
down the middleware chain by invoking next(). The final middleware in the router
is then responsible for sending the data back to the front-end 
*/
apiController.verifyUser = (req, res, next) => {
  console.log('Made it to inside verifyUser middleware');
  console.log('requestbody******', req.body);
  const { username, password } = req.body.data;
  const getUser = `SELECT * FROM users WHERE password='${password}' AND username = '${username}'`;

  db.query(getUser)
  .then((data) => {
    //sql values is in key: rows
    const userAccData = [...data.rows]; 
    console.log('getUser data: ', userAccData);
    if (userAccData[0]) {
      res.locals.userInfo = userAccData;
      return next()
    }
    return next();
    // return res.status(200).json(userAccData);
  })
  .catch((err) => {
    // console.log('getUser error: ', err);
    return next(err);
});
}

apiController.createUser = (req, res, next) => {
  const { username, password } = req.body; 

  // SELECT buckits.*, users.username as username FROM buckits LEFT OUTER JOIN users ON users.user_id = buckits.user_id
  const getUser = `SELECT * FROM users WHERE username='${username}';`;

  db.query(getUser)
    .then((data) => {
      //sql values is in key: rows
      const userAccData = [...data.rows]; 
      // console.log('getUser data: ', userAccData);
      if (!userAccData[0]) return addNewUser();
      else return next({err: 'username already exists'});
      // return res.status(200).json(userAccData);
    })
    .catch((err) => {
      // console.log('getUser error: ', err);
      return next(err);
  });

  const addNewUser = () => {
    const addUser = `INSERT INTO users VALUES ('${userId}', '${username}', '${password}');`;

    db.query(addUser)
      .then((data) => {
        const newUserData = [...data.rows];
        // console.log('addUser data: ', newUserData);
        res.locals.userId = newUserData[0].user_id;
        return next();
      })
      .catch((err) => {
        // console.log('addUser error: ', err);
        return next(err);
      });
  };
};

// We would essentially want one buckit_list table per user
  // This requires us to join all entries in buckit_list table with the username in users db with req.body.username

  //dependent on user login
apiController.getBuckitList = (req, res, next) => {
  const { username } = req.params;
  const getUserId = `SELECT * FROM users WHERE username='${username}';`;
  
  const getUserBuckits = `SELECT buckits.*, users.username as username FROM buckits LEFT OUTER JOIN users ON users.user_id = buckits.user_id WHERE users.username = '${username}'`
  
  db.query(getUserBuckits)
    .then(data => {
      res.locals.buckits = data.rows;
      return next();
    })
    .catch(err => {
      console.log(err);
      return next(err);
    })

  

  /*
  this is the old query that the previous group used.  we refactored it above^
  db.query(getUserId)
    .then(data => {
      console.log('DATA******** line 59', data.rows);
      const userIdData = [...data.rows];
      const userId = userIdData[0].user_id;
      console.log('user_id********', userId);
      return userId;
    })
    .then(user_id => {
      const getBuckits = `SELECT * FROM buckits WHERE user_id='${user_id}';`;

      db.query(getBuckits)
        .then(data => {
          const buckitsData = [...data.rows];
          console.log('getBuckits data: ', buckitsData);
          res.locals.buckits = buckitsData;
          // return next();
          return res.status(200).json(buckitsData);
        })
        .catch(err => {
          // console.log('getBuckits error: ', err);
          return next(err);
    })
    .catch(err => {
      // console.log('userAccData error: ', err);
      return next(err);
    });
  });
  */
};


//works
apiController.createBuckit = (req, res, next) => {
  const buckitId = uuidv4();
  const { title, description, url, rating, user_id } = req.body;
// this query might need to be re-written
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
