const db = require("../models");
const Sequelize = require("sequelize");
const { Op } = db.Sequelize;
const moment = require("moment");
const orderController = {
  getAll: async (req, res) => {
    try {
      const Order = await db.Order.findAll();
      return res.send(Order);
    } catch (err) {
      console.log(err.message);
      res.status(500).send({
        message: err.message,
      });
    }
  },
  getById: async (req, res) => {
    try {
      const Order = await db.Order.findOne({
        where: {
          id: req.params.id,
        },
      });
      return res.send(Order);
    } catch (err) {
      console.log(err.message);
      res.status(500).send({
        message: err.message,
      });
    }
  },
  editOrder: async (req, res) => {
    try {
      const { payment_url, status, total, UserId, BranchId, AddressId } =
        req.body;
      await db.Order.update(
        {
          payment_url,
          status,
          total,
          UserId,
          BranchId,
          AddressId,
        },
        {
          where: {
            id: req.params.id,
          },
        }
      );

      return await db.Order.findOne({
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
  insertOrder: async (req, res) => {
    try {
      const {
        payment_url,
        status,
        total,
        UserId,
        BranchId,
        AddressId,
        orderDetails, // [quantity, price, StockId]
      } = req.body;

      const order = await db.Order.create({
        payment_url,
        status,
        total,
        UserId,
        BranchId,
        AddressId,
      });

      //post multiple orderdetails
      await Promise.all(
        orderDetails.map(async (detail) => {
          const { quantity, price, StockId } = detail;
          return db.OrderDetail.create({
            quantity,
            price,
            OrderId: order.id,
            StockId,
          });
        })
      );

      await db.Cart.destroy({
        where: {
          id: UserId,
        },
      });

      // const data = await db.OrderDetail.findAll({
      //   where: {
      //     OrderId: order.id,
      //   },
      // });

      //update multiple stocks
      await Promise.all(
        orderDetails.map(async (detail) => {
          const { quantity, StockId } = detail;
          return db.Stock.update(
            {
              stock: quantity,
            },
            {
              where: {
                id: StockId,
              },
            }
          );
        })
      );

      return res.send("check payment");
    } catch (err) {
      console.log(err);
      return res.status(500).send({
        message: err.message,
      });
    }
  },
  confirmPayment: async (req, res) => {
    try {
      const { status } = req.body;
      await db.Order.update(
        {
          status,
        },
        {
          where: {
            id: req.params.id,
          },
        }
      );

      const data = await db.OrderDetail.findAll({
        where: {
          OrderId: req.params.id,
        },
      });

      console.log(data);

      if (status === "cancel") {
        // update multiple stock if cancel
        await Promise.all(
          data.map(async (detail) => {
            const { quantity, StockId } = detail;
            return db.Stock.update(
              {
                stock: quantity,
              },
              {
                where: {
                  id: StockId,
                },
              }
            );
          })
        );
      }

      return await db.Order.findOne({
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
  deleteOrder: async (req, res) => {
    try {
      await db.Order.destroy({
        where: {
          //  id: req.params.id

          //   [Op.eq]: req.params.id

          id: req.params.id,
        },
      });
      return await db.Order.findAll().then((result) => res.send(result));
    } catch (err) {
      console.log(err.message);
      return res.status(500).send({
        error: err.message,
      });
    }
  },
};

module.exports = orderController;
