const {
  totalErnings,
  orderDayVice,
  orderMonthVice,
  orderWeekVice,
} = require("../service/orderService");
module.exports = {
  getDashboardPage: (req, res) => {
    try {
      res.render("admin/dashboard");
    } catch (error) {
      res.json("Error");
    }
  },
  totalErnings: (req, res) => {
    try {
      totalErnings()
        .then((data) => {
          res.json(data[0].totalErnings);
        })
        .catch((err) => res.json(err));
    } catch (error) {
      res.json("Error");
    }
  },
  datyViceOrder: (req, res) => {
    try {
      orderDayVice()
        .then((data) => {
          res.json(data);
        })
        .catch((err) => {
          res.send("err");
        });
    } catch (error) {
      res.json("Error");
    }
  },
  weekViceOrder: (req, res) => {
    try {
      orderWeekVice()
        .then((data) => {
          // let date = new Date((data[0].detail.date)).toDateString();
          res.json(data);
        })
        .catch((err) => {
          res.send("err");
        });
    } catch (error) {
      res.json("Error");
    }
  },
  monthViceView: (req, res) => {
    try {
      orderMonthVice()
        .then((data) => {
          res.json(data);
        })
        .catch((err) => {
          res.send("err");
        });
    } catch (error) {
      res.json("Error");
    }
  },
};
