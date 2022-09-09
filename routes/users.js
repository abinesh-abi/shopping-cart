var express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const client = require('twilio')(process.env.accountSid, process.env.authToken)

// const authRouter = require("./authUser")
const viewRouter = require("./userProduct")
const profileRouter = require("./userProfile")
const Products = require("../model/product")
const User = require("../model/users");
const { request } = require("express");
const { categoryViceView } = require("../helpers/userHelper");
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

router.use((req,res,next)=>{
  res.setHeader("cache-control", "private,no-cache,no-store,must-revalidate");
  next();
})
//routers
router.use('/product',viewRouter)
router.use('/profile',profileRouter)
// router.use('/auth',authRouter)

//products list

router.get("/", async function (req, res, next) {
  let categories = await categoryViceView()
    console.log(categories)
  let products = await Products.find()
  if (req.cookies.token) {
  let {name,id} =  jwt.verify(req.cookies.token, process.env.JWT_USER_SECRET)
    res.render("user/userHome", { name:name,id,categories});
  }else{
  res.render("user/userHome", { name: "",id:'',categories});
  }
});

//signup user
router.get("/signup", (req, res) => {
  res.setHeader("cache-control", "private,no-cache,no-store,must-revalidate");
  res.render("user/signup", {
    name: "",
    email:"",
    errMsg: "",
    number:'',
  });
});


router.post("/signup", async (req, res) => {
  res.setHeader("cache-control", "private,no-cache,no-store,must-revalidate");
  let { body } = req;
  let user = await User.findOne({$or:[ {number: body.number},{email:body.email} ]});

  ///for validation start
  let regex = new RegExp('[a-z0-9]+@[a-z]+\.[a-z]{2,3}');
  var invaliedName = (body.name.trim().length ==0 || !body.name.match(/^[a-zA-Z\-]/) || !body.name.match(/[a-zA-Z\-]$/))
  let invaliedEmail = !regex.test(body.email)
  let invaliedPassword = (body.password.trim().length ==0 )
  //validation end

  if (invaliedName) {
    res.render("user/signup", {
      name: body.name,
      email: body.email,
      errMsg: "Invalied Name",
      otpErr: "",
      number:body.number,
    });
  }else if (invaliedEmail) {
    res.render("user/signup", {
      name: body.name,
      email: body.email,
      errMsg: "Invalied Email",
      otpErr: "",
      number:body.number,
    });
  }else if(invaliedPassword){
    res.render("user/signup", {
      name: body.name,
      email: body.email,
      errMsg: "Invalied password",
      otpErr: "",
      number:body.number,
    });
  }
  else if (user) {
    res.render("user/signup", {
      name: body.name,
      email: body.email,
      errMsg: "you already have account",
      otpErr: "",
      number:body.number,
    });
  } else {
    body.password = bcrypt.hashSync(body.password, 10);
    let { name, number } = body;
    console.log(req.body)

    // for testing purposes
    // res.render("user/signup", {
    //   name: body.name,
    //   email: body.email,
    //   errMsg: "that ok",
    //   otpErr: "",
    //   number:body.number,
    // });

    //   res.render("user/otpSignup", {
    //   name: body.name,
    //   email:body.email,
    //   number:body.number,
    //   password:body.password,
    //   otpErr: "",
    // });

    // // otp-start
    client.verify.services(process.env.serviceId)
      .verifications
      .create({
        to:`+91${body.number}`,
        channel:"sms"
      })
      .then(data=>{
        console.log(data);
      res.render("user/otpSignup", {
      name: body.name,
      email:body.email,
      number:body.number,
      password:body.password,
      otpErr: "",
    });
      }).catch(error=>{
        res.send('error')
      })
      //otp-end
    
  }
});

router.post("/signup/otp", async (req, res) => {
 let {body} =req
 console.log(body)

 //otp-start
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
      res.status(401).render("user/otpSignup", {
      name: body.name,
      email:body.email,
      number:body.number,
      password:body.password,
      otpErr: "Invalied OTP",
    });
      
      console.log(error)
    })
    // otp-end
})

//login user
router.get("/login", (req, res) => {
  res.setHeader("cache-control", "private,no-cache,no-store,must-revalidate");
  res.render("user/login", {  passwordErr: "", email: "",emailErr:'' });
});


router.post('/loginNumber', async(req, res) => {
  let { body}=  req
   let dbUser = await User.findOne({ email: body.email });
  if (dbUser) {
    let passwordMatch = bcrypt.compareSync(req.body.password, dbUser.password)
    if (dbUser.blockOrNot) {
      res.render("user/login", {
        passwordErr: "",
        emailErr: "You are banned to login",
        email: body.email,
      });
    }
    else if (body.email === dbUser.email && passwordMatch) {
      const token = jwt.sign(
        {
          id: dbUser._id,
          name:dbUser.name
        },
        process.env.JWT_USER_SECRET,
        { expiresIn: "3d" },
        {
          httpOnly: true,
        }
      )
      res.cookie("token", token).redirect("/");
    } else if (body.password != dbUser.password) {
      res.render("user/login", {
        passwordErr: "invalied password",
        emailErr: "",
        email: body.email,
      });
    }
  } else {
    res.render("user/login", {
      emailErr: "you don't have account",
      passwordErr: "",
      email: body.email,
    });
  }
 
  
})

router.get('/loginOtp',(req,res)=>{
  res.setHeader("cache-control", "private,no-cache,no-store,must-revalidate");
  res.render("user/otpLogin",{numErr:''})
})


router.post("/loginOtp", async (req, res) => {
  res.setHeader("cache-control", "private,no-cache,no-store,must-revalidate");
  let { body } = req;
  console.log(body);
  let dbUser = await User.findOne({ number: body.number });

      if (dbUser.blockOrNot) {
      res.render("user/otpLogin",{numErr:'You are banned to login'})
    }
    else if (dbUser) {

    client.verify.services(process.env.serviceId)
      .verifications
      .create({
        to:`+91${body.number}`,
        channel:"sms"
      })
      .then(data=>{
        console.log(data);

      res.render("user/otpLoginVarify",{
        _id:dbUser._id,
        name:dbUser.name,
        number:dbUser.number,
        otpErr:''
      })

      }).catch(error=>{
        
        res.render("user/otpLogin",{numErr:"Error to send otp"})

      })

  } else {
  res.render("user/otpLogin",{numErr:"You dont have account"})
  }
});

router.post("/loginOtpVarify", async (req, res) => {
 let {body} =req

 console.log(body);

     client.verify
    .services(process.env.serviceId)
    .verificationChecks
    .create({
        to:`+91${body.number}`,
        code:body.otp
    }).then(data=>{
      console.log(data);
      if (!data.valid) {
      res.render("user/otpLoginVarify",{
        _id:body._id,
        name:body.name,
        number:body.number,
        otpErr:'Invalied Otp'
      })
      }
      const token = jwt.sign(
        {
          id: body._id,
          name:body.name
        },
        process.env.JWT_USER_SECRET,
        { expiresIn: "3d" },
        {
          httpOnly: true,
        }
      );
      res.cookie("token", token).redirect("/");
        
    }).catch((error) => {
      res.render("user/otpLoginVarify",{
        _id:body._id,
        name:body.name,
        number:body.number,
        otpErr:''
      })
      console.log(err)
    })

})


router.get('/logout', (req, res) => {
  res.clearCookie('token')
  .status(200)
  .redirect("/")

});

module.exports = router;
