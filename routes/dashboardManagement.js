var express = require("express");
const dashboardController = require("../controllers/dashboard");
var router = express.Router();

/******************* get dashboard Page **********************/
router.get("/",dashboardController.getDashboardPage)

/******************* get total Ernigs **********************/
router.get('/totalErnigs',dashboardController.totalErnings)

/*******************get data dayvice **********************/
router.get('/orderDayVice',dashboardController.datyViceOrder)

/*******************get data weekvice **********************/
router.get('/orderWeekVice',dashboardController.weekViceOrder)

/*******************get data monthvice **********************/
router.get('/orderMonthVice',dashboardController.monthViceView)

module.exports = router;