var express = require("express");
const { viewOrdersByUserId, removeOrder } = require("../helpers/orderHelper");
const { viewProfile, editProfile, viewProfileByIdAndEmail, addAddress, editAddress, deleteAddress } = require("../helpers/profileHelper");
const { varifyUser } = require("./varify/varifyUser");
var router = express.Router();

router.get("/view",varifyUser,async(req,res)=>{
    let userId = req.userId
    let name = req.userName
    console.log(userId)
    let user = await viewProfile(userId)
    res.render('user/profile',{name,id:userId,user})
})

router.get("/getValues",varifyUser,async(req,res)=>{
    let userId = req.userId
    let name = req.userName
    console.log(userId)
    let user = await viewProfile(userId)
    res.json(user)
})

router.get('/edit',varifyUser,async(req,res)=>{
    let userId = req.userId
    let user = await viewProfile(userId)
    res.render("user/editProfile",{user,Err:''})
})
router.post('/edit',varifyUser,async(req,res)=>{
    let userId = req.userId
    let dbUser = await viewProfile(userId)
    let {body} = req
  ///for validation start
  let regex = new RegExp('[a-z0-9]+@[a-z]+\.[a-z]{2,3}');
  var invaliedName = (body.name.trim().length ==0 || !body.name.match(/^[a-zA-Z\-]/) || !body.name.match(/[a-zA-Z\-]$/))
  let invaliedEmail = !regex.test(body.email)
  //validation end
    if (invaliedName) {
        res.render("user/editProfile",{user,Err:'Invalied name'})
    }else if (invaliedEmail) {
        res.render("user/editProfile",{user,Err:'Invalied Email'})
    }else{
        try {
            editProfile(userId,body).then(data=>{
                res.redirect('/profile/view')
            })
        } catch (error) {
            res.json("error").status(500)
        }
    }
})

router.get('/addAddress',varifyUser,async(req,res)=>{
    let userId = req.userId
    let name = req.userName
    console.log(req)
    res.render("user/addAddress",{name,Err:''})
})

router.post("/addAddress",varifyUser,async(req,res)=>{
    let userId = req.userId
    let userName = req.userName
    let address = req.body.address

    //validation
    let invaliedAddress = (address.trim().length ==0 )

    if (invaliedAddress) {
        res.render("user/addAddress",{name:userName,Err:'This feild cannot be empty'})
    }else{
            addAddress(userId,address)
            .then(user=>{
                res.redirect("/profile/view")
            })
    }
})
router.get('/editAddress/:num',varifyUser,async(req,res)=>{
    let num = req.params.num
    let userId = req.userId
    let userName = req.userName
    let user = await viewProfile(userId)
    console.log(num)
        
    
    let address = user.address[num]
    res.render("user/editAddress",{name:userName,num,address,Err:""})
})
router.post("/editAddress/:num",varifyUser,async(req,res)=>{
    let userId = req.userId
    let num = req.params.num

    // let user = await viewProfile(userId)
    // let oldAddress = user.address[0][`${addr}`]
    let newAddress = req.body.address

    try {
    editAddress(userId,newAddress,num)
    .then(data=>{
        res.redirect('/profile/view')
    }).catch(err=>{
        console.log(err)
    })
    } catch (error) {
        console.log(error)    
    }
})
router.get("/deleteAddress/:num",varifyUser,(req, res)=>{
    let userId = req.userId
    let index = req.params.num
    deleteAddress(userId, index).then(data=>{
        res.json(data)
    })

})
router.get('/viwOrders',varifyUser,(req, res)=>{
    let name = req.userName
    let userId = req.userId
    viewOrdersByUserId(userId)
    .then(data=>{ 
        // res.json(data)
        res.render("user/viewOrders",{name,data})
    })
    .catch(error=>{console.log(error)
    })
})
router.get('/cancelOrder',varifyUser,(req, res)=>{
    console.log(req.query)
    let {orderId ,productId} = req.query
    removeOrder(orderId,productId)
    .then(data=>res.redirect("/profile/viwOrders"))
    .catch(err=>console.log(err))
})
module.exports = router