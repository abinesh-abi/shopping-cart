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
    image:{
        type:String
    },
    category:{
        type:String,
        required:true
    },
    // spec:{
    //     type:Object,
    //     required:true
    // }
},
{timestamps:true}
)


let Products= mongoose.model('products',productSchema)
module.exports = Products