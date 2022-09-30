const express = require('express'); 
const { productExistsInCart, addToCart, allCartItems, removeFromCart, incrementProduct, decrementProduct, placeOrder, getCart, emptyCart, updateQuantity } = require('../service/cartService');
const Razorpay = require('razorpay'); 

const { viewProfile, addAddress } = require('../service/profileService');
const { userFindOne } = require('../service/userService');
const Cart = require('../model/cart');
const Category = require('../model/category');
const Orders = require('../model/orders');
const Products = require('../model/product');
const { userLogged } = require('./varify/userLogged');
const { varifyUser } = require("./varify/varifyUser");


//paypal
// const paypal = require('paypal-rest-sdk');
const paypal = require("@paypal/checkout-server-sdk");
const { resolve } = require('path');
const { varifyCoupon } = require('../service/couponService');
const { valletView, updateVallet } = require('../service/valletService');
const { addToWishlist, getWishlist, removeFromWishlist, wishlistStatus } = require('../service/whishlistService');
const { getAggregatedProducts, getAllProducts, getProductsByCategory } = require('../service/productService');
const { findCategory } = require('../service/categoryService');
const Environment =
  process.env.NODE_ENV === "production"
    ? paypal.core.LiveEnvironment
    : paypal.core.SandboxEnvironment
const paypalClient = new paypal.core.PayPalHttpClient(
  new Environment(
    process.env.PAYPAL_CLIENT_ID,
    process.env.PAYPAL_SECRET
  )
)

const router = express.Router()

router.get('/view/:id',userLogged, async(req, res) => {
   let name = req.userName
   let id = req.userId
  let categories = await Category.find()
    let product= await Products.findOne({_id:req.params.id})
    let cat = await Category.find({_id:product.category})
    let off = cat[0].offer
    let offerPrice = product.price -(product.price * off /100)
    res.render("user/viewProduct" ,{name,id,product,categories,offerPrice})

 })
 router.get('/categoryView/:category',varifyUser,async(req, res) => {
  let categoryInput = req.params.category
  let name = req.userName
  let categories = await Category.find()
  console.log(categories)
    let cat = await Category.find({_id:categoryInput})
    let category = cat[0].name
    let off = cat[0].offer
  // Products.find({category}).then(product =>{
    getProductsByCategory(categoryInput).then(product=>{
    res.render("user/categoryView",{name,product:product,category,categories,off})
  })
 })

router.get('/addToWishlist',varifyUser,async(req,res) =>{
  try{
    let userId = req.userId
    let {productId} = req.query
    let status = await wishlistStatus(userId,productId)

    if (status.length == 0) {
      let data = await addToWishlist(userId,productId)
      res.json(data)
    }else{
      let data = removeFromWishlist(userId,productId) 
      res.json(data)
    }

  }catch(err){res.json(err)}


})

router.get("/getWishlist",varifyUser,async(req,res) =>{
  try{
    let userName = req.userName
  let userId = req.userId
  let items = await getWishlist(userId)
  res.json({items,userName})
  }catch(e){
    res.json({error:e})
  }
})

router.put("/removeWishlist",varifyUser,async(req,res) =>{
  try{
  let {productId} = req.body
  let userId = req.userId
  let data = removeFromWishlist(userId,productId) 
  res.json(data)
  }catch(err){res.json(err)}
})

router.get("/wishlistStatus",varifyUser,async(req,res) =>{
  try{
    let {productId} = req.query
    let userId = req.userId
    let data = await wishlistStatus(userId,productId)
    if (data.length ==0) {
      res.json({status: false}) 
    }else{
      res.json({status: true})
    }
  } catch(err){res.json(err)}
})

 router.get('/cart',varifyUser,async(req,res)=>{
  let categories = await findCategory()
   let name = req.userName
  let id = req.userId
  let userId =  req.userId
   res.render("user/cart",{name,id,categories})
 })

router.get('/getCartDetails',varifyUser,async (req,res)=>{
   let name = req.userName
  let id = req.userId
  let userId =  req.userId
  let categories = await findCategory()
   let cart = await allCartItems(userId)
   if(cart.length ===0){
    res.json({cart:false})
   }
  else {

    //find category
    let category ={}
    for(val of categories){
     category[val._id]=val.offer 
    }
//   // find total Price 
   let totalPrice = 0
   let totalOfferPrice = 0
//calculate totalPrice
   for (const val in cart) {
    let price = cart[val].cart.price
    let totalQuantity = cart[val].cart.quantity
    totalPrice += price * totalQuantity
    totalOfferPrice += (price -(price *category[cart[val].cartItems.category]/100))*totalQuantity
   }
   parseInt(totalOfferPrice)
   res.json({cart,totalPrice,totalOfferPrice:parseInt(totalOfferPrice),categories,category})
  }
})


 //add to cart
 router.get('/addToCart',varifyUser,async(req,res)=> { 

    let {productId,price} = req.query
    let userId = req.userId
    try {

     let productExist = await productExistsInCart(userId,productId)
     if (productExist) {
      res.json({message:"Already exists in cart"})
     }else{
      let cart = await addToCart(userId,productId,price)
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
      res.json(data)
    })
  })


  router.get('/cart/increment/:id',varifyUser,async(req,res)=>{
    let userId = req.userId
    let productId = req.params.id
    incrementProduct(userId,productId).then(data=>{
      res.json(data)
    }) 
  })
  router.get('/cart/decrement/:id',varifyUser,(req,res)=>{
    let userId = req.userId
    let productId = req.params.id
    decrementProduct(userId,productId).then(data=>{
      res.json(data)
    }) 
  })

  router.get('/varifyCoupon',varifyUser,(req,res)=>{
    let {coupon} = req.query
    varifyCoupon(coupon).then(data=>{
      res.json(data)
    })
  })

  router.get('/checkout',varifyUser,async(req,res)=>{
  let categories = await Category.find()
    let name = req.userName
    let userId = req.userId
    let user = await viewProfile(userId)
   let val = await allCartItems(userId)

try {
  let totalPrice = req.query.offerPrice
   let cart = val[0].cartItems
   let qty = val[0].cart
    Cart.updateOne({userId},{$set:{totalPrice}})
    .then((data)=>{console.log([data])})
    res.render('user/checkout',{name,totalPrice,user,categories})
} catch (error) {
  console.log('error')
  res.redirect('/')
}

  })


//for razorpay
var instance = new Razorpay({ 
  key_id:process.env.RAZORPAY_KEE_ID ,
  key_secret:process.env.RAZORPAY_SECRET 
   })
 
   router.get('/updatePrice/:id',varifyUser,(req,res)=>{
    let userId = req.userId
    let totalPrice = req.params.id
    console.log({totalPrice,userId})
    Cart.updateOne({userId},{$set:{totalPrice}}).then(data=>console.log(data))
   })

  router.post("/checkout",varifyUser,async(req,res) => {
    console.log(req.body)
  let categories = await Category.find()
    let name = req.userName
    let userId = req.userId
    let { totalPrice, address} = req.body
    address = address[0]
    Cart.updateOne({userId},{$set:{address}}).then(data => console.log(data))
    console.log(totalPrice,address)
    // paypal
    if (req.body.payMethod=='paypal') {
      res.render('user/paypal',{
        name,
        categories,
          totalPrice,
          address,
           paypalClientId:process.env.PAYPAL_CLIENT_ID
      })
      //razorpay
    } else if (req.body.payMethod=='razorpay') {
        res.render('user/razorpay',{
          name,
          categories,
          totalPrice,
          address
        })


    // COD
    } else if (req.body.payMethod=='cod') {
    // let user = await userFindOne(userId)
    let cart = await getCart(userId)
    let product = cart.cart
    let method  = 'cod'
    placeOrder(userId,product,totalPrice,address,method)
    .then(data =>{
      emptyCart(userId).then((response)=>console.log(response,))
      .catch((err)=>console.log(err))
      res.render("user/checkoutSucces",{name,categories})
    })
    .catch(err =>console.log(err)) 

    // wallet
    } 
    else if(req.body.payMethod=='vallet'){
    let cart = await getCart(userId)
    let product = cart.cart
    let method  = 'vallet'
    let vallet = await valletView(userId)

    let newValletBalance = vallet.balance - totalPrice

    updateVallet(userId,newValletBalance).then(data=>{
      console.log(data)
    }) .catch(err=>console.log(err))

    placeOrder(userId,product,totalPrice,address,method)
    .then(data =>{
      emptyCart(userId).then((response)=>console.log(response,))
      .catch((err)=>console.log(err))
      res.render("user/checkoutSucces",{name,categories})
    })
    .catch(err =>console.log(err)) 
      
    }

  })
  // razorpay create order
  router.post('/razorpayCreateOreder',varifyUser,async(req,res)=>{
    let userId = req.userId
    const { currency,receipt, notes}  = req.body;      
    let cart = await getCart(userId)
    let amount =Number(cart.totalPrice)*100

    instance.orders.create({amount, currency}, 
        (err, order)=>{
          //STEP 3 & 4: 
          if(!err){
            res.json({
              amount:order.amount,
              orderId:order.id,
            })
          }else
            console.log(err)
        }
    )

  })
  // varify order
  router.post('/razorpayVarify',varifyUser, async(req,res)=>{
    let body = req.body
    console.log(body)
    const crypto = require('crypto') 
    let hmac = crypto.createHmac('sha256',process.env.RAZORPAY_SECRET );
    hmac.update(body['razorpay_order_id'] + "|" + body['razorpay_payment_id']);
    hmac = hmac.digest('hex')
    if (hmac==body['razorpay_signature']) {
      res.json({status:true})

      let userId = req.userId
    let cart = await getCart(userId)
    let product = cart.cart
    let method  = 'razorpay'
    let { totalPrice , address} = cart
    placeOrder(userId,product,totalPrice,address,method)
    .then(data =>{
      emptyCart(userId).then((response)=>console.log(response,))
      .catch((err)=>console.log(err))
    })
    .catch(err =>console.log(err)) 
    }else{
      res.json({status:false})
    }
})



router.post("/paypal/createOrder", async (req, res) => {
   const request = new paypal.orders.OrdersCreateRequest()
  let userId = req.userId
  let cart =await getCart(userId)
  let totalPrice = cart.totalPrice
  const total = `${Math.floor(cart.totalPrice * 0.01254)}`

  request.prefer("return=representation")
  request.requestBody({
    intent: "CAPTURE",
    purchase_units: [
      {
        amount: {
          currency_code: "USD",
          value: total,
          breakdown: {
            item_total: {
              currency_code: "USD",
              value: total,
            },
          },
        },
      },
    ],
  })

  try {
    const order = await paypalClient.execute(request)
    res.json({ id: order.result.id })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
});

router.get('/placeOrder/:id',varifyUser,async(req,res)=>{
    let userId = req.userId
    let cart = await allCartItems(userId)
    let user = await userFindOne(userId)
    let product = cart[0].cart
    let address = user.address[0]
    let method = req.params.id
    let cartItems = cart[0].cartItems
    let totalPrice = 0
    for(intex in cartItems){
      let price = cartItems[intex].price 
      let quantity = cart[0].cart[intex].quantity
      totalPrice += price * quantity
    }
    placeOrder(userId,product,totalPrice,address,method)
    .then(async data =>{
      let categories = await Category.find()
      let name = req.userName
      // res.render("user/checkoutSucces",{categories, name})
      res.json('success')
      emptyCart(userId).then((response)=>console.log(response,))
      .catch((err)=>console.log(err))
    })
    .catch(err =>console.log(err)) 
})

// router.get('/addAddressCheckout',varifyUser,async(req,res)=>{
//     let userId = req.userId
//     let name = req.userName
//     console.log(req)
//     res.render("user/addAddressCheckout",{name,Err:''})
// })

router.post("/addAddressCheckout",varifyUser,async(req,res)=>{
    let userId = req.userId
    let userName = req.userName
    let address = req.body.address
  console.log(address)
    //validation
    let invaliedAddress = (address.trim().length ==0 )

    if (invaliedAddress) {
      res.json({inputErr:"Enter valid address"})
    }else{
            addAddress(userId,address)
            .then(user=>{
              res.json({user:user})
            })
    }
})
router.get("/getaddress",varifyUser,async(req,res)=>{
  try {
    let userId = req.userId
    viewProfile(userId).then(data=>{
      res.json(data.address)
    }).catch(err=>res.json({err}) ) 
  } catch (error) {
   res.json({error:error}) 
  }
})
module.exports = router