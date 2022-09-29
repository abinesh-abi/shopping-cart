const {
  addCoupon,
  getCoupon,
  removeCoupon,
  getCouponByName,
  removeExpiredCoupon,
} = require("../service/couponService");
module.exports = {
  getCouponPage: (req, res) => {
    try {
      res.render("admin/coupon");
      removeExpiredCoupon();
    } catch (error) {
      res.json({ error });
    }
  },
  getCouonsDeatil: (req, res) => {
    try {
      getCoupon()
        .then((data) => res.json(data))
        .catch((err) => res.json("err"));
    } catch (error) {
      res.json({ error });
    }
  },
  addCoupon: async (req, res) => {
    try {
      let { code, value, date } = req.query;
      code = code.toLowerCase();
      let couponExits = await getCouponByName(code);
      if (couponExits) {
        res.json({ error: "Coupon Already Exists" });
      } else {
        date = new Date(date).toISOString();
        addCoupon(code, value, date)
          .then((data) => res.json(data))
          .catch((err) => res.json(err));
      }
    } catch (error) {
      res.json({ error });
    }
  },
  removeCoupon: async (req, res) => {
    try {
      let { id } = req.query;
      removeCoupon(id)
        .then((data) => res.json(data))
        .catch((err) => res.json(err));
    } catch (error) {
        res.json("Error");
    }
  },
};
