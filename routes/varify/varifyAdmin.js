const jwt = require("jsonwebtoken");

function varifyAdmin(req, res, next) {
  const token = req.cookies.adminToken;
  if (!token) {
    res.redirect("/admin/login");
  }
  try {
    const data = jwt.verify(token, process.env.JWT_USER_SECRET);
    req.adminId = data.id;
    req.admin = data.name;

    return next();
  } catch (err) {
    console.log(err);
    return res.sendStatus(403);
  }
}

module.exports = {varifyAdmin}