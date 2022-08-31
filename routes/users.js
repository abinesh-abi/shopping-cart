var express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const client = require('twilio')(process.env.accountSid, process.env.authToken)

const viewRouter = require("./userProduct")
const Products = require("../model/product")
const User = require("../model/users");
const { request } = require("express");
var router = express.Router();


//varify jwt token
function varifyToken(req,res, next) {
    const token = req.cookies.token;
    console.log(token);
  if (!token) {
    res.redirect('/login');
  }
  try {
    const data = jwt.verify(token, process.env.JWT_USER_SECRET)
    console.log(data,'data')
    req.userId = data.id;
    req.user =data.name
    
    return next();
  } catch (err) {
    console.log(err);
    return res.sendStatus(403);
  }
}

router.use('/product',viewRouter)
/* GET users listing. */
router.get("/", async function (req, res, next) {
  let products = await Products.find()
  console.log(products);

  if (req.cookies.token) {
  let {name} =  jwt.verify((req.cookies.token||'nothing'), process.env.JWT_USER_SECRET)
    res.render("user/userHome", { name:name,products});
  }else{
  res.render("user/userHome", { name: "",products});
  }
});

//signup user
router.get("/signup", (req, res) => {
  res.setHeader("cache-control", "private,no-cache,no-store,must-revalidate");
  res.render("user/signup", {
    name: "",
    numErr: "",
    otpErr: "",
    number:'',
    hidden:false
  });
});
router.post("/signup", async (req, res) => {
  res.setHeader("cache-control", "private,no-cache,no-store,must-revalidate");
  let { body } = req;
  let user = await User.findOne({ number: body.number });
  if (user) {
    res.render("user/signup", {
      name: body.name,
      numErr: "you already have account",
      otpErr: "",
      number:body.number,
      hidden:false
    });
  } else {
    // body.password = bcrypt.hashSync(body.password, 10);
    let { name, number } = body;

    client.verify.services(process.env.serviceId)
      .verifications
      .create({
        to:`+91${number}`,
        channel:"sms"
      })
      .then(data=>{
        console.log(data);
      res.render("user/signup", {
      name: body.name,
      numErr: "",
      otpErr: "",
      number:body.number,
      hidden:false
    });
      }).catch(error=>{
        res.send('error')
      })
    
  }
});


router.post("/otp", async (req, res) => {
 let {body} =req

 console.log(body);
     client.verify
    .services(process.env.serviceId)
    .verificationChecks
    .create({
        to:`+91${body.number}`,
        code:body.otp
    }).then(data=>{
    new User({ ...body }).save().then((user) => {
      console.log(user);
      const token = jwt.sign(
        {
          id: user.id,
          name:user.name
        },
        process.env.JWT_USER_SECRET,
        { expiresIn: "3d" },
        {
          httpOnly: true,
        }
      );
      res.cookie("token", token).redirect("/");
    });
        
    }).catch((error) => {console.log("Error")})
})

//login user
router.get("/login", (req, res) => {
  res.setHeader("cache-control", "private,no-cache,no-store,must-revalidate");
  res.render("user/login", { numErr: "", otpErr: "", email: "",hidden:false,number:'' });
});

router.post("/login", async (req, res) => {
  res.setHeader("cache-control", "private,no-cache,no-store,must-revalidate");
  let { body } = req;
  console.log(body);
  let dbUser = await User.findOne({ number: body.number });
  if (dbUser) {

    client.verify.services(process.env.serviceId)
      .verifications
      .create({
        to:`+91${body.number}`,
        channel:"sms"
      })
      .then(data=>{
        console.log(data);
      res.render("user/login", {
      name: body.name,
      numErr: "",
      otpErr: "",
      number:body.number,
      hidden:false
    });
      }).catch(error=>{
        
      res.render("user/login", {
      name: body.name,
      numErr: "",
      otpErr: "Invalied OTP",
      number:body.number,
      hidden:false
    });

      })



  } else {
    res.render("user/login", {
      numErr: "you don't have account",
      otpErr: "",
      number:''
    });
  }
});

router.post("/login/otp", async (req, res) => {
 let {body} =req

 console.log(body);

     client.verify
    .services(process.env.serviceId)
    .verificationChecks
    .create({
        to:`+91${body.number}`,
        code:body.otp
    }).then(data=>{
    User.findOne({number: body.number}).then(user =>{
      console.log(user);
      const token = jwt.sign(
        {
          id: user._id,
          name:user.name
        },
        process.env.JWT_USER_SECRET,
        { expiresIn: "3d" },
        {
          httpOnly: true,
        }
      );
      res.cookie("token", token).redirect("/");
    });
        
    }).catch((error) => {
      res.send('error')
      console.log(err)
    })

})


router.get('/logout', (req, res) => {
  res.clearCookie('token')
  .status(200)
  .redirect("/")

});

module.exports = router;
