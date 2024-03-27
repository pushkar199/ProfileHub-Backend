const jwt = require("jsonwebtoken");
require('dotenv').config()


function verifyToken(req, res, next) {
  const token = req.header("Authorization");
  if (!token) return res.status(401).json({ error: "Access denied: No token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); 
    req.userId = decoded._id;
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
}


module.exports = { verifyToken };
