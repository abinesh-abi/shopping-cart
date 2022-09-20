
const { default: mongoose } = require("mongoose")
const Cart = require("../model/cart")
const Orders = require("../model/orders")

module.exports = {
    allCartItems:(userId,productId)=>{
        return new Promise((resolve, reject) =>{
            // Cart.findOne({userId},{cart:1})
            // .then(cart => console.log(cart))
            Cart.aggregate([
                {$match:{
                   userId:mongoose.Types.ObjectId(userId)
                }},
                // {$unwind:"$cart"},
                {$lookup:{
                    from:'products',
                    localField:"cart.productId",
                    foreignField:"_id",
                    as:'cartItems'
                }},
            ])
            .then(cart => {
                console.log(cart)
                resolve(cart)
            })  
        })
    },
    getCart:(userId)=>{
        return new Promise((resolve, reject) => {
         Cart.findOne({userId:userId})
        .then(cart => {resolve(cart)})
        .catch(err => {reject(err)});    
         })
    }
    ,
    productExistsInCart:(userId,productId)=>{
       return new Promise((resolve,reject) =>{
        let cart = Cart.findOne({userId,'cart.productId':productId})
        .then(cart =>{resolve(cart)})
       }) 
    },
    addToCart:(userId,productId,price)=>{
        return new Promise((resolve,reject) =>{
            // new Cart({userId,cart:[{productId,quantity:1}]}).save()
            // .then(cart =>{resolve(cart)})
             Cart.updateOne({userId},{$push:{cart:{productId,quantity:1,price}}},{upsert:true})
             .then(cart => resolve(cart))
        })
    },
    removeFromCart:(userId,productId)=>{
        return new Promise((resolve,reject) =>{
            console.log(userId,productId)
            Cart.updateOne({userId,"cart.productId":productId},{$pull:{cart:{productId:productId}}})
            .then(cart => resolve(cart))
        })
    },
    incrementProduct:(userId,productId)=>{
        return new Promise((resolve,reject) =>{
             Cart.updateOne({userId,"cart.productId":productId},{$inc:{"cart.$.quantity":1}})
             .then(data=>resolve(data))
        });
    },
    decrementProduct:(userId,productId)=>{
        return new Promise((resolve,reject) =>{
             Cart.updateOne({userId,"cart.productId":productId},{$inc:{"cart.$.quantity":-1}})
             .then(data=>resolve(data))
        });
    },
    emptyCart:(userId)=>{
     return new Promise((resolve,reject) =>{
        console.log(userId)
        Cart.findOneAndDelete({userId})
        .then(data=>resolve(data))
        .catch(error=>reject(error))
     })   
    },
    placeOrder:(userId,product,totalPrice,address,method)=>{
        return new Promise((resolve,reject) =>{
            //  Orders
            //  .updateOne({userId},{$push:{orders:product,totalPrice}},{upsert:true})
            new Orders({userId,orders:product,totalPrice,payMethod:method,address}).save()
             .then(cart => resolve(cart))
             .catch(err => reject(err));
        })
    },
    
}