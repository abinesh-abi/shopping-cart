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
    let order = orderAggregate()
    .then(data=>res.json(data))
    .catch(error=>res.json({error}))  
})

//cancel order
router.get('/cancel',varifyAdmin,async(req,res)=>{
    let {userId,orderId,payMethod,totalPrice} = req.query
    let vallet = await valletView(userId)
    let newValletBalance = vallet.balance + Number(totalPrice) 
    if (payMethod != 'cod') {
       await updateVallet(userId,newValletBalance)
    }
    cancelOrder(orderId)
    .then(data=>res.json(data))
    .catch(error=>res.json({error}))
})
router.get('/deleverd',varifyAdmin,(req,res)=>{
    let {orderId} = req.query
    deleverdOrder(orderId)
    .then(data=>res.json(data))
    .catch(error=>res.json({error}))
})
router.get('/shipped',varifyAdmin,(req,res)=>{
    let {orderId} = req.query
    shippedOrder(orderId)
    .then(data=>res.json(data))
    .catch(error=>res.json({error}))
})

router.get('/remove',varifyAdmin,async(req,res)=>{
    let {orderId} = req.query
    removeOrder(orderId)
    .then(data=>res.json(data))
    .catch(error=>res.json({error}))
})

module.exports = router