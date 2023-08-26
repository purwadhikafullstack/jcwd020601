const db = require("../models");
const Sequelize = require("sequelize");
const { Op } = db.Sequelize;
const moment = require("moment");
const { default: axios } = require("axios");
const fs = require("fs");
const path = require("path");
const { nanoid } = require("nanoid");

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
      const { BranchName, OrderId, status, before, after, sort } = req.body;
      const page = parseInt(req.query.page) || 0;
      const limit = parseInt(req.query.limit) || 10;
      const offset = limit * page;
      const whereClause = {
        offset: offset,
        limit: limit,
        where: {
          createdAt: {
            [Op.and]: {
              [Op.gte]: new Date(after || "1900-01-01"),
              [Op.lte]: new Date(before || "2100-10-10"),
            },
          },
        },
        include: {
          model: db.Branch,
        },
      };
      if (BranchName) {
        whereClause.include.where = { name: BranchName };
      }
      if (OrderId) {
        whereClause.where.id = OrderId;
      }
      if (status) {
        whereClause.where.status = status;
      }
      if (sort?.sortedBy == "branchName") {
        whereClause.order = [
          [{ model: db.Branch, as: "Branch" }, "name", sort.asc],
        ];
      } else if (sort.sortedBy) {
        whereClause.order = [[sort.sortedBy, sort.asc]];
      } else {
        whereClause.order = [["id", sort.asc]];
      }
      const Order = await db.Order.findAll(whereClause);
      const totalRows = await db.Order.count(whereClause);
      const totalPage = Math.ceil(totalRows / limit);

      return res.send({ Order, page, limit, totalRows, totalPage });
    } catch (err) {
      console.log(err.message);
      res.status(500).send({
        message: err.message,
      });
    }
  },
  getTotalSalesOnLastWeek: async (req, res) => {
    //INCOMPLETE
    try {
      const { BranchId } = req.query;
      let sales = 0;
      let quantitySold = 0;
      const whereOrder = {
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
      };
      const whereQuantity = {
        where: {
          [Op.and]: [
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
      };
      const whereTransaction = {
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
      };
      if (BranchId) {
        whereOrder.BranchId = BranchId;
        whereQuantity.include = {
          model: db.Order,
          as: "Order",
          where: { BranchId },
        };
        whereTransaction.BranchId = BranchId;
      }
      const Order = await db.Order.findAll({
        where: whereOrder,
      });
      Order.map((val) => {
        sales = val.total + sales;
      });
      const quantity = await db.OrderDetail.findAll(whereQuantity);
      quantity.map((val) => {
        quantitySold = quantitySold + val.quantity;
      });
      const transaction = await db.Order.findAndCountAll({
        where: whereTransaction,
      });
      return res.send({
        Date: "From Last Week",
        TotalSales: "Rp." + parseInt(sales).toLocaleString("id-ID"),
        TotalSold: JSON.stringify(quantitySold),
        TotalTransaction: transaction.count,
      });
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
        include: {
          model: db.Address,
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
        include: {
          model: db.Address,
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
      const { BranchId, status, search } = req.body;
      const page = parseInt(req.query.page) || 0;
      const limit = parseInt(req.query.limit) || 10;

      const condition = {
        BranchId,
      };

      if (status !== "all") {
        console.log("NOT ALL NOT ALL NOT ALL");
        condition.status = status;
      }

      if (search) {
        console.log("SEARCH");
        condition.invoiceCode = search;
      }

      const offset = limit * page;

      // Count
      const totalRows = await db.Order.count({
        where: condition,
      });
      const totalPage = Math.ceil(totalRows / limit);

      const Order = await db.Order.findAll({
        where: condition,
        offset: offset,
        limit: limit,
        order: [
          ["createdAt", "DESC"], // Order by createdAt in descending order
        ],
      });

      return res.send({ Order, page, limit, totalRows, totalPage });
    } catch (err) {
      console.log(err.message);
      res.status(500).send({
        message: err.message,
      });
    }
  },
  getSalesOnTime: async (req, res) => {
    try {
      const { time } = req.query;
      const today = new Date();
      const Duration = new Date(today);
      if (time == "allTime") {
        Duration.setDate(today.getDate() - 20000);
      } else if (time == "monthly") {
        Duration.setDate(today.getDate() - 30);
      } else {
        Duration.setDate(today.getDate() - 7);
      }
      const Sales = await db.Order.findAll({
        attributes: [
          [Sequelize.fn("date", Sequelize.col("createdAt")), "date"],
          [Sequelize.fn("sum", Sequelize.col("total")), "total_sales"],
        ],
        where: {
          status: "delivery confirm",
          createdAt: {
            [Sequelize.Op.between]: [Duration, today],
          },
        },
        group: [Sequelize.fn("date", Sequelize.col("createdAt"))],
        raw: true,
      });
      let max = Math.max(...Sales.map((item) => parseInt(item.total_sales)));
      let highest = Sales.filter((item) => parseInt(item.total_sales) === max);

      res.send({ sales: Sales, highest: highest[0] });
    } catch (err) {
      console.log(err.message);
      res.status(500).send({
        message: err.message,
      });
    }
  },
  getSalesFromBranchIdOnTime: async (req, res) => {
    try {
      const { BranchId } = req.params;
      const { time } = req.query;
      const today = new Date();
      const Duration = new Date(today);
      if (time == "allTime") {
        Duration.setDate(today.getDate() - 20000);
      } else if (time == "monthly") {
        Duration.setDate(today.getDate() - 30);
      } else {
        Duration.setDate(today.getDate() - 7);
      }
      const Sales = await db.Order.findAll({
        attributes: [
          [Sequelize.fn("date", Sequelize.col("createdAt")), "date"],
          [Sequelize.fn("sum", Sequelize.col("total")), "total_sales"],
        ],
        where: {
          BranchId,
          status: "delivery confirm",
          createdAt: {
            [Sequelize.Op.between]: [Duration, today],
          },
        },
        group: [Sequelize.fn("date", Sequelize.col("createdAt"))],
        raw: true,
      });
      let max = Math.max(...Sales.map((item) => parseInt(item.total_sales)));
      let highest = Sales.filter((item) => parseInt(item.total_sales) === max);

      res.send({ sales: Sales, highest: highest[0] });
    } catch (err) {
      console.log(err.message);
      res.status(500).send({
        message: err.message,
      });
    }
  },
  getSalesQuantityOnTime: async (req, res) => {
    try {
      const { time } = req.query;
      const today = new Date();
      const Duration = new Date(today);
      if (time == "allTime") {
        Duration.setDate(today.getDate() - 20000);
      } else if (time == "monthly") {
        Duration.setDate(today.getDate() - 30);
      } else {
        Duration.setDate(today.getDate() - 7);
      }
      const Sales = await db.OrderDetail.findAll({
        attributes: [
          [Sequelize.fn("date", Sequelize.col("createdAt")), "date"],
          [Sequelize.fn("sum", Sequelize.col("quantity")), "qty_sold"],
        ],
        where: {
          createdAt: {
            [Sequelize.Op.between]: [Duration, today],
          },
        },
        group: [Sequelize.fn("date", Sequelize.col("createdAt"))],
        raw: true,
      });
      let max = Math.max(...Sales.map((item) => parseInt(item.qty_sold)));
      let highest = Sales.filter((item) => parseInt(item.qty_sold) === max);

      res.send({ sales: Sales, highest: highest[0] });
    } catch (err) {
      console.log(err.message);
      res.status(500).send({
        message: err.message,
      });
    }
  },
  getSalesQuantityFromBranchIdOnTime: async (req, res) => {
    try {
      const { BranchId } = req.params;
      const { time } = req.query;
      const today = new Date();
      const Duration = new Date(today);
      if (time == "allTime") {
        Duration.setDate(today.getDate() - 20000);
      } else if (time == "monthly") {
        Duration.setDate(today.getDate() - 30);
      } else {
        Duration.setDate(today.getDate() - 7);
      }
      const Sales = await db.OrderDetail.findAll({
        attributes: [
          [
            Sequelize.fn("date", Sequelize.col("OrderDetails.createdAt")),
            "date",
          ],
          [Sequelize.fn("sum", Sequelize.col("quantity")), "qty_sold"],
        ],
        where: {
          createdAt: {
            [Sequelize.Op.between]: [Duration, today],
          },
        },
        group: [Sequelize.fn("date", Sequelize.col("OrderDetails.createdAt"))],
        include: {
          model: db.Order,
          as: "Order",
          where: { BranchId },
        },
        raw: true,
      });
      let max = Math.max(...Sales.map((item) => parseInt(item.qty_sold)));
      let highest = Sales.filter((item) => parseInt(item.qty_sold) === max);

      res.send({ sales: Sales, highest: highest[0] });
    } catch (err) {
      console.log(err.message);
      res.status(500).send({
        message: err.message,
      });
    }
  },
  getTransactionOnTime: async (req, res) => {
    try {
      const { time } = req.query;
      const today = new Date();
      const Duration = new Date(today);
      if (time == "allTime") {
        Duration.setDate(today.getDate() - 20000);
      } else if (time == "monthly") {
        Duration.setDate(today.getDate() - 30);
      } else {
        Duration.setDate(today.getDate() - 7);
      }
      const Sales = await db.Order.findAll({
        attributes: [
          [Sequelize.fn("date", Sequelize.col("createdAt")), "date"],
          [Sequelize.fn("count", Sequelize.col("id")), "total_transaction"],
        ],
        where: {
          status: "delivery confirm",
          createdAt: {
            [Sequelize.Op.between]: [Duration, today],
          },
        },
        group: [Sequelize.fn("date", Sequelize.col("createdAt"))],
        raw: true,
      });
      let max = Math.max(
        ...Sales.map((item) => parseInt(item.total_transaction))
      );
      let highest = Sales.filter(
        (item) => parseInt(item.total_transaction) === max
      );

      res.send({ sales: Sales, highest: highest[0] });
    } catch (err) {
      console.log(err.message);
      res.status(500).send({
        message: err.message,
      });
    }
  },
  getTransactionFromBranchIdOnTime: async (req, res) => {
    try {
      const { time } = req.query;
      const { BranchId } = req.params;
      const today = new Date();
      const Duration = new Date(today);
      if (time == "allTime") {
        Duration.setDate(today.getDate() - 20000);
      } else if (time == "monthly") {
        Duration.setDate(today.getDate() - 30);
      } else {
        Duration.setDate(today.getDate() - 7);
      }
      const Sales = await db.Order.findAll({
        attributes: [
          [Sequelize.fn("date", Sequelize.col("createdAt")), "date"],
          [Sequelize.fn("count", Sequelize.col("id")), "total_transaction"],
        ],
        where: {
          BranchId,
          status: "delivery confirm",
          createdAt: {
            [Sequelize.Op.between]: [Duration, today],
          },
        },
        group: [Sequelize.fn("date", Sequelize.col("createdAt"))],
        raw: true,
      });
      let max = Math.max(
        ...Sales.map((item) => parseInt(item.total_transaction))
      );
      let highest = Sales.filter(
        (item) => parseInt(item.total_transaction) === max
      );

      res.send({ sales: Sales, highest: highest[0] });
    } catch (err) {
      console.log(err.message);
      res.status(500).send({
        message: err.message,
      });
    }
  },
  editOrder: async (req, res) => {
    try {
      console.log("masuk");
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

      // check shipping
      if (shipping == undefined || shipping <= 0) {
        throw Error("Select the shipping method");
      }

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
              },
              {
                model: db.Discount,
                required: false,
              },
              {
                model: db.Branch,
                required: true,
              },
            ],
          },
        ],
      });

      // Order weight
      const weight = cart.reduce((prev, curr) => {
        return prev + curr["Stock.Book.weight"];
      }, 0);

      // Price maping (discount)
      const list = cart.map((val) => {
        if (val["Stock.DiscountId"]) {
          if (val["Stock.Discount.isPercent"]) {
            // "percent discount"
            return (
              (val["Stock.Book.price"] -
                val["Stock.Book.price"] *
                  val["Stock.Discount.discount"] *
                  0.01) *
              val["quantity"]
            );
          } else {
            // "minus discount"
            return (
              (val["Stock.Book.price"] - val["Stock.Discount.discount"]) *
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

      // Invoice Code
      const code = nanoid(8).toUpperCase();
      const invoiceCode = "INV-" + code;

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
        invoiceCode,
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
      console.log("MASUK");
      const { status, OrderId } = req.body;
      console.log({ this: status });

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
              // const sH = await db.StockHistory.findByPk(StockId);
              const sH = await db.StockHistory.findOne({
                where: {
                  StockId,
                },
                order: [
                  ["createdAt", "DESC"], // Order by createdAt in descending order
                ],
              });

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
  updateStatusUser: async (req, res) => {
    try {
      // console.log("MASUK");
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
        } else if (status === "waiting for payment confirmation") {
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
          return res.status(400).send("Unauthorized");
        }
      }

      return await db.Order.findOne({
        where: {
          id: OrderId,
        },
      }).then((result) => res.send(result));
    } catch (err) {
      console.log(err);
      res.status(500).send(err);
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
  deleteOrderImage: async (req, res) => {
    try {
      const id = req.params.id;

      // Find the order to get the payment image URL
      const order = await db.Order.findOne({
        where: {
          id,
        },
      });

      if (!order) {
        return res.status(404).send({ message: "Order not found" });
      }

      // Extract the filename from the payment_url
      const paymentImageUrl = order.payment_url;
      const filename = paymentImageUrl.split("/").pop();

      // Construct the file path
      const filePath = path.join(__dirname, "../public/paymentImg", filename);

      // Delete the file if it exists
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }

      // Update the order's payment_url to null
      await db.Order.update(
        {
          payment_url: null,
        },
        {
          where: {
            id,
          },
        }
      );

      res.status(200).send("Payment image deleted successfully");
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
