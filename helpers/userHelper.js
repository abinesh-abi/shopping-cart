const Category = require("../model/category")
const User = require("../model/users")

module.exports ={
    userFindOne:(userId)=>{
        return new Promise((resolve, reject) =>{
            User.findById(userId).then(data=>{
                resolve(data)
            }).catch(err=>{reject(err)})

        })
    },
    categoryViceView:(category)=>{
        return new Promise((resolve, reject) =>{
            Category.aggregate([
                {$match:{}},
                {$lookup:{
                    from:'products',
                    localField:"name",
                    foreignField:"category",
                    as:'products'
                }}
            ])
            .then(product => {
                resolve(product)
            }) .catch(err => reject(err))
        })
    },
   referralCheck:(refCode)=>{
    return new Promise((resolve, reject) => {
        User.findOne({refCode}).then(data=>{
         resolve(data)
        }).catch(err=>{reject(err)})
    })
   },
}