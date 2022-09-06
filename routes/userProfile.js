var express = require("express");
const { viewProfile, editProfile, viewProfileByIdAndEmail } = require("../helpers/profileHelper");
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

module.exports = router