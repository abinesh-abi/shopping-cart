const { default: mongoose } = require("mongoose")
const Orders = require("../model/orders")

module.exports ={
    orderAggregate:(orderId)=>{
        return new Promise((resolve, reject) =>{
            Orders.aggregate([
                // {$match:{
                //    userId:mongoose.Types.ObjectId(orderId)
                // }},
                // {$unwind:"$orders"},
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
            .catch((err) => {reject(err)})
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
    },
    orderInWeek:()=>{
        return new Promise((resolve, reject) =>{
        Orders.aggregate([
            {$match:{
               createdAt:{
                   $gte: new Date(new Date() - 7 * 60 * 60 * 24 * 1000)
               },
            }},
            {$unwind:"$orders"},
            {
                $project:{
                    year:{$year:'$createdAt'},
                    month: { $month: "$createdAt" },
                    day: { $dayOfMonth: "$createdAt" },
                    dayOfWeek: { $dayOfWeek: "$createdAt" },
                    week: { $week: "$createdAt" },
                    date:{$toDate:"$createdAt" }
                    // date:{$dateToString:{format:"$createdAt"} }
                },
            },
            {
                $group:{
                    _id:'$dayOfWeek',
                    count:{$sum:1},
                    detail: { $first: '$$ROOT' },
                }
            },
            {
                $sort:{
                    _id:1
                }
            },
   
            // {"$replaceRoot":{"newRoot":"$detail"}}
            
        ])
        .then(data=>resolve(data))
        .catch(err => reject(err))
        })
        
    },
    orderInMonth:()=>{
        return new Promise((resolve, reject) =>{
        Orders.aggregate([
            {$match:{
               createdAt:{
                   $gte: new Date(new Date().getMonth()-10)
               },
            }},
            {$unwind:"$orders"},
            {
                $project:{
                    year:{$year:'$createdAt'},
                    month: { $month: "$createdAt" },
                    day: { $dayOfMonth: "$createdAt" },
                    dayOfWeek: { $dayOfWeek: "$createdAt" },
                    week: { $week: "$createdAt" },
                    date:{$toDate:"$createdAt" }
                    // date:{$dateToString:{format:"$createdAt"} }
                },
            },
            {
                $group:{
                    _id:'$month',
                    count:{$sum:1},
                    detail: { $first: '$$ROOT' },
                }
            },
            {
                $sort:{
                    _id:1
                }
            },
   
            // {"$replaceRoot":{"newRoot":"$detail"}}
            
        ])
        .then(data=>resolve(data))
        .catch(err => reject(err))
        })
        
    },
    totalErnings:()=>{
        return new Promise((resolve, reject) => {
            Orders.aggregate([
                {
                    $match:{}
                },
                {
                    $group:{
                        _id:"tp",
                        totalErnings:{
                            $sum:'$totalPrice'
                        }
                        
                    }
                }
            ])
            .then(data=>resolve(data))
            .catch(err => reject(err))
        })
    }
}