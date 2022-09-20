
var express = require("express");
const { varifyAdmin } = require("./varify/varifyAdmin");
const Category =require("../model/category");
const { db } = require("../model/category");
var router = express.Router();


router.get('/',varifyAdmin, async(req,res) => { 
    let  data;
    await Category.find().then(value=>data = value)
    console.log(data);
    res.render("admin/category2",{admin:req.admin,data:data})
 })

//  router.post('/add',async(req,res) => {
//    let body = req.body
//    await new Category({name:body.name}).save()
//    res.redirect("/admin/category")

//  })
router.get("/get",(req,res)=>{
    Category.find().then(value=>res.json(value))
    .catch(err =>res.json(err))
})

 router.get('/add',async(req,res) => {
   let name = req.query.name
   if (req.query.name.trim()==0) {
      res.json({
         inputErr:true
      })
   }else{
      
   await new Category({name}).save()
   .then(data => res.json(data))
   .catch(err => res.json({error:err}))
   }
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
        await Category.findOneAndDelete({_id:req.params.id})
        res.status(200).redirect("/admin/category")
    } catch (errors) {
       res.send('error') 
    }
 })

 router.post("/editOffer",(req,res) => {
   let {categoryId,newOffer} = req.body
   console.log(req.body)
      Category.findOneAndUpdate({_id:categoryId},{$set:{offer:newOffer}}).then(data =>{
         res.json(data)
      }).catch(error =>res.json({error:error}))

 })

module.exports = router;