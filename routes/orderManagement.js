var express = require("express");
const orderController = require("../controllers/orders");
const { varifyAdmin } = require("./varify/varifyAdmin");
var router = express.Router();

/******************* get order Page **********************/
router.get('/',varifyAdmin,orderController.getOrderPage)

/******************** get order details **********************/
router.get('/check',varifyAdmin,orderController.getOrderDetails)

/******************** cancel order **********************/
router.get('/cancel',varifyAdmin,orderController.cancelOrder)

/******************** deleverd order **********************/
router.get('/deleverd',varifyAdmin,orderController.deleverdOrder)

/******************** deleverd order **********************/
router.get('/shipped',varifyAdmin,orderController.shippedOerder)

router.get('/remove',varifyAdmin,orderController.removeOrder)

module.exports = router