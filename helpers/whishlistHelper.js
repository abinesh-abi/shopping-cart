const { Types } = require("mongoose")
const wishlist = require("../model/wishlist")

module.exports ={
    addToWishlist:(userId,productId)=>{
        return new Promise((resolve, reject) => {
          wishlist.updateOne(
            {userId},
            { $addToSet: { wishlist: productId} },
            {upsert: true}
            ).then(data=>{
                console.log(data)
                resolve(data)})
            .catch(err=>reject(err))
        })
    },getWishlist:(userId)=>{
        return new Promise((resolve, reject) => {
          wishlist.aggregate([
            {
                $match:{userId:Types.ObjectId(userId)}
            },
            {
                $unwind:'$wishlist'    
            },
                {$lookup:{
                    from:'products',
                    localField:"wishlist",
                    foreignField:"_id",
                    as:'wishlistItems'
                }},
          ]).then(data=>resolve(data))
            .catch(err=>reject(err))
        })
    },
    removeFromWishlist:(userId,productId)=>{
        return new Promise((resolve, reject) => {
            wishlist.updateOne(
            {userId},
            { $pull: { wishlist: productId} },
            ).then(data=>resolve(data))
            .catch(err=>reject(err))
        })
    }
}