const Category = require("../model/category")
const Products = require("../model/product")

module.exports ={
    getAllProducts:()=>{
        return new Promise((resolve, reject) => {
            Products.find()
            .then((products) => resolve(products))
            .catch((err) => reject(err))
            
        })
    },findProduct:name=>{
    return new Promise((resolve, reject) => {
        Products.find({ name: { $regex: `^${name}` ,'$options' : 'i' } })
        .then(data => resolve(data))
        .catch(err=>reject(err))
    })
   },deleteProduct:_id=>{
    return new Promise((resolve, reject) => {
       Products.findOneAndDelete({ _id})
        .then(data => resolve(data))
        .catch(err=>reject(err))
    })
   },getEditCategories:()=>{
    return new Promise((resolve, reject) => {
        Category.aggregate([{$group:{_id:'array','categories':{$push:"$name"}}}])
        .then(data => resolve(data))
        .catch(err=>reject(err))
    })
   },findProductByName:name=>{
    return new Promise((resolve, reject) => {
        Products.findOne({name})
        .then(data => resolve(data))
        .catch(err=>reject(err))
    })
   },addProduct:body=>{
    return new Promise((resolve, reject) => {
        new Products({ ...body }).save()
        .then(data => resolve(data))
        .catch(err=>reject(err))
    })
   }


}
