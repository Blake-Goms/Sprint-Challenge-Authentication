// const express = require('express');
// const cors = require('cors');
// const helmet = require('helmet');

// const authenticate = require('../auth/authenticate-middleware.js');
// const authRouter = require('../auth/auth-router.js');
// const jokesRouter = require('../jokes/jokes-router.js');
// const Users = require('../auth/users-model');

// const server = express();

// server.use(helmet());
// server.use(cors());
// server.use(express.json());

// server.use('/api/auth', authRouter);
// server.use('/api/jokes', authenticate, jokesRouter);

// server.get('/api/users', authenticate, (req, res) => {
//     Users.find()
//     .then(users => {
//         res.json({ loggedInUser: req.user.username, users });
//     })
//     .catch(err => res.send(err));
// });

// module.exports = server;


const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const session = require('express-session');
const KnexSessionStore = require('connect-session-knex')(session);

const knexConnection = require('../database/dbConfig')
const authenticate = require('../auth/authenticate-middleware.js');
const authRouter = require('../auth/auth-router.js');
const jokesRouter = require('../jokes/jokes-router.js');
const Users = require('../auth/users-model');

const server = express();

// session configuration
const sessionOptions = {
    name: 'Session',
    secret: process.env.COOKIE_SECRET || 'keep it secret, keep it safe!', // for encryption
    cookie: {
        secure: process.env.COOKIE_SECURE || false, // in production should be true, false for development
        maxAge: 1000 * 60 * 60 * 24, // how long is the session good for, in milliseconds
        httpOnly: true, // client JS has no access to the cookie
    },
    resave: false,
    saveUninitialized: true,
    store: new KnexSessionStore({
        knex: knexConnection,
        createtable: true,
        clearInterval: 1000 * 60 * 60, // how long before we clear out expired sessions
    }),
};
server.use(helmet());
server.use(express.json());
server.use(cors());
server.use(session(sessionOptions));

server.use('/api/auth', authRouter);
server.use('/api/jokes', authenticate, jokesRouter);


module.exports = server;