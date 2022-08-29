
var express = require("express");
const { varifyAdmin } = require("./varify/varifyAdmin");
const Category =require("../model/category");
const { db } = require("../model/category");
var router = express.Router();


router.get('/',varifyAdmin, async(req,res) => { 
    let  data;
    await Category.find().then(value=>data = value)
    console.log(data);
    res.render("admin/category",{admin:req.admin,data:data})
 })

 router.post('/add',async(req,res) => {
    let data = await new Category({name:req.body.name})
    .save()
    res.redirect("/admin/category")
 })
router.get("/delete/:id",async(req,res) => { 
    try {
        console.log(req.params.id);
        await Category.findOneAndDelete({_id:req.params.id})
        res.status(200).redirect("/admin/category")
    } catch (errors) {
       res.send('error') 
    }
 })

module.exports = router;