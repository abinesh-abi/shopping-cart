var express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const Products = require("../model/product");
const Admin = require("../model/admin");
const User = require("../model/users");
const productRouter = require("./productMnanagement")
const categoryRouter = require("./category")
const {varifyAdmin} =require("./varify/varifyAdmin")

var router = express.Router();



router.use('/productManagement',productRouter)
router.use('/category',categoryRouter)

//admin
router.get("/", varifyAdmin, (req, res) => {
  res.render("admin/userManagement", { admin: req.admin });
});


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
  let admin = await Admin.findOne({ email: body.email });
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

router.get("/logout", (req, res) => {
  res.clearCookie("adminToken").status(200).redirect("login");
});

//user managemet
// router.get("/userManagement", varifyAdmin, async (req, res) => {
//   res.setHeader("cache-control", "private,no-cache,no-store,must-revalidate");
//   let dbUsers = await User.find();

//   res.render("admin/userManagement", {
//     admin: req.admin || "admin",
//     dbUsers,
//   });
// });
router.get("/userManagement", varifyAdmin, async (req, res) => {
  res.setHeader("cache-control", "private,no-cache,no-store,must-revalidate");
  res.render("admin/userManagement", {
    admin: req.admin
  })
});

router.get("/check",varifyAdmin, async (req, res) => {
  let data = await User.find();
  res.json(data);
});

router.get("/check/:id",varifyAdmin, async (req, res) => {
  let email = req.params.id;
  let data = await User.find({ email: { $regex: `^${email}` } });

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

router.post("/create",varifyAdmin, async (req, res) => {
  let { body } = req;

  let dbUser = User.findOne({ email: body.email }).then(async (user) => {
    if (user) {
      res.render("admin/createUser", {
        name: body.name,
        emailErr: "this email is already in use",
        email: user.email,
      });
    } else {
      let hashedPassword = bcrypt.hashSync(body.password, 10);
      let { name, email } = body;
      // await User.insertOne({name,email,password:hashedPassword});
      let insertedUser = await new User({
        name,
        email,
        password: hashedPassword,
      }).save();
      res.redirect("/admin/userManagement");
    }
  });
});
router.get("/delete/:id",varifyAdmin, async (req, res) => {
  let mail = req.params.id;
  let userDelete = await User.findOneAndDelete({ email: req.params.id });
  res.redirect("/admin/userManagement");
});

router.get("/edit/:id",varifyAdmin,(req, res) => {
  let id = req.params.id;
  User.findOne({ _id: id }).then((user) => {
    // user._id = user._id.toString();
    console.log(user);
    res.render("admin/useredit", { emailErr: "",_id: user._id,name:user.name,email:user.email });
  });
});

router.post("/edit/:id",varifyAdmin, async(req, res) => {
  let { body } = req;
  let id = req.params.id;
    let userExists = await User.findOne({ _id:{$ne:id},email:body.email })
    .then(async user=>{
    if (user) {
    res.render("admin/useredit", { emailErr: "user aready exist", ...body,_id:id });
    }else {
      await User.findOneAndUpdate({ _id: id }, { $set: body });
      res.redirect("/admin/userManagement");
    }
    })

});
// router.get("/hi", (req, res) => {
//   let admin = new Admin({name:"abi", email: "abi@gmail.com", password: 1234 })
//     .save()
//     .then((data) => console.log(data));
// });

module.exports = router;
