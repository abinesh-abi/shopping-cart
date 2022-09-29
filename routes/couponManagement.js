var express = require("express");
const { varifyAdmin } = require("./varify/varifyAdmin");
var router = express.Router();

const couponController = require("../controllers/coupon");


/******************* get coupon Page **********************/
router.get('/',varifyAdmin, couponController.getCouponPage)

/******************* get coupon Details **********************/
 router.get('/get',varifyAdmin,couponController.getCouonsDeatil)

/******************* Add  coupon  **********************/
router.get('/add',varifyAdmin,couponController.addCoupon)

/******************* Add  coupon  **********************/
router.get('/remove',varifyAdmin,couponController.removeCoupon)

module.exports = router;