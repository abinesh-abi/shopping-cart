const express = require('express'); 
const { productExistsInCart, addToCart, allCartItems, removeFromCart, incrementProduct, decrementProduct, placeOrder, getCart } = require('../helpers/cartHelper');
const { viewProfile, addAddress } = require('../helpers/profileHelper');
const { userFindOne } = require('../helpers/userHelper');
const Cart = require('../model/cart');
const Orders = require('../model/orders');
const Products = require('../model/product');
const { userLogged } = require('./varify/userLogged');
const { varifyUser } = require("./varify/varifyUser");

const router = express.Router()

router.get('/view/:id',userLogged, async(req, res) => {
   let name = req.userName
   let id = req.userId
    let product= await Products.findOne({_id:req.params.id})
    res.render("user/viewProduct" ,{name,id,product})
    // res.status(200).json(product)
    console.log(product._id);

 })
 router.get('/categoryView/:category',varifyUser,(req, res) => {
  let category = req.params.category
  let name = req.userName
  Products.find({category}).then(product =>{
    res.render("user/categoryView",{name,product:product,category})
  })
 })

 router.get('/cart',varifyUser,async(req,res)=>{
   let name = req.userName
  let id = req.userId
  let userId = await req.userId
  console.log(name,id)
   let val = await allCartItems(userId)

  //  if(val.length ===0){
  //  res.render("user/cart",{name,id,cart:[],qty:'',totalPrice:''})
  //  }
  // else {
   let cart = val[0].cartItems
   let qty = val[0].cart

  // find tota Price 
   let totalPrice = 0
   for (const val in cart) {
    let price = cart[val].price
    let totalQuantity = qty[val].quantity
    totalPrice += price * totalQuantity
   }

   res.render("user/cart",{name,id,cart,qty,totalPrice})
  // }
 })

 router.get('/addToCart/:id',varifyUser,async(req,res)=> { 

    let productId = req.params.id
    let userId = req.userId
    console.log(productId,userId,'hllo')

    try {

     let productExist = await productExistsInCart(userId,productId)
     console.log(productExist)
     if (productExist) {
      res.json({message:"Already exists in cart"})
     }else{
      console.log('not found')
      let cart = await addToCart(userId,productId)
      res.json({message:"successfully added to cart"})
     }
    } catch (err) {
     if (err) {
      res.send(err)
     } 
    }
  })

  router.get("/cart/delete/:id",varifyUser,(req,res)=>{
    let userId = req.userId
    let productId = req.params.id
    removeFromCart(userId,productId).then(data=>{
      res.redirect('/product/cart')
    })
  })


  router.get('/cart/increment/:id',varifyUser,(req,res)=>{
    let userId = req.userId
    let productId = req.params.id
    incrementProduct(userId,productId).then(data=>{
      res.redirect("/product/cart")
      console.log(data)
    }) 
  })
  router.get('/cart/decrement/:id',varifyUser,(req,res)=>{
    let userId = req.userId
    let productId = req.params.id
    console.log(userId,productId)
    decrementProduct(userId,productId).then(data=>{
      res.redirect("/product/cart")
      console.log(data)
    }) 
  })

  router.get('/checkout',varifyUser,async(req,res)=>{
    let name = req.userName
    let userId = req.userId
    let user = await viewProfile(userId)
   let val = await allCartItems(userId)

   let cart = val[0].cartItems
   let qty = val[0].cart

  // find tota Price 
   let totalPrice = 0
   for (const val in cart) {
    let price = cart[val].price
    let totalQuantity = qty[val].quantity
    totalPrice += price * totalQuantity
   }
  //  res.json(user)
    res.render('user/checkout',{name,totalPrice,user})
  })

  router.post("/checkout",varifyUser,async(req,res) => {
    let userId = req.userId
    let { totalPrice , address} = req.body
    console.log(totalPrice,address)

    // let user = await userFindOne(userId)
    let cart = await getCart(userId)
    let product = cart.cart
    placeOrder(userId,product,totalPrice,address)
    .then(data =>res.redirect('/'))
    .catch(err =>console.log(err)) 

  })

router.get('/addAddressCheckout',varifyUser,async(req,res)=>{
    let userId = req.userId
    let name = req.userName
    console.log(req)
    res.render("user/addAddressCheckout",{name,Err:''})
})

router.post("/addAddressCheckout",varifyUser,async(req,res)=>{
    let userId = req.userId
    let userName = req.userName
    let address = req.body.address

    //validation
    let invaliedAddress = (address.trim().length ==0 )

    if (invaliedAddress) {
        res.render("user/addAddressCheckout",{name:userName,Err:'This feild cannot be empty'})
    }else{
            addAddress(userId,address)
            .then(user=>{
                res.redirect("/product/checkout")
            })
    }
})
module.exports = router