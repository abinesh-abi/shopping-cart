const { default: mongoose } = require("mongoose")
const Orders = require("../model/orders")

module.exports ={
    orderAggregate:(orderId)=>{
        return new Promise((resolve, reject) =>{
            Orders.aggregate([
                // {$match:{
                //    userId:mongoose.Types.ObjectId(orderId)
                // }},
                {$unwind:"$orders"},
                {$lookup:{
                    from:'products',
                    localField:"orders.productId",
                    foreignField:"_id",
                    as:'orderdItems'
                }},
                {$lookup:{
                    from:'otpusers',
                    localField:"userId",
                    foreignField:"_id",
                    as:'users'
                }},
            ])
            .then(cart => {
                // console.log(cart)
                resolve(cart)
            })  
        })
        
    },
    removeOrder:(orderId,productId) => {
        return new Promise((resolve, reject) => {
            Orders.updateOne(
                {_id:orderId,'orders.productId':productId},
                {$pull:{orders:{productId:productId}}})
            .then(data => resolve(data))
            .catch(err => reject(err))  
        })
    },
    viewOrdersByUserId:(userId)=>{
        return new Promise((resolve, reject) => {
            Orders.aggregate([
                {$match:{
                   userId:mongoose.Types.ObjectId(userId)
                }},
                {$unwind:"$orders"},
                {$lookup:{
                    from:'products',
                    localField:"orders.productId",
                    foreignField:"_id",
                    as:'orderdItems'
                }},
                // {$lookup:{
                //     from:'otpusers',
                //     localField:"userId",
                //     foreignField:"_id",
                //     as:'users'
                // }},
            ]).then(data =>{
                // console.log(data)
                resolve(data);  
            })
            .catch(err => reject(err));
        })
    }
}