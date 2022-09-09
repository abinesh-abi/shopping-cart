var express = require("express");
const { orderAggregate, removeOrder } = require("../helpers/orderHelper");
const { varifyAdmin } = require("./varify/varifyAdmin");
var router = express.Router();

router.get('/',varifyAdmin,(req,res)=>{
    let admin = req.admin
   res.render('admin/orderManagement', { admin}) 
})
router.get('/check',varifyAdmin,async(req,res)=>{
    let admin = req.admin
    // let users = ()
    let order = orderAggregate()
    .then(data=>res.json(data))
    .catch(err=>console.log(err))  
})

router.get('/remove',varifyAdmin,async(req,res)=>{
    let {orderId,productId} = req.query
    console.log(orderId,productId)
    removeOrder(orderId,productId)
    .then(data=>res.json(data))
    .catch(err=>console.log(err))
    
})

module.exports = router