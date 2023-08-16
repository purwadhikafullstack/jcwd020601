const db = require("../models");
const Sequelize = require("sequelize");
const { Op } = db.Sequelize;
const moment = require("moment");
const orderDetailController = {
  getAll: async (req, res) => {
    try {
      const OrderDetail = await db.OrderDetail.findAll();
      return res.send(OrderDetail);
    } catch (err) {
      console.log(err.message);
      res.status(500).send({
        message: err.message,
      });
    }
  },
  getById: async (req, res) => {
    try {
      const { OrderId } = req.body;
      const Order = await db.Order.findOne({
        where: {
          id: OrderId,
        },
      });
      console.log();
      const OrderDetail = await db.OrderDetail.findAll({
        where: {
          OrderId,
        },
        include: [
          {
            model: db.Order,
            required: true,
          },
          {
            model: db.Stock,
            include: [
              {
                model: db.Book,
              },
            ],
          },
        ],
      });
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
  editOrderDetail: async (req, res) => {
    try {
      console.log("test");
      const { quantity, price, OrderId, StockId } = req.body;
      await db.OrderDetail.update(
        { quantity, price, OrderId, StockId },
        {
          where: {
            id: req.params.id,
          },
        }
      );

      return await db.OrderDetail.findOne({
        where: {
          id: req.params.id,
        },
      }).then((result) => res.send(result));
    } catch (err) {
      console.log(err.message);
      res.status(500).send({
        message: err.message,
      });
    }
  },
  insertOrderDetail: async (req, res) => {
    try {
      const { quantity, price, OrderId, StockId } = req.body;
      await db.OrderDetail.create({
        quantity,
        price,
        OrderId,
        StockId,
      });
      return await db.OrderDetail.findAll().then((result) => {
        res.send(result);
      });
    } catch (err) {
      console.log(err);
      return res.status(500).send({
        message: err.message,
      });
    }
  },
  deleteOrderDetail: async (req, res) => {
    try {
      await db.OrderDetail.destroy({
        where: {
          //  id: req.params.id

          //   [Op.eq]: req.params.id

          id: req.params.id,
        },
      });
      return await db.OrderDetail.findAll().then((result) => res.send(result));
    } catch (err) {
      console.log(err.message);
      return res.status(500).send({
        error: err.message,
      });
    }
  },
};

module.exports = orderDetailController;
