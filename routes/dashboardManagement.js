var express = require("express");
const { orderInWeek, totalErnings, orderInMonth, orderDayVice, orderMonthVice, orderWeekVice } = require("../helpers/orderHelper");
var router = express.Router();

router.get("/",(req, res)=>{
    res.render('admin/dashboard')
})
router.get('/totalErnigs',(req,res)=>{
    totalErnings().then(data=>{
        res.json(data[0].totalErnings)
    }).catch(err => res.json(err))
})

router.get('/orderDayVice',(req,res)=>{
   orderDayVice()
   .then(data=>{
    // let date = new Date((data[0].detail.date)).toDateString();
    res.json(data)
})
   .catch(err=>{
    res.send('err') 
})
})

router.get('/orderWeekVice',(req,res)=>{
    orderWeekVice()
   .then(data=>{
    // let date = new Date((data[0].detail.date)).toDateString();
    res.json(data)
})
   .catch(err=>{
    res.send('err') 
})
})
router.get('/orderMonthVice',(req,res)=>{
    orderMonthVice()
   .then(data=>{
    // let date = new Date((data[0].detail.date)).toDateString();
    res.json(data)
})
   .catch(err=>{
    res.send('err') 
})
})

module.exports = router;