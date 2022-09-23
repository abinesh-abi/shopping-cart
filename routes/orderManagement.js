var express = require("express");
const { orderAggregate, removeOrder, cancelOrder, deleverdOrder, shippedOrder } = require("../helpers/orderHelper");
const { valletView, updateVallet } = require("../helpers/valletHelper");
const { varifyAdmin } = require("./varify/varifyAdmin");
var router = express.Router();

router.get('/',varifyAdmin,(req,res)=>{
    let admin = req.admin
   res.render('admin/orderManagement2', { admin}) 
})
router.get('/check',varifyAdmin,async(req,res)=>{
    let admin = req.admin
    // let users = ()
    let order = orderAggregate()
    .then(data=>{
        res.json(data)
    })
    .catch(err=>console.log(err))  
})
router.get('/cancel',varifyAdmin,async(req,res)=>{
    let {userId,orderId,payMethod,totalPrice} = req.query
    
    let vallet = await valletView(userId)
    let newValletBalance = vallet.balance + Number(totalPrice) 
    if (payMethod != 'cod') {
        updateVallet(userId,newValletBalance).then(data=>{
        console.log(data)
        }) .catch(err=>console.log(err))
    }
    cancelOrder(orderId)
    .then(data=>{
        console.log(data)
        res.json(data)
    })
    .catch(err=>console.log(err))
})
router.get('/deleverd',varifyAdmin,(req,res)=>{
    let {orderId} = req.query
    deleverdOrder(orderId)
    .then(data=>{
        console.log(data)
        res.json(data)
    })
    .catch(err=>console.log(err))
})
router.get('/shipped',varifyAdmin,(req,res)=>{
    let {orderId} = req.query
    shippedOrder(orderId)
    .then(data=>{
        res.json(data)
    })
    .catch(err=>console.log(err))
})

router.get('/remove',varifyAdmin,async(req,res)=>{
    let {orderId} = req.query
    removeOrder(orderId)
    .then(data=>res.json(data))
    .catch(err=>console.log(err))
})

module.exports = router