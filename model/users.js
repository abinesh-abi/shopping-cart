const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  number: {
    type: Number,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  blockOrNot:{
    type: Boolean,
    default: false,
  }
});

let User = mongoose.model("otpUsers", userSchema);
module.exports = User;
