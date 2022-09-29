
var express = require("express");
const { varifyAdmin } = require("./varify/varifyAdmin");
const CategoryController = require("../controllers/Category");
var router = express.Router();

/*******************view Categories**********************/
router.get('/',varifyAdmin, CategoryController.categoryHome)


/*******************get Categories**********************/
router.get("/get", CategoryController.getCategories)

/*******************add Categories**********************/
 router.get('/add', CategoryController.inserCategory)

/*******************load Edit Categories page**********************/
 router.get('/edit/:id',CategoryController.getEditCategory)

/*******************Edit Categories **********************/
 router.post('/edit/:id',CategoryController.postEditCategory)

/*******************Delete Categories **********************/
router.get("/delete/:id",CategoryController.deleteCategory)

/*******************Delete Categories **********************/
 router.post("/editOffer",CategoryController.editOffer)

module.exports = router;