const Coupon = require("../model/coupon")

module.exports ={
    getCoupon:()=>{
        return new Promise((resolve, reject) => {
            Coupon.find()
            .then(data=>resolve(data))
            .catch(err=> reject(err))
        })
    },
    getCouponByName:(code)=>{
        return new Promise((resolve, reject) => {
            Coupon.findOne({code})
            .then(data=>resolve(data))
            .catch(err=> reject(err))
        })
    },
    addCoupon:(code,offer,expireAt)=>{
        return new Promise((resolve, reject) => {
            new Coupon({code,offer,expireAt}).save()
            .then(data=>resolve(data))
            .catch(err=> reject(err))
        })
    },
    removeCoupon:(_id)=>{
        return new Promise((resolve, reject) => {
            Coupon.deleteOne({_id})
            .then(data=>resolve(data))
            .catch(err=> reject(err))
        })
    },
    removeExpiredCoupon:()=>{
        return new Promise((resolve, reject) => {
            Coupon.deleteMany({expireAt:{$lt:new Date().toISOString()}})
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