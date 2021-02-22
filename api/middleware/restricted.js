const jwt = require("jsonwebtoken");
const secret = process.env.JWT_SECRET;

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization ?
      req.headers.authorization.split(' ')[1] :
      '';

    if (token) {
      jwt.verify(token, secret, (err, decodedToken) => {
        if (err) {
          next(res.status(401).json({
            message: "invalid token"
          }));
        } else {
          req.decodedToken = decodedToken;
          next();
        }
      });
    } else {
      next(res.status(401).json({
        message: "invalid token"
      }));
    }
  } catch (err) {
    next(res.status(500).json({
      message: "error validating credentails."
    }));
  }


};

/*
    IMPLEMENT

    1- On valid token in the Authorization header, call next.

    2- On missing token in the Authorization header,
      the response body should include a string exactly as follows: "token required".

    3- On invalid or expired token in the Authorization header,
      the response body should include a string exactly as follows: "token invalid".
  */
