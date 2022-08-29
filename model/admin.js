const mongoose = require("mongoose");

const adminSchema = mongoose.Schema({
  name:String,
  email: String,
  password: Number,
});

let Admin = mongoose.model("admins", adminSchema);
module.exports = Admin;

