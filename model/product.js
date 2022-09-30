const { text } = require("express");
const mongoose = require("mongoose");


const productSchema = mongoose.Schema({
    name:{
       type:String,
       required:true,
       max:20
    },
    price:{
        type:Number,
        required:true
    },
    offerPrice:{
        type:Number,
    },
    image:{
        type:String
    },
    category:{
        type:mongoose.Types.ObjectId,
        required:true
    },
    spec:{
        type:String,
        // required:true
    }
},
{timestamps:true}
)


let Products= mongoose.model('products',productSchema)
module.exports = Products