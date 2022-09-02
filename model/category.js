const mongoose = require("mongoose");

const categorySchema = mongoose.Schema({
  
  name:{
    type:String,
    required:true,
    unique:true,
  },
  
});

let Category = mongoose.model("categories", categorySchema);
module.exports = Category;

