const db = require("../models");
const Sequelize = require("sequelize");
const { Op } = db.Sequelize;
const moment = require("moment");
const { orderServices, orderDetailServices } = require("../services");

const orderDetailController = {
  getById: async (req, res) => {
    try {
      const { invoiceCode } = req.body;
      const Order = await orderServices.getOrderInvoice({ invoiceCode });
      const OrderId = Order.id;
      const OrderDetail = await orderDetailServices.getAllOrderId({ OrderId });
      if (Order.dataValues.UserId == req.user.id) {
        return res.send(OrderDetail);
      }
      return res.status(500).send("Beda User");
    } catch (err) {
      console.log(err.message);
      res.status(500).send({
        message: err.message,
      });
    }
  },
  getByIdAdmin: async (req, res) => {
    try {
      const { OrderId } = req.body;
      const OrderDetail = await orderDetailServices.getAllOrderId({ OrderId });
      return res.send(OrderDetail);
    } catch (err) {
      console.log(err.message);
      res.status(500).send({
        message: err.message,
      });
    }
  },
};

module.exports = orderDetailController;
