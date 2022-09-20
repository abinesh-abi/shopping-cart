const Coupon = require("../model/coupon")

module.exports ={
    getCoupon:()=>{
        return new Promise((resolve, reject) => {
            Coupon.find()
            .then(data=>resolve(data))
            .catch(err=> reject(err))
        })
    },
    addCoupon:(code,offer,expireAt)=>{
        return new Promise((resolve, reject) => {
            new Coupon({code,offer}).save()
            .then(data=>resolve(data))
            .catch(err=> reject(err))
        })
    },
    removeCoupon:(_id)=>{
        return new Promise((resolve, reject) => {
            Coupon.findOneAndRemove(_id)
            .then(data=>resolve(data))
            .catch(err=> reject(err))
        })
    },
    varifyCoupon:(coupon)=>{
        return new Promise((resolve, reject) => {
            Coupon.findOne({code:coupon})
            .then(data=>resolve(data))
            .catch(err=> reject(err))
        })
    }
}