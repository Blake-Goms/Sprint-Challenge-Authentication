// const bcrypt = require('bcryptjs');
// const router = require('express').Router();
// const jwt = require('jsonwebtoken');

// const Users = require('./users-model');
// const secrets = require('../config/secrets.js')

// router.post('/register', (req, res) => {
//   // implement registration
//   let user = req.body;

//     // hash password
//     const hash = bcrypt.hashSync(user.password);
//     user.password = hash;

//     Users.add(user)
//       .then(saved => {
//         res.status(201).json(saved);
//       })
//       .catch(error => {
//         res.status(500).json(error);
//       });
// });

// router.post('/login', (req, res) => {
//   // implement login
//   let { username, password } = req.body;

//     Users.findBy({ username })
//       .first()
//       .then(user => {
//         if (user && bcrypt.compareSync(password, user.password)) {
//           const token = generateToken(user);

//           res.status(200).json({ message: `Welcome ${user.username}!`, token });
//         } else {
//           res.status(401).json({ message: 'Invalid Credentials, you shall not pass!' });
//         }
//       })
//       .catch(error => {
//         res.status(500).json(error);
//       });
// });

// function generateToken(user) {
//   const payload = {
//     subject: user.id,
//     username: user.username,
//     // ...other data if needed
//   }
//   const options = {
//     expiresIn: '24h'
//   }
//   return jwt.sign(payload, secrets.jwtSecret, options)
// }

// module.exports = router;


const server = require('express').Router();
const bcrypt = require('bcryptjs');

const Users = require('./users-model');
const restricted = require('../auth/authenticate-middleware');

server.post('/register', (req,res) =>{
    const user = req.body;
    const hash = bcrypt.hashSync(user.password);
    user.password = hash;
    Users.add(user)
        .then(saveUser => {
            res.status(201).json(saveUser)
        })
        .catch(err => {
            res.status(500).json(err)
        })
})

server.post('/login', (req,res) =>{
    const {username, password} = req.body;

    Users.findBy({ username })
        .first()
        .then(user => {
            if (user && bcrypt.compareSync(password, user.password)) {
                req.session.username = user.username; // only on successful login
                req.session.loggedIn = true;
                res.status(200).json({
                    message: `Welcome ${user.username}!`,
                });
                } else {
                res.status(401).json({ message: 'Invalid Credentials' });
                }
        })
        .catch(error => {
            res.status(500).json(error);
        });
})

// gets all users
server.get('/users', restricted, (req, res) => {
  Users.find()
      .then(users => {
          res.json(users);
      })
      .catch(err => {
          res.status(500).json({message: 'YOU SHALL NOT PASS!!!'})
      })
});

module.exports = server;
