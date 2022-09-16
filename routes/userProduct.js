const express = require('express'); 
const { productExistsInCart, addToCart, allCartItems, removeFromCart, incrementProduct, decrementProduct, placeOrder, getCart } = require('../helpers/cartHelper');
const Razorpay = require('razorpay'); 

const { viewProfile, addAddress } = require('../helpers/profileHelper');
const { userFindOne } = require('../helpers/userHelper');
const Cart = require('../model/cart');
const Category = require('../model/category');
const Orders = require('../model/orders');
const Products = require('../model/product');
const { userLogged } = require('./varify/userLogged');
const { varifyUser } = require("./varify/varifyUser");


//paypal
// const paypal = require('paypal-rest-sdk');
const paypal = require("@paypal/checkout-server-sdk")
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
// // Pypal configaration
// paypal.configure({
//   'mode': 'sandbox', //sandbox or live
//   'client_id':process.env.PAYPAL_CLIENT_ID,
//   'client_secret':process.env.PAYPAL_SECRET
// });

const router = express.Router()

router.get('/view/:id',userLogged, async(req, res) => {
   let name = req.userName
   let id = req.userId
  let categories = await Category.find()
    let product= await Products.findOne({_id:req.params.id})
    res.render("user/viewProduct" ,{name,id,product,categories})
    // res.status(200).json(product)
    console.log(product._id);

 })
 router.get('/categoryView/:category',varifyUser,async(req, res) => {
  let category = req.params.category
  let name = req.userName
  let categories = await Category.find()
  Products.find({category}).then(product =>{
    res.render("user/categoryView",{name,product:product,category,categories})
  })
 })

 router.get('/cart',varifyUser,async(req,res)=>{
  let categories = await Category.find()
   let name = req.userName
  let id = req.userId
  let userId = await req.userId
  console.log(name,id)
   let val = await allCartItems(userId)

   if(val.length ===0){
   res.render("user/cart",{name,id,cart:[],qty:'',totalPrice:'',categories})
   }
  else {
   let cart = val[0].cartItems
   let qty = val[0].cart

  // find tota Price 
   let totalPrice = 0
   for (const val in cart) {
    let price = cart[val].price
    let totalQuantity = qty[val].quantity
    totalPrice += price * totalQuantity
   }

   res.render("user/cart",{name,id,cart,qty,totalPrice,categories})
  }
 })

 router.get('/cartJson',varifyUser,async(req,res) => {
  let userId = req.userId
  getCart(userId).then(cart   => res.json(cart))
 });

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
  let categories = await Category.find()
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
    res.render('user/checkout',{name,totalPrice,user,categories})
  })


//for razorpay
var instance = new Razorpay({ 
  key_id:process.env.RAZORPAY_KEE_ID ,
  key_secret:process.env.RAZORPAY_SECRET 
   })
  
  router.post("/checkout",varifyUser,async(req,res) => {
  let categories = await Category.find()
    let name = req.userName
    let userId = req.userId
    let { totalPrice , address} = req.body
    console.log(totalPrice,address)

    if (req.body.payMethod=='paypal') {
      res.render('user/paypal',{
        name,
        categories,
          totalPrice,
          address,
           paypalClientId:process.env.PAYPAL_CLIENT_ID
      })

    } else if (req.body.payMethod=='razorpay') {
        res.render('user/razorpay',{
          name,
          categories,
          totalPrice,
          address
        })


      // let currency = 'INR'
    // instance.orders.create({amount : totalPrice, currency}, 
    //     (err, order)=>{
    //       if(!err){
    //         console.log(order)
            // res.render('user/razorpay',{
            //   name,
            //   categories,
              //  amount:order.amount,
              //  orderId:order.id
            // })
        //   }else
        //     console.log(err)
        // }
    // )
    } else if (req.body.payMethod=='cod') {
    // let user = await userFindOne(userId)
    let cart = await getCart(userId)
    let product = cart.cart
    let method  = 'cod'
    placeOrder(userId,product,totalPrice,address,method)
    .then(data =>{
      res.render("user/checkoutSucces",{name,categories})
    })
    .catch(err =>console.log(err)) 
    }

  })
  // razorpay create order
  router.post('/razorpayCreateOreder',varifyUser,async(req,res)=>{
    const {amount,currency,receipt, notes}  = req.body;      

    instance.orders.create({amount, currency}, 
        (err, order)=>{
          //STEP 3 & 4: 
          if(!err){
            res.json({
              amount:order.amount*100,
              orderId:order.id,
            })
          }else
            console.log(err)
        }
    )

   // find all orders 
    // instance.orders.all({},
    //   (err, order)=>{
    //       //STEP 3 & 4: 
    //       if(!err)
    //         console.log(order)
    //       else
    //         console.log(err)
    //     })
  })
  // varify order
  router.post('/razorpayVarify',varifyUser, async(req,res)=>{
    let body = req.body
    console.log(req.body,'body=========')

    console.log(body.razorpay_payment_id,'order--------------------------')
    console.log(body['razorpay_payment_id'],'payment++++++++++++++++++++')


    const crypto = require('crypto') 
    let hmac = crypto.createHmac('sha256',process.env.RAZORPAY_SECRET );
    hmac.update(body['razorpay_order_id'] + "|" + body['razorpay_payment_id']);
    hmac = hmac.digest('hex')
    if (hmac==body['razorpay_signature']) {
      res.json({status:true})
      console.log('paument success')

    let { totalPrice , address} = req.body
      let userId = req.userId
    let cart = await getCart(userId)
    let product = cart.cart
    let method  = 'razorpay'
    console.log({
      userId,product,totalPrice,address,method
    })
    placeOrder(userId,product,totalPrice,address,method)
    .then(data =>{
      // res.render("user/checkoutSucces",{name,categories})
      console.log(data)
    })
    .catch(err =>console.log(err)) 
    }else{
      console.log(' payment error')
      res.json({status:false})
    }
})



const storeItems = new Map([
  [1, { price: 100, name: "Learn React Today" }],
  [2, { price: 200, name: "Learn CSS Today" }],
])
router.post("/paypal/createOrder", async (req, res) => {
  console.log('orderPage++++++++++')
   const request = new paypal.orders.OrdersCreateRequest()
  // const total = req.body.items.reduce((sum, item) => {
  //   return sum + storeItems.get(item.id).price * item.quantity
  // }, 0)
  const total = '2'
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
        // items: req.body.items.map(item => {
        //   const storeItem = storeItems.get(item.id)
        //   return {
        //     name: storeItem.name,
        //     unit_amount: {
        //       currency_code: "USD",
        //       value: storeItem.price,
        //     },
        //     quantity: item.quantity,
        //   }
        // }),
        // items: {
        //     name: "phone",
        //     unit_amount: {
        //       currency_code: "USD",
        //       value: 2,
        //     },
        //     quantity: 2,
        //   }
      },
    ],
  })

  try {
    const order = await paypalClient.execute(request)
    console.log(order)
    res.json({ id: order.result.id })
  } catch (e) {
    res.status(500).json({ error: e.message })
    console.log(e.message)
  }
});

// router.post("/paypal/createOrder", (req, res) => {
//   const create_payment_json = {
//     "intent": "sale",
//     "payer": {
//         "payment_method": "paypal"
//     },
//     "redirect_urls": {
//         "return_url": "http://localhost:3000/success",
//         "cancel_url": "http://localhost:3000/cancel"
//     },
//     "transactions": [{
//         "item_list": {
//             "items": [{
//                 "name": "Red Sox Hat",
//                 "sku": "001",
//                 "price": "2.00",
//                 "currency": "USD",
//                 "quantity": 1
//             }]
//         },
//         "amount": {
//             "currency": "USD",
//             "total": "2.00"
//         },
//         "description": "Hat for the best team ever"
//     }]
// };
 
// paypal.payment.create(create_payment_json, function (error, payment) {
//   if (error) {
//       throw error;
//   } else {
//       for(let i = 0;i < payment.links.length;i++){
//         if(payment.links[i].rel === 'approval_url'){
//           res.redirect(payment.links[i].href);
//         }
//       }
//   }
// });
 
// });

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