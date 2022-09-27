
const mongoose = require("mongoose");

const schema = mongoose.Schema({
  userId:{
      type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
  },
  wishlist:[
    mongoose.Schema.Types.ObjectId,
  ],
} ,{ timestamps: true });

let wishlist = mongoose.model("wishlist", schema);
module.exports = wishlist;

