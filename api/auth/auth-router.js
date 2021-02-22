const bcryptjs = require("bcryptjs");
const jwt = require('jsonwebtoken');
const secrets = require("../config/secret");

const router = require("express").Router();

const db = require("../users/users-model");
const { isValid } = require("../users/user-service");

router.post("/register", async (req, res, next) => {
  const credentials = req.body;

  try {
    if (isValid(credentials)) {
      // const rounds = process.env.BCRYPT_ROUNDS ?
      //   parseInt(process.env.BCRYPT_ROUNDS) : 8;

      const rounds = process.env.BCRYPT_ROUNDS;

      const hash = bcryptjs.hashSync(credentials.password, rounds);
      credentials.password = hash;

      const user = await db.add(credentials);
      const token = generateToken(user);
      res.status(201).json({ data: user, token });
    } else {
      next(res.status(400).json({
        message: "username and password missing"
      }));
    }
  } catch (err) {
    console.log(err);
    next(res.status(500).json({
      message: "cannot add to database"
    }));
  }

});

router.post("/login", async (req, res, next) => {
  const { username, password } = req.body;

  try {

    if (!isValid(req.body)) {
      next(res.status(400).json({
        message: "missing username or password"
      }));
    } else {
      const [user] = await db.findBy({ username: username });
      if (user && bcryptjs.compareSync(password, user.password)) {
        const token = generateToken(user);
        res.status(200).json({ message: 'welcome to the api', token: token });
      } else {
        next(res.status(401).json({
          message: "invalid credentials"
        }));
      }
    }
  } catch (err) {
    next(res.status(500).json({
      message: "cannot log in"
    }));
  }

});


function generateToken(user) {

  const payload = {
    subject: user.id,
    username: user.username,
  };

  const options = {
    expiresIn: "1d"
  };

  const token = jwt.sign(payload, secrets.jwtSecret, options);

  return token;

}

module.exports = router;

/*
    IMPLEMENT
    You are welcome to build additional middlewares to help with the endpoint's functionality.

    1- In order to register a new account the client must provide `username` and `password`:
      {
        "username": "Captain Marvel", // must not exist already in the `users` table
        "password": "foobar"          // needs to be hashed before it's saved
      }

    2- On SUCCESSFUL registration,
      the response body should have `id`, `username` and `password`:
      {
        "id": 1,
        "username": "Captain Marvel",
        "password": "2a$08$jG.wIGR2S4hxuyWNcBf9MuoC4y0dNy7qC/LbmtuFBSdIhWks2LhpG"
      }

    3- On FAILED registration due to `username` or `password` missing from the request body,
      the response body should include a string exactly as follows: "username and password required".

    4- On FAILED registration due to the `username` being taken,
      the response body should include a string exactly as follows: "username taken".
  */

/*
    IMPLEMENT
    You are welcome to build additional middlewares to help with the endpoint's functionality.

    1- In order to log into an existing account the client must provide `username` and `password`:
      {
        "username": "Captain Marvel",
        "password": "foobar"
      }

    2- On SUCCESSFUL login,
      the response body should have `message` and `token`:
      {
        "message": "welcome, Captain Marvel",
        "token": "eyJhbGciOiJIUzI ... ETC ... vUPjZYDSa46Nwz8"
      }

    3- On FAILED login due to `username` or `password` missing from the request body,
      the response body should include a string exactly as follows: "username and password required".

    4- On FAILED login due to `username` not existing in the db, or `password` being incorrect,
      the response body should include a string exactly as follows: "invalid credentials".
  */
