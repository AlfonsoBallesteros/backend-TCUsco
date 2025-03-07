const jwt = require("jsonwebtoken");
process.env.SECRET_KEY = 'secret'

module.exports = function(req, res, next) {
  //get the token from the header if present
  const token = req.headers["x-token"] || req.headers["authorization"];
  //if no token found, return response (without going to the next middelware)
  if (!token) return res.status(401).send("Access denied. No token provided.");

  try {
    //if can verify the token, set req.user and pass to next middleware
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.user = decoded;
    next();
  } catch (ex) {
    //if invalid token
    res.json({
      ok: false,
      mensaje: 'Token no es correcto'
    });

  }
};