const db = require("../models");
const Sequelize = require("sequelize");
const { Op } = db.Sequelize;
const moment = require("moment");
const { default: axios } = require("axios");

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
  getByUserId: async (req, res) => {
    try {
      const Order = await db.Order.findAll({
        where: {
          UserId: req.params.UserId,
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
  getByFilter: async (req, res) => {
    try {
      const { BranchId, OrderId, status, before, after } = req.body;
      const page = parseInt(req.query.page) || 0;
      const limit = parseInt(req.query.limit) || 10;
      // const status = r
      const whereClause = {
        createdAt: {
          [Op.and]: {
            [Op.gte]: new Date(after || "1900-01-01"),
            [Op.lte]: new Date(before || "2100-10-10"),
          },
        },
      };
      if (BranchId) {
        whereClause.BranchId = BranchId;
      }
      if (OrderId) {
        whereClause.id = OrderId;
      }
      if (status) {
        whereClause.status = status;
      }
      const offset = limit * page;

      const Order = await db.Order.findAll({
        where: whereClause,
        offset: offset,
        limit: limit,
        include: {
          model: db.Branch,
        },
      });
      const totalRows = await db.Order.count({
        where: whereClause,
        offset: offset,
        limit: limit,
      });

      const totalPage = Math.ceil(totalRows / limit);

      return res.send({ Order, page, limit, totalRows, totalPage });
    } catch (err) {
      console.log(err.message);
      res.status(500).send({
        message: err.message,
      });
    }
  },
  getPendingByUserId: async (req, res) => {
    try {
      const Order = await db.Order.findAll({
        where: {
          [Op.and]: [
            { UserId: req.params.UserId },
            {
              status: {
                [Op.or]: [
                  "waiting for payment",
                  "waiting for payment confirmation",
                  "process",
                  "sending",
                ],
              },
            },
          ],
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
  getHistoryByUserId: async (req, res) => {
    try {
      const Order = await db.Order.findAll({
        where: {
          [Op.and]: [
            { UserId: req.params.UserId },
            { status: { [Op.or]: ["delivery confirm", "canceled"] } },
          ],
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
  getAllBranchOrder: async (req, res) => {
    try {
      const { BranchId } = req.body;
      const page = parseInt(req.query.page) || 0;
      const limit = parseInt(req.query.limit) || 10;
      // const status = req.query.status;
      // const search = req.query.search_query || "";
      // const condition = {
      //   BranchId,
      //   status: "waiting for payment",
      // };

      // if (status !== undefined) {
      //   condition.status = status;
      // }
      // console.log(condition);
      const offset = limit * page;

      // Count
      const totalRows = await db.Order.count({});
      const totalPage = Math.ceil(totalRows / limit);

      const Order = await db.Order.findAll({
        offset: offset,
        limit: limit,
        include: {
          model: db.Branch,
        },
      });

      return res.send({ Order, page, limit, totalRows, totalPage });
    } catch (err) {
      console.log(err.message);
      res.status(500).send({
        message: err.message,
      });
    }
  },
  getBranchOrder: async (req, res) => {
    try {
      const { BranchId } = req.body;
      const page = parseInt(req.query.page) || 0;
      const limit = parseInt(req.query.limit) || 10;
      // const status = req.query.status;
      // const search = req.query.search_query || "";
      // const condition = {
      //   BranchId,
      //   status: "waiting for payment",
      // };

      // if (status !== undefined) {
      //   condition.status = status;
      // }
      // console.log(condition);
      const offset = limit * page;

      // Count
      const totalRows = await db.Order.count({
        where: {
          BranchId,
        },
      });
      const totalPage = Math.ceil(totalRows / limit);

      const Order = await db.Order.findAll({
        where: {
          BranchId,
          // status: "waiting for payment",
        },
        offset: offset,
        limit: limit,
      });

      return res.send({ Order, page, limit, totalRows, totalPage });
    } catch (err) {
      console.log(err.message);
      res.status(500).send({
        message: err.message,
      });
    }
  },
  getSalesOnAllTime: async (req, res) => {
    //INCOMPLETE
    try {
      let sales = 0;
      const Order = await db.Order.findAll({
        where: {
          status: "delivery confirm",
        },
      });
      Order.map((val) => {
        sales = val.total + sales;
      });
      return res.send({
        Date: "From All Of Time",
        TotalSales: JSON.stringify(sales),
      });
    } catch (err) {
      console.log(err.message);
      res.status(500).send({
        message: err.message,
      });
    }
  },
  getSalesOnLastMonth: async (req, res) => {
    //INCOMPLETE
    try {
      let sales = 0;
      const Order = await db.Order.findAll({
        where: {
          [Op.and]: [
            { Status: "delivery confirm" },
            {
              createdAt: {
                [db.Sequelize.Op.gte]: moment()
                  .subtract(1, "month")
                  .startOf("day")
                  .format(),
              },
            },
          ],
        },
      });
      Order.map((val) => {
        sales = val.total + sales;
      });
      return res.send({
        Date: "From Last Month",
        TotalSales: JSON.stringify(sales),
      });
    } catch (err) {
      console.log(err.message);
      res.status(500).send({
        message: err.message,
      });
    }
  },
  getSalesFromBranchIdOnLastMonth: async (req, res) => {
    //INCOMPLETE
    try {
      let sales = 0;
      const { BranchId } = req.params;
      const Order = await db.Order.findAll({
        where: {
          [Op.and]: [
            { BranchId },
            { Status: "delivery confirm" },
            {
              createdAt: {
                [db.Sequelize.Op.gte]: moment()
                  .subtract(1, "month")
                  .startOf("day")
                  .format(),
              },
            },
          ],
        },
      });
      Order.map((val) => {
        sales = val.total + sales;
      });
      return res.send({
        Date: "From Last Month",
        TotalSales: JSON.stringify(sales),
        BranchId,
      });
    } catch (err) {
      console.log(err.message);
      res.status(500).send({
        message: err.message,
      });
    }
  },
  getSalesOnLastWeek: async (req, res) => {
    //INCOMPLETE
    try {
      let sales = 0;
      const Order = await db.Order.findAll({
        where: {
          [Op.and]: [
            { Status: "delivery confirm" },
            {
              createdAt: {
                [db.Sequelize.Op.gte]: moment()
                  .subtract(1, "week")
                  .startOf("day")
                  .format(),
              },
            },
          ],
        },
      });
      Order.map((val) => {
        sales = val.total + sales;
      });
      return res.send({
        Date: "From Last Week",
        TotalSales: JSON.stringify(sales),
      });
    } catch (err) {
      console.log(err.message);
      res.status(500).send({
        message: err.message,
      });
    }
  },
  getSalesFromBranchIdOnLastWeek: async (req, res) => {
    //INCOMPLETE
    try {
      let sales = 0;
      const { BranchId } = req.params;
      const Order = await db.Order.findAll({
        where: {
          [Op.and]: [
            { BranchId },
            { Status: "delivery confirm" },
            {
              createdAt: {
                [db.Sequelize.Op.gte]: moment()
                  .subtract(1, "week")
                  .startOf("day")
                  .format(),
              },
            },
          ],
        },
      });
      Order.map((val) => {
        sales = val.total + sales;
      });
      return res.send({
        Date: "From Last Week",
        TotalSales: JSON.stringify(sales),
        BranchId,
      });
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
      const { UserId, BranchId, AddressId, shipping, courier } = req.body;

      // get the order from cart
      const cart = await db.Cart.findAll({
        where: {
          UserId,
        },
        raw: true,
        include: [
          {
            model: db.Stock,
            required: true,
            where: {
              BranchId,
            },
            include: [
              {
                model: db.Book,
                required: true,
                include: [
                  {
                    model: db.Discount,
                    required: false,
                  },
                ],
              },
              {
                model: db.Branch,
                required: true,
              },
            ],
          },
        ],
      });

      // cityId
      const city = await db.City.findOne({
        where: {
          city_name: cart[0]["Stock.Branch.city"],
        },
      });
      const cityId = city.dataValues.city_id;

      // Order weight
      const weight = cart.reduce((prev, curr) => {
        return prev + curr["Stock.Book.weight"];
      }, 0);

      // Price maping (discount)
      const list = cart.map((val) => {
        if (val["Stock.Book.DiscountId"]) {
          if (val["Stock.Book.Discount.isPercent"]) {
            // "percent discount"
            return (
              (val["Stock.Book.price"] -
                val["Stock.Book.price"] *
                  val["Stock.Book.Discount.discount"] *
                  0.01) *
              val["quantity"]
            );
          } else {
            // "minus discount"
            return (
              (val["Stock.Book.price"] - val["Stock.Book.Discount.discount"]) *
              val["quantity"]
            );
          }
        } else {
          // "no discount";
          return val["Stock.Book.price"] * val["quantity"];
        }
      });

      // Total Price of Order
      const t = list.reduce((prev, curr) => {
        return prev + curr;
      }, 0);
      const total = Number(t) + Number(shipping);

      // orderDetails generete
      const orderDetails = cart.map((val, idx) => ({
        quantity: val.quantity,
        price: list[idx], // price with discount
        StockId: val["Stock.id"],
      }));
      //   [
      //     {
      //       "quantity": ,
      //       "price": ,
      //       "StockId":
      //     },
      //   ]

      // Create Order
      const order = await db.Order.create({
        status: "waiting for payment",
        total,
        UserId,
        BranchId,
        AddressId,
        shipping,
        courier,
        weight,
      });

      // post multiple orderdetails from order
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

      // delete cart by UserId
      await db.Cart.destroy({
        where: {
          UserId,
        },
      });

      return res.status(200).send(order);
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
      console.log("masuk");
      const { id } = req.body;
      // console.log(req.body);
      // console.log("cek");
      const { filename } = req.file;
      // console.log(req.file);
      console.log(filename);
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
      res.status(200).send("payment proof uploaded");
    } catch (err) {
      return res.status(500).send({
        message: err.message,
      });
    }
  },

  //
  // ------------ Update Status ---------- //
  //
  updateStatus: async (req, res) => {
    try {
      const { status, OrderId } = req.body;
      console.log(status);

      const data = await db.OrderDetail.findAll({
        where: {
          OrderId,
        },
      });

      const data2 = await db.Order.findOne({
        where: {
          id: OrderId,
        },
      });

      console.log(data2.status);
      if (data2.status === "delivery confirm") {
        return res.status(400).send("The order has completed");
      } else if (data2.status === "canceled") {
        return res.status(400).send("The order has been permanently canceled");
      } else if (data2.status === "sending") {
        if (status === "delivery confirm") {
          await db.Order.update(
            {
              status,
            },
            {
              where: {
                id: OrderId,
              },
            }
          );
        } else {
          return res.status(400).send("The order has been send");
        }
      } else {
        // check if cancel
        if (status === "canceled") {
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
                id: OrderId,
              },
            }
          );
        } else if (status === "sending") {
          // update multiple stocks
          // update multiple stocksHistory
          await Promise.all(
            data.map(async (detail) => {
              const { quantity, StockId } = detail;
              console.log({ quantity, StockId });
              const stock = await db.Stock.findByPk(StockId);
              const updatedStock = stock.stock - quantity;
              const updatedBucket = stock.bucket - quantity;
              const sH = await db.StockHistory.findByPk(StockId);
              console.log({ this: sH });
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
                id: OrderId,
              },
            }
          );
        } else {
          await db.Order.update(
            {
              status,
            },
            {
              where: {
                id: OrderId,
              },
            }
          );
        }
      }

      return await db.Order.findOne({
        where: {
          id: OrderId,
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
  getShipping: async (req, res) => {
    try {
      const { origin, destination, weight, courier } = req.body;
      const form = new FormData();
      form.append("origin", origin);
      form.append("destination", destination);
      form.append("weight", weight);
      form.append("courier", courier);

      const response = await axios.post(
        "https://api.rajaongkir.com/starter/cost",
        form,
        {
          headers: { key: process.env.RAJA_ONGKIR },
        }
      );
      // await db.Province.bulkCreate(response.data.rajaongkir.results);
      return res.status(200).send(response.data.rajaongkir.results[0].costs);
    } catch (error) {
      return res.status(500).send({ message: error });
    }
  },
};

module.exports = orderController;
