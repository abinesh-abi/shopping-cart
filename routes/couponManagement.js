var express = require("express");
const { addCoupon, getCoupon, removeCoupon } = require("../helpers/couponHelper");
const { varifyAdmin } = require("./varify/varifyAdmin");
var router = express.Router();


router.get('/',varifyAdmin, (req,res) => { 
    res.render('admin/coupon')
    // res.render("admin/category2",{admin:req.admin,data:data})
 })
 router.get('/get',varifyAdmin,(req,res) => { 
    getCoupon().then(data=>res.json(data))
    .catch(err=>res.json('err'))
 })
router.get('/add',varifyAdmin,async(req,res)=>{
    let { code, value,expires } = req.query
    addCoupon(code,value).then(data=>res.json(data))
    
    .catch(err=>res.json(err))
    
})
router.get('/remove',varifyAdmin,async(req,res)=>{
    let { id} = req.query
    removeCoupon(id).then(data=>res.json(data))
    .catch(err=>res.json(err))
})

module.exports = router;