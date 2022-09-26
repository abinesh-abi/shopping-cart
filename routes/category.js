
var express = require("express");
const { varifyAdmin } = require("./varify/varifyAdmin");
const Category =require("../model/category");
const { db } = require("../model/category");
const { editCategory, findCategory, findOneCategory, addCategory, categoryFindOneById, categoryExistOrNot, editCategoryOffer, deleteCategory } = require("../helpers/categoryHelper");
var router = express.Router();


router.get('/',varifyAdmin, async(req,res) => { 
    res.render("admin/category2",{admin:req.admin})
 })

//  router.post('/add',async(req,res) => {
//    let body = req.body
//    await new Category({name:body.name}).save()
//    res.redirect("/admin/category")

//  })
router.get("/get", async(req,res)=>{
   let value = await findCategory()
   res.json(value)
})

 router.get('/add',async(req,res) => {
   let name = req.query.name
   name =name.toLocaleLowerCase()
   let categoryExits =  await findOneCategory(name)
   if (req.query.name.trim()==0) {
      res.json({
         inputErr:'Enter valied input'
      })
   }else if(categoryExits ) {
     res.json({inputErr:"This Category is Already Exists"}) 
   }
   else{
      
   await addCategory(name)
   .then(data => res.json(data))
   .catch(err => res.json({error:err}))
   }
 })

 

 router.get('/edit/:id',async(req,res) => {
   let id = req.params.id
   let categoryExits = await  categoryFindOneById(id)
   res.render("admin/editCategory",{id:id,Err:'',name:categoryExits.name})
 })

 router.post('/edit/:id',async(req,res) => {
   let name = req.body.name
   let id = req.params.id
  var invaliedName = (name.trim().length ==0 || !name.match(/^[a-zA-Z\-]/) || !name.match(/[a-zA-Z\-]$/))
   let data = await categoryExistOrNot(id,name)
   if (invaliedName) {
      res.render("admin/editCategory",{id:id,Err:'Invalied Input', name})
   }else if(data){
      res.render("admin/editCategory",{id:id,Err:'Category already exists',name})
   }else{
      editCategory(id,name).then(data =>{
         res.redirect("/admin/category")
      })
   }

 })

// router.get('/get',async(req,res)=>{
//   let category = await Category.aggregate([{$group:{_id:'array','categories':{$push:"$name"}}}])
//   console.log(category)
// })

router.get("/delete/:id",async(req,res) => { 
    try {
        await deleteCategory(req.params.id)
        res.status(200).redirect("/admin/category")
    } catch (errors) {
       res.send('error') 
    }
 })

 router.post("/editOffer",(req,res) => {
   let {categoryId,newOffer} = req.body
   if(newOffer== ''){
      let newOffer = 0 
      editCategoryOffer(categoryId,newOffer).then(data =>{
         res.json(data)
      }).catch(error =>res.json({error:error}))
   }else{
      editCategoryOffer(categoryId,newOffer).then(data =>{
         res.json(data)
      }).catch(error =>res.json({error:error}))
   }

 })

module.exports = router;