
const mongoose = require("mongoose");

const schema = mongoose.Schema({
  userId:{
      type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
  },
  orders:[
    {
      productId:{
        type: mongoose.Schema.Types.ObjectId,
      },
      quantity:Number

    }
  ],
  totalPrice:Number

});

let Orders = mongoose.model("order", schema);
module.exports = Orders;

