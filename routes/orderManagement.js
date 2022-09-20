var express = require("express");
const { orderAggregate, removeOrder, cancelOrder, deleverdOrder, shippedOrder } = require("../helpers/orderHelper");
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
router.get('/cancel',varifyAdmin,(req,res)=>{
    let {orderId,productId} = req.query
    cancelOrder(orderId,productId)
    .then(data=>{
        console.log(data)
        res.json(data)
    })
    .catch(err=>console.log(err))
})
router.get('/deleverd',varifyAdmin,(req,res)=>{
    let {orderId,productId} = req.query
    deleverdOrder(orderId,productId)
    .then(data=>{
        console.log(data)
        res.json(data)
    })
    .catch(err=>console.log(err))
})
router.get('/shipped',varifyAdmin,(req,res)=>{
    let {orderId,productId} = req.query
    shippedOrder(orderId,productId)
    .then(data=>{
        res.json(data)
    })
    .catch(err=>console.log(err))
})

router.get('/remove',varifyAdmin,async(req,res)=>{
    let {orderId,productId} = req.query
    removeOrder(orderId,productId)
    .then(data=>res.json(data))
    .catch(err=>console.log(err))
})

module.exports = router