const mongoose = require("mongoose");

const categorySchema = mongoose.Schema({
  name:String,
});

let Category = mongoose.model("categories", categorySchema);
module.exports = Category;

