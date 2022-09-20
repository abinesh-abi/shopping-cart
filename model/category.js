const mongoose = require("mongoose");

const categorySchema = mongoose.Schema({
  
  name:{
    type:String,
    required:true,
    unique:true,
  },
  offer:{
    type:Number,
    default:0
    // required:true,
    // unique:true,
  },
  
});

let Category = mongoose.model("categories", categorySchema);
module.exports = Category;

