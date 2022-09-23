
const mongoose = require("mongoose");

const schema = mongoose.Schema({
  userId:{
      type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
  },
  balance:Number,
},
{
  timestamps:true
});

let Vallet = mongoose.model("vallet", schema);
module.exports = Vallet;