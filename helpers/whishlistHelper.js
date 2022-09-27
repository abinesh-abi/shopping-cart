const wishlist = require("../model/wishlist")

module.exports ={
    addToWishlist:(userId,productId)=>{
        return new Promise((resolve, reject) => {
          wishlist.updateOne(
            {userId},
            { $addToSet: { wishlist: productId} },
            {upsert: true}
            ).then(data=>resolve(data))
            .catch(err=>reject(err))
        })
    }
}