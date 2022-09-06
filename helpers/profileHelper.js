const User = require("../model/users")

module.exports ={
    viewProfile:(userId)=>{
        return new Promise((resolve,reject)=>{
           User.findOne({_id:userId})
            .then((user)=>resolve(user))
        })
    },
    viewProfileByIdAndEmail:(email,number)=>{
        return new Promise((resolve,reject)=>{
            User.findOne({number,email}).then(user=>{
                console.log(user)
            })
        })
    },
    editProfile:(userId,body)=>{
        return new Promise((resolve,reject)=>{
           User.updateOne({_id:userId},{$set:{...body}}) .then(user=>{
            resolve(user)
        })
        })
    }

}