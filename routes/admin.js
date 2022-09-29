var express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const Products = require("../model/product");
const Admin = require("../model/admin");
const User = require("../model/users");
const dashboardRouter = require("./dashboardManagement")
const productRouter = require("./productMnanagement")
const categoryRouter = require("./category")
const orderRouter = require("./orderManagement")
const {varifyAdmin} =require("./varify/varifyAdmin")
const couponRouter = require("./couponManagement");
const { getAdminByEmail } = require("../service/adminService");
const { getAllUser, findUser, getUserByEmail, userFindOne, userBanOrUnban } = require("../service/userService");

var router = express.Router();



router.use('/productManagement',productRouter)
router.use('/category',categoryRouter)
router.use('/orders',orderRouter)
router.use('/dashboard',varifyAdmin,dashboardRouter)
router.use('/coupon',varifyAdmin,couponRouter)
//admin
router.get("/", varifyAdmin, (req, res) => {
  res.render("admin/dashboard", { admin: req.admin });
});

  let admin ={
    name : 'abi',
    email:"abi@gmail.com",
    password :'1234'
  }

//Admin login
router.get("/login", (req, res) => {
  res.setHeader("cache-control", "private,no-cache,no-store,must-revalidate");
  res.render("adminlogin/adminlogin", {
    emailErr: "",
    passwordErr: "",
    email: "",
  });
});
router.post("/login", async (req, res) => {
  res.setHeader("cache-control", "private,no-cache,no-store,must-revalidate");
  let { body } = req;
  // let admin = await getAdminByEmail(body.email)
  if (!admin) {
    res.render("adminlogin/adminlogin", {
      emailErr: "Mail Mismatch",
      passwordErr: "",
      email: body.email,
    });
  } else {
    if (body.email === admin.email && body.password == admin.password) {
      const token = jwt.sign(
        {
          id: admin.id,
          name: admin.name,
        },
        process.env.JWT_USER_SECRET,
        { expiresIn: "3d" },
        {
          httpOnly: true,
        }
      );
      res.cookie("adminToken", token).redirect("/admin")
    } else if (body.password != admin.password) {
      console.log("invalied password");
      res.render("adminlogin/adminlogin", {
        emailErr: "",
        passwordErr: "Incorrect password",
        email: body.email,
      });
    }
  }
});

/// logout
router.get("/logout", (req, res) => {
  res.clearCookie("adminToken").status(200).redirect("login");
});

router.get("/userManagement", varifyAdmin, async (req, res) => {
  res.setHeader("cache-control", "private,no-cache,no-store,must-revalidate");
  res.render("admin/userManagement2", {
    admin: req.admin
  })
});

router.get("/check",varifyAdmin, async (req, res) => {
  let data = await getAllUser()
  res.json(data);
});

router.get("/check/:id",varifyAdmin, async (req, res) => {
  let name = req.params.id;
  let data = await findUser(name)

  if (data.length === 0) {
    res.json([]);
  } else {
    res.json(data);
  }
});

router.get("/create",varifyAdmin, (req, res) => {
  res.render("admin/createUser", {
    name: "",
    emailErr: "",
    email: "",
  });
});

// delete user
router.get("/delete/:id",varifyAdmin, async (req, res) => {
  let _id = req.params.id;
  let userDelete = await User.findOneAndDelete({ _id});
  res.redirect("/admin/userManagement");
});

router.get("/banOrNot/:id",async(req,res)=>{
  let id = req.params.id;
  let user = await userFindOne(id)
  if (user.blockOrNot) {
    let data = userBanOrUnban(id,false)
    res.send(data)
  }else{
    let data = userBanOrUnban(id,true)
    res.send(data);

  }
  
})


module.exports = router;
