
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
      quantity:Number,
      price:Number,
      

    }
  ],
  address:String,
  totalPrice:Number,
  payMethod:String,
  status:String,
},
{
  timestamps:true
});

let Orders = mongoose.model("order", schema);
module.exports = Orders;

