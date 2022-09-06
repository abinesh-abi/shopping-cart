
const jwt = require("jsonwebtoken");

function userLogged(req, res, next) {
  const token = req.cookies.token;
  if (!token) {
    req.userName=''
    next();
  }else{
  try {
    const data = jwt.verify(token, process.env.JWT_USER_SECRET);
    req.userId = data.id;
    req.userName = data.name;
    return next();
  } catch (err) {
    console.log(err);
    return res.sendStatus(403);
  }
}
}

module.exports = {userLogged}