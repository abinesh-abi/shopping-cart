const mongoose = require("mongoose");

const schema = mongoose.Schema({
    code:String,
    offer:Number,
    expireAt:String, 
},{
  timestamps:true
});

let Coupon = mongoose.model("coupon", schema);
module.exports = Coupon;

