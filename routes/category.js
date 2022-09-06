
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
   let body = req.body
   await new Category({name:body.name}).save()
   res.redirect("/admin/category")

 })

 router.get('/edit/:id',async(req,res) => {
   let id = req.params.id
   res.render("admin/editCategory",{id:id,Err:''})
 })

 router.post('/edit/:id',async(req,res) => {
   let name = req.body.name
   let id = req.params.id
  var invaliedName = (name.trim().length ==0 || !name.match(/^[a-zA-Z\-]/) || !name.match(/[a-zA-Z\-]$/))
   let data 
   await Category.findOne({name:name}).then(val=>data = val)
   console.log(data)

   if (invaliedName) {
      res.render("admin/editCategory",{id:id,Err:'Invalied Input'})
   }else if(data){
      res.render("admin/editCategory",{id:id,Err:'Category already exists'})
   }else{
      Category.findOneAndUpdate({_id:id},{$set:{name:name}}).then(data =>{
         res.redirect("/admin/category")
      })
   }

 })

router.get('/get',async(req,res)=>{
  let category = await Category.aggregate([{$group:{_id:'array','categories':{$push:"$name"}}}])
  console.log(category)
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