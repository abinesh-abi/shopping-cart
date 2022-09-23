const jwt = require("jsonwebtoken");

function varifyUser(req, res, next) {
  const token = req.cookies.token;
  if (!token) {
    res.redirect("/login");
  }
  try {
    const data = jwt.verify(token, process.env.JWT_USER_SECRET);
    req.userId = data.id;
    req.userName = data.name;
    // console.log(data)
    return next();
  } catch (err) {

    return res.sendStatus(403);
  }
}

module.exports = {varifyUser}