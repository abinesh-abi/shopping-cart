const mongoose = require("mongoose");

const cartSchema = mongoose.Schema({
  userId:{
      type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
  },
  cart:[
    {
      productId:{
        type: mongoose.Schema.Types.ObjectId,
      },
      quantity:Number,
      price:Number

    }
  ],
  address:String,
  totalPrice:Number
});

let Cart = mongoose.model("cart", cartSchema);
module.exports = Cart;

