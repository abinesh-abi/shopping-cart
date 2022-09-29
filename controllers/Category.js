const { editCategory, findCategory, findOneCategory, addCategory, categoryFindOneById, categoryExistOrNot, editCategoryOffer, deleteCategory } = require("../service/categoryService");

module.exports = {
  categoryHome: async (req, res) => {
    try {
      res.render("admin/category2", { admin: req.admin });
    } catch (e) {
      res.json(error);
    }
  },
  getCategories: async (req, res) => {
    try {
      let value = await findCategory();
      res.json(value);
    } catch (e) {
      res.json(error);
    }
  },

  inserCategory:async(req,res) => {
    try{
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
 }catch(err) {
    res.json(err)
 }
    },
    editCategory:async(req,res) => {
   let id = req.params.id
   let categoryExits = await  categoryFindOneById(id)
   res.render("admin/editCategory",{id:id,Err:'',name:categoryExits.name})
 },
 getEditCategory:async(req,res) => {
   let id = req.params.id
   let categoryExits = await  categoryFindOneById(id)
   res.render("admin/editCategory",{id:id,Err:'',name:categoryExits.name})
 },
 postEditCategory:async(req,res) => {
    try{
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
    }catch(error){
        res.json({error})
    }
    
 },
 deleteCategory: async(req,res) => { 
    try {
        await deleteCategory(req.params.id)
        res.status(200).redirect("/admin/category")
    } catch (errors) {
       res.send('error') 
    }
 },
 editOffer:(req,res) => {
    try{

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
    }catch(error){
        res.json({error})
    }
 }
};
