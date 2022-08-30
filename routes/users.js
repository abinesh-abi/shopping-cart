var express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

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
    emailErr: "",
    email: "",
  });
});
router.post("/signup", async (req, res) => {
  res.setHeader("cache-control", "private,no-cache,no-store,must-revalidate");
  let { body } = req;
  let user = await User.findOne({ email: body.email });
  console.log(user);
  if (user) {
    res.render("user/signup", {
      name: body.name,
      emailErr: "you already have account",
      email: user.email,
    });
  } else {
    body.password = bcrypt.hashSync(body.password, 10);
    let { name, email } = body;
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
  }
});

//login user
router.get("/login", (req, res) => {
  res.setHeader("cache-control", "private,no-cache,no-store,must-revalidate");
  res.render("user/login", { emaillErr: "", passwordErr: "", email: "" });
});

router.post("/login", async (req, res) => {
  res.setHeader("cache-control", "private,no-cache,no-store,must-revalidate");
  let { body } = req;
  let dbUser = await User.findOne({ email: body.email });
  if (dbUser) {
    let passwordMatch = bcrypt.compareSync(body.password, dbUser.password);
    console.log(passwordMatch);
    if (body.email === dbUser.email && passwordMatch) {
      const token = jwt.sign(
        {
          id: dbUser.id,
          name:dbUser.name
        },
        process.env.JWT_USER_SECRET,
        { expiresIn: "3d" },
        {
          httpOnly: true,
        }
      );
      res.cookie("token", token).redirect("/");
    } else if (body.password != dbUser.password) {
      res.render("user/login", {
        emaillErr: "",
        passwordErr: "invalied password",
        email: body.email,
      });
    }
  } else {
    res.render("user/login", {
      emaillErr: "you don't have account",
      passwordErr: "",
      email: body.email,
    });
  }
});

router.get('/logout', (req, res) => {
  res.clearCookie('token')
  .status(200)
  .redirect("/")

});

module.exports = router;
