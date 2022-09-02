const express = require('express') 
const Products = require('../model/product')

const router = express.Router()

router.get('/view/:id', async(req, res) => {
    let product= await Products.findOne({_id:req.params.id})
    res.render("user/viewProduct" ,{name:'',_id:product._id})
    // res.status(200).json(product)
    console.log(product._id);

 })


module.exports = router