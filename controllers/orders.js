const {
  orderAggregate,
  removeOrder,
  cancelOrder,
  deleverdOrder,
  shippedOrder,
} = require("../service/orderService");
const { valletView, updateVallet } = require("../service/valletService");
module.exports = {
  getOrderPage: (req, res) => {
    try {
      let admin = req.admin;
      res.render("admin/orderManagement2", { admin });
    } catch (error) {
      res.json("Error");
    }
  },
  getOrderDetails: async (req, res) => {
    try {
      let admin = req.admin;
      let order = orderAggregate()
        .then((data) => res.json(data))
        .catch((error) => res.json({ error }));
    } catch (error) {
      res.json("Error");
    }
  },
  cancelOrder: async (req, res) => {
    try {
      let { userId, orderId, payMethod, totalPrice } = req.query;
      let vallet = await valletView(userId);
      let newValletBalance = vallet.balance + Number(totalPrice);
      if (payMethod != "cod") {
        await updateVallet(userId, newValletBalance);
      }
      cancelOrder(orderId)
        .then((data) => res.json(data))
        .catch((error) => res.json({ error }));
    } catch (error) {
      res.json("Error");
    }
  },
  deleverdOrder: (req, res) => {
    try {
      let { orderId } = req.query;
      deleverdOrder(orderId)
        .then((data) => res.json(data))
        .catch((error) => res.json({ error }));
    } catch (error) {
      res.json("Error");
    }
  },
  shippedOerder: (req, res) => {
    try {
      let { orderId } = req.query;
      shippedOrder(orderId)
        .then((data) => res.json(data))
        .catch((error) => res.json({ error }));
    } catch (error) {
      res.json("Error");
    }
  },
  removeOrder: async (req, res) => {
    try {
      let { orderId } = req.query;
      removeOrder(orderId)
        .then((data) => res.json(data))
        .catch((error) => res.json({ error }));
    } catch (error) {
      res.json("Error");
    }
  },
};
