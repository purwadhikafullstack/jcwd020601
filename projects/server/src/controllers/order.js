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
        status,
        total,
        UserId,
        BranchId,
        AddressId,
        orderDetails, // [quantity, price, StockId]
      } = req.body;

      // get the order from cart
      // get middleawre

      // create order
      const order = await db.Order.create({
        status,
        total,
        UserId,
        BranchId,
        AddressId,
      });

      //post multiple orderdetails from order
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

      // delete cart by UserId
      await db.Cart.destroy({
        where: {
          UserId: UserId,
        },
      });

      // update multiple bucket in stocks
      await Promise.all(
        orderDetails.map(async (detail) => {
          const { quantity, StockId } = detail;
          const stock = await db.Stock.findByPk(StockId);
          const updatedStock = stock.bucket + quantity;
          return db.Stock.update(
            {
              bucket: updatedStock,
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
  //
  // Uploud Payment Img
  //
  uploadPayment: async (req, res) => {
    try {
      const { id } = req.body;
      // console.log(req.body);
      // console.log("cek");
      const { filename } = req.file;
      // console.log(req.file);
      const result = await db.Order.update(
        {
          payment_url: process.env.payment_img + filename,
        },
        {
          where: {
            id,
          },
        }
      );
      res.send(result);
    } catch (err) {
      return res.status(500).send({
        message: err.message,
      });
    }
  },

  //
  // ------------ confirm payment by OrderId ---------- //
  //
  confirmPayment: async (req, res) => {
    try {
      const { status } = req.body;

      const data = await db.OrderDetail.findAll({
        where: {
          OrderId: req.params.id,
        },
      });
      // console.log(data);

      // check if cancel
      if (status === "cancel") {
        // update multiple buckets on stock
        // console.log("masuk cancel");
        await Promise.all(
          data.map(async (detail) => {
            const { quantity, StockId } = detail;
            const stock = await db.Stock.findByPk(StockId);
            const updatedStock = stock.bucket - quantity;
            return db.Stock.update(
              {
                bucket: updatedStock,
              },
              {
                where: {
                  id: StockId,
                },
              }
            );
          })
        );
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
      } else if (status === "payed") {
        // update multiple stocks
        // update multiple stocksHistory
        await Promise.all(
          data.map(async (detail) => {
            const { quantity, StockId } = detail;
            const stock = await db.Stock.findByPk(StockId);
            const updatedStock = stock.stock - quantity;
            const updatedBucket = stock.bucket - quantity;
            const sH = await db.StockHistory.findByPk(StockId);
            console.log(sH);
            return Promise.all([
              db.Stock.update(
                {
                  stock: updatedStock,
                  bucket: updatedBucket,
                  quantity: quantity,
                },
                {
                  where: {
                    id: StockId,
                  },
                }
              ),
              db.StockHistory.create({
                StockId,
                totalBefore: sH.totalAfter,
                totalAfter: updatedStock,
                quantity: quantity,
                type: "minus",
                subject: "transaction",
              }),
            ]);
          })
        );
        //
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
