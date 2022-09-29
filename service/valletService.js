const { default: mongoose } = require("mongoose")
const Vallet = require("../model/vallet")

module.exports={
    valletView:(userId)=>{
        return new Promise((resolve, reject) => {
            Vallet.findOne({userId}).then(val => resolve(val))
            .catch(err => reject(err))
        })
    },
    valletAggigateView:(userId)=>{
       return new Promise((resolve, reject) => {
            Vallet.aggregate([
                {$match:{
                   userId:mongoose.Types.ObjectId(userId)
                }},
                {$lookup:{
                    from:'otpusers',
                    localField:"userId",
                    foreignField:"_id",
                    as:'userDtails'
                }},
            ])
            .then(val =>  resolve(val))
           .catch(err => reject(err))
       }) 
    }
    ,updateVallet:(userId,balance)=>{
       return new Promise((resolve, reject) => {
            Vallet.updateOne({userId},{balance},{upsert:true})
            .then((res)=>resolve(res))
            .catch((err)=>reject(err))
       }) 
    },
    incrementVallet:(userId,value)=>{
       return new Promise((resolve, reject) => {
            Vallet.updateOne({userId},{$inc:{balance:value}},{upsert:true})
            .then((res)=>resolve(res))
            .catch((err)=>reject(err))
       }) 
    }
}