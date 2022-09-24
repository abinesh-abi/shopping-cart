var express = require("express");
const Products = require("../model/product");
const { varifyAdmin } = require("./varify/varifyAdmin");
const fileUpload = require("express-fileupload");
const fs = require('fs');
// const { routes, path } = require("../app");
const { log } = require("console");
const Category = require("../model/category");

var router = express.Router();

router.use(
  fileUpload({
    createParentPath: true,
  })
);

router.get("/", varifyAdmin, function (req, res) {
  res.render("admin/productManagement2",{ admin: req.admin });
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
    fs.unlink(`public/images/${productDelete._id}_one.jpg`,(err => {
  if (err) console.log(err);
  else {
    console.log("\nDeleted file: example_file.txt");
  }
}))
    fs.unlink(`public/images/${productDelete._id}_two.jpg`,(err => {
  if (err) console.log(err);
  else {
    console.log("\nDeleted file: example_file.txt");
  }
}))

  }
  
  
  res.redirect("/admin/userManagement");
});

router.get("/addProduct",varifyAdmin,  async(req, res) => {
  let val = await Category.aggregate([{$group:{_id:'array','categories':{$push:"$name"}}}])
  let categories = val[0].categories
  res.render("admin/addProduct", {
    name: "",
    categories,
    Err:''
  });
});

router.post("/addProduct", varifyAdmin, async(req, res) => {
  let { body, files } = req;

  let val = await Category.aggregate([{$group:{_id:'array','categories':{$push:"$name"}}}])
  let categories = val[0].categories
  let productExists = await Products.findOne({name: body.name})

   //for validation purposes
  var invaliedName = (body.name.trim().length ==0 || !body.name.match(/^[a-zA-Z\-]/) )
  var invaliedSpec = (body.name.trim().length ==0 || !body.name.match(/^[a-zA-Z\-]/) )
  var invaliedPrice = (body.name.trim().length ==0  )

  if (!files) {
     res.status(400).render("admin/addProduct", {
    name: body.name,
    categories,
    Err:'No files were uploaded.'
  });
  }
  else if (productExists) {
     res.status(400).render("admin/addProduct", {
    name: req.body.name,
    categories,
    Err:'This product already exists'
  });
  } else if(invaliedName){
     res.status(400).render("admin/addProduct", {
    name: req.body.name,
    categories,
    Err:'Enter valied name'
  });
  } else if (invaliedSpec){
     res.status(400).render("admin/addProduct", {
    name: req.body.name,
    categories,
    Err:'Enter Specification'
  });
  }else if (invaliedPrice){
     res.status(400).render("admin/addProduct", {
    name: req.body.name,
    categories,
    Err:'Enter Price'
  });
  }
  else{
    console.log(body,'hello-----------')
  // const file = files.image;
  const user = new Products({ ...body });
   user
    .save()
    .then((user) =>{
      let {one, two, three}= files
      one.mv(`public/images/${user._id}.jpg`, (err) => {
        if (err) {
          return res.status(500).send(err);
        }
      });


      // two.mv(`public/images/${user._id}_one.jpg`, (err) => {
      //   if (err) {
      //     return res.status(500).send(err);
      //   }
      // });
      // three.mv(`public/images/${user._id}_two.jpg`, (err) => {
      //   if (err) {
      //     return res.status(500).send(err);
      //   }
      // });
    res.redirect("/admin/productManagement")
    })
    .catch((err) =>{
     console.log(err) 
     res.status(400).render("admin/addProduct", {
    name: req.body.name,
    categories,
    Err:'All feilds are required'
  });
    });
}
});

// router.post("/addProduct", varifyAdmin, async(req, res) => {
//   let { body } = req;

//   let val = await Category.aggregate([{$group:{_id:'array','categories':{$push:"$name"}}}])
//   let categories = val[0].categories
//   let productExists = await Products.findOne({name: body.name})

//    //for validation purposes
//   var invaliedName = (body.name.trim().length ==0 || !body.name.match(/^[a-zA-Z\-]/) )
//   var invaliedSpec = (body.name.trim().length ==0 || !body.name.match(/^[a-zA-Z\-]/) )
//   var invaliedPrice = (body.name.trim().length ==0  )

//   // if (!files) {
//   //    res.status(400).render("admin/addProduct", {
//   //   name: body.name,
//   //   categories,
//   //   Err:'No files were uploaded.'
//   // });
//   // }
//   // else if (productExists) {
//   //    res.status(400).render("admin/addProduct", {
//   //   name: req.body.name,
//   //   categories,
//   //   Err:'This product already exists'
//   // });
//   // } else if(invaliedName){
//   //    res.status(400).render("admin/addProduct", {
//   //   name: req.body.name,
//   //   categories,
//   //   Err:'Enter valied name'
//   // });
//   // } else if (invaliedSpec){
//   //    res.status(400).render("admin/addProduct", {
//   //   name: req.body.name,
//   //   categories,
//   //   Err:'Enter Specification'
//   // });
//   // }else if (invaliedPrice){
//   //    res.status(400).render("admin/addProduct", {
//   //   name: req.body.name,
//   //   categories,
//   //   Err:'Enter Price'
//   // });
//   // }
//   // else{

//   // const file = files.image;
//   const user = new Products({ ...body });
//    user
//     .save()
//     .then((user) =>{
//       let {one, two, three}= body
//       console.log(one)
//       one.mv(`public/images/${user._id}.jpg`, (err) => {
//         if (err) {
//           return res.status(500).send(err);
//         }
//       });
//       two.mv(`public/images/${user._id}_one.jpg`, (err) => {
//         if (err) {
//           return res.status(500).send(err);
//         }
//       });
//       three.mv(`public/images/${user._id}_two.jpg`, (err) => {
//         if (err) {
//           return res.status(500).send(err);
//         }
//       });
//     res.redirect("/admin/productManagement")
//     })
//     .catch((err) =>{
//      res.status(400).render("admin/addProduct", {
//     name: req.body.name,
//     categories,
//     Err:'All feilds are required'
//   });
//     });
// // }
// });

router.get('/editProduct/:id',varifyAdmin,async(req,res)=>{
  try {
    let product = await Products.findOne({_id:req.params.id})
    let val = await Category.aggregate([{$group:{_id:'array','categories':{$push:"$name"}}}])
    let categories = val[0].categories
    //  res.render("admin/productEdit",{name:product.name,price:product.price,category:product.category,_id:product._id})
     res.render("admin/productEdit",{product,categories})

  } catch (error) {
    res.send('error').status(500)
    console.log(error);
  }
})
// router.post("/editProduct/:id", varifyAdmin,async (req, res) => {
//   let { body, files } = req;
//   try {
//     console.log(req.params.id);
//     // pro= await Products.findOneAndUpdate({_id:req.params.id},{"$set":{name:body.name,price:body.price,category:body.category}})
//     pro= await Products.findOneAndUpdate({_id:req.params.id},{"$set":body})
//     if (files) {
//       const file = files.image;
//       file.mv(`public/images/${pro._id}.jpg`, (err) => {
//         if (err) {
//           return res.status(500).send(err);
//         }
//         res.redirect("/admin/productManagement")
//       });
//     }else{
//       res.redirect('/admin/productManagement')
//     }
//   } catch (err) {
//     console.log(err);
//     res.send('error').status(500)
//   }

// });

router.post("/editProduct/:id", varifyAdmin,async (req, res) => {
  let { body, files } = req;
  try {
    console.log(req.params.id);
    // pro= await Products.findOneAndUpdate({_id:req.params.id},{"$set":{name:body.name,price:body.price,category:body.category}})
    pro= await Products.findOneAndUpdate({_id:req.params.id},{"$set":body})
    if (files) {
      let {one,two,three} = files;
      try {
       if (one) {
      one.mv(`public/images/${pro._id}.jpg`, (err) => {
        if (err) {
          return res.status(500).send(err);
        }
      });
       } 
       if (two) {
      two.mv(`public/images/${pro._id}_one.jpg`, (err) => {
        if (err) {
          return res.status(500).send(err);
        }
      });
       }
       if (three) {
      three.mv(`public/images/${pro._id}_two.jpg`, (err) => {
        if (err) {
          return res.status(500).send(err);
        }
      });
       }
      } catch (error) {
       console.log(error);
      }
        res.redirect("/admin/productManagement")



    }else{
      res.redirect('/admin/productManagement')
    }
  } catch (err) {
    console.log(err);
    res.send('error').status(500)
  }

});
module.exports = router;
