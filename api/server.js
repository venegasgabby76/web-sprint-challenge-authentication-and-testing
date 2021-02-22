const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const session = require("express-session")

const restrict = require('./middleware/restricted.js');

const authRouter = require('./auth/auth-router.js');
const jokesRouter = require('./jokes/jokes-router.js');

const userRouter = require("./users/user-router");

const server = express();

server.use(helmet());
server.use(cors());
server.use(express.json());

// server.use(session({
//     resave:false,
//     saveUninitialized: false,
//     secret: process.env.JWT_SECRET,
// }))

server.use('/api/auth', authRouter);
server.use('/api/jokes', restrict, jokesRouter); // only logged-in users should have access!

server.use("/users", userRouter);

// server.use(errorHandler);

module.exports = server;
