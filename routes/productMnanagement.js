var express = require("express");
const Products = require("../model/product");
const { varifyAdmin } = require("./varify/varifyAdmin");
const fileUpload = require("express-fileupload");
const fs = require('fs');
// const { routes, path } = require("../app");
const { log } = require("console");

var router = express.Router();

router.use(
  fileUpload({
    createParentPath: true,
  })
);

router.get("/", varifyAdmin, function (req, res) {
  res.render("admin/productManagement",{ admin: req.admin });
});

router.get("/check",varifyAdmin, async (req, res) => {
  let data = await Products.find();
  res.json(data);
});

router.get("/check/:id",varifyAdmin, async (req, res) => {
  let name = req.params.id;
  let data = await Products.find({ name: { $regex: `^${name}` } });

  if (data.length === 0) {
    res.json([]);
  } else {
    res.json(data);
  }
});

router.get("/delete/:id",varifyAdmin, async (req, res) => {
  let name = req.params.id;
  console.log(name)
  let productDelete = await Products.findOneAndDelete({ name: req.params.id });
  console.log(productDelete);
  if (productDelete) {
    fs.unlink(`public/images/${productDelete._id}.jpg`,(err => {
  if (err) console.log(err);
  else {
    console.log("\nDeleted file: example_file.txt");
  }
}))
  }
  
  
  res.redirect("/admin/userManagement");
});

router.get("/addProduct",varifyAdmin, (req, res) => {
  res.render("admin/addProduct", {
    name: "",
    productExists:"",
    imageErr:''
  });
});

router.post("/addProduct", varifyAdmin, (req, res) => {
  let { body, files } = req;
  let productExists
   Products.findOne({name: body.name}).then((product) => {
    productExists = product
   })

  if (!files) {
     res.status(400).render("admin/addProduct", {
    name: body.name,
    productExists:"",
    imageErr:'No files were uploaded.'
  });
  }
  else if (productExists) {
     res.status(400).render("admin/addProduct", {
    name: req.body.name,
    productExists:"This product already exists",
    imageErr:''
  });
  }else{

  const file = files.image;
  const user = new Products({ ...body });
  user
    .save()
    // .then((respose) => console.log(respose))
    .catch((err) => console.log(err));

  file.mv(`public/images/${user._id}.jpg`, (err) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.redirect("/admin/productManagement")
  });
}
});

router.get('/editProduct/:id',varifyAdmin,async(req,res)=>{
  try {
    let product = await Products.findOne({_id:req.params.id})
     res.render("admin/productEdit",{name:product.name,price:product.price,category:product.category,_id:product._id})
     res.render("admin/productEdit",product)

  } catch (error) {
    res.send('error').status(500)
    console.log(error);
  }
})
router.post("/editProduct/:id", varifyAdmin,async (req, res) => {
  let { body, files } = req;
  try {
    console.log(req.params.id);
    // pro= await Products.findOneAndUpdate({_id:req.params.id},{"$set":{name:body.name,price:body.price,category:body.category}})
    pro= await Products.findOneAndUpdate({_id:req.params.id},{"$set":body})
    if (files) {
      const file = files.image;
      file.mv(`public/images/${pro._id}.jpg`, (err) => {
        if (err) {
          return res.status(500).send(err);
        }
        res.redirect("/admin/productManagement")
      });
    }else{
      res.redirect('/admin/productManagement')
    }
  } catch (err) {
    console.log(err);
    res.send('error').status(500)
  }

});

module.exports = router;
