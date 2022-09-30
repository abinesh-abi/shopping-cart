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
    categoryViceView:()=>{
        return new Promise((resolve, reject) =>{
            Category.aggregate([
                {$match:{}},
                {$lookup:{
                    from:'products',
                    localField:"_id",
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
   getCategories:()=>{
    return new Promise((resolve, reject) => {
        Category.find().then(data =>{
            resolve(data)
        }).catch(err=>reject(err))
    })
   },getAllUser:()=>{
    return new Promise((resolve, reject) => {
        User.find()
        .then(data => resolve(data))
        .catch(err=>reject(err))
    }) 
   }
   ,getUser:(number,email)=>{
    return new Promise((resolve, reject) => {
        User.findOne({$or:[ {number},{email} ]})
        .then(data => resolve(data))
        .catch(err=>reject(err))
    }) 
   },getUserByEmail:email=>{
    return new Promise((resolve, reject) => {
        User.findOne({ email})
        .then(data => resolve(data))
        .catch(err=>reject(err))
    })
   },getUserByNumber:number=>{
    return new Promise((resolve, reject) => {
        User.findOne({ number})
        .then(data => resolve(data))
        .catch(err=>reject(err))
    })
   },findUser:name=>{
    return new Promise((resolve, reject) => {
        User.find({ name: { $regex: `^${name}` } })
        .then(data => resolve(data))
        .catch(err=>reject(err))
    })
   },deleteUser:_id=>{
    return new Promise((resolve, reject) => {
       User.findOneAndDelete({ _id})
        .then(data => resolve(data))
        .catch(err=>reject(err))
    })
   },userBanOrUnban:(_id,status)=>{
    return new Promise((resolve, reject) => {
        User.findOneAndUpdate({_id},{blockOrNot:status})
        .then(data => resolve(data))
        .catch(err=>reject(err))
    })
   }



}