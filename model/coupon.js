const mongoose = require("mongoose");

const schema = mongoose.Schema({
    code:String,
    offer:Number,
    expireAt: {
    type: Date,
    default: Date.now,
    index: { expires: 1000*60*60*24 }
    }
},{
  timestamps:true
});

let Coupon = mongoose.model("coupon", schema);
module.exports = Coupon;

