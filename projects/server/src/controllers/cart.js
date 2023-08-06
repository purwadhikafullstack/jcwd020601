const db = require("../models");
const Sequelize = require("sequelize");
const { Op } = db.Sequelize;
const moment = require("moment");
const cartController = {
  getAll: async (req, res) => {
    try {
      const Cart = await db.Cart.findAll({
        include: [
          {
            model: db.Stock,
            required: true, // Inner join
            include: [
              {
                model: db.Book,
                required: true, // Inner join
              },
              {
                model: db.Branch,
                required: true,
              },
            ],
          },
        ],
      });
      return res.send(Cart);
    } catch (err) {
      console.log(err.message);
      res.status(500).send({
        message: err.message,
      });
    }
  },
  getById: async (req, res) => {
    try {
      const { UserId, BranchId } = req.body;
      const Cart = await db.Cart.findAll({
        where: {
          UserId,
        },
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
                model: db.Branch,
                required: true,
              },
            ],
          },
        ],
      });
      return res.send(Cart);
    } catch (err) {
      console.log(err.message);
      res.status(500).send({
        message: err.message,
      });
    }
  },
  editCart: async (req, res) => {
    try {
      const { StockId, type, id } = req.body;

      // get initial quantity from chart
      const cart = await db.Cart.findOne({
        where: {
          id,
        },
      });
      const qty = cart.quantity;

      // operation type(condition)
      if (type === "plus") {
        quantity = qty + 1;
      } else if (type === "minus") {
        quantity = qty - 1;
      }

      //condition for stocks availability
      const stock = await db.Stock.findOne({
        where: {
          id: StockId,
        },
      });
      const n = stock.stock - stock.bucket;

      if (quantity <= 0) {
        return res
          .status(400)
          .send("Unable to order less than 1 product, please delete instead");
      } else if (n < quantity) {
        return res.status(400).send("Stock Insufficient");
      } else {
        // update quantity
        await db.Cart.update(
          {
            quantity,
          },
          {
            where: {
              id,
            },
          }
        );
      }
      return res.send(`${type} ${quantity}`);
    } catch (err) {
      console.log(err.message);
      res.status(500).send({
        message: err.message,
      });
    }
  },
  insertCart: async (req, res) => {
    try {
      const { qty, UserId, StockId } = req.body;

      //condition for stocks availability
      const stock = await db.Stock.findOne({
        where: {
          id: StockId,
        },
      });
      const avail = stock.stock - stock.bucket;

      if (qty <= 0) {
        res
          .status(400)
          .send("Unable to order less than 1 product, please delete instead");
      } else if (avail >= qty) {
        // check to update or create cart
        const check = await db.Cart.findOne({
          where: {
            StockId,
            UserId,
          },
        });

        if (check) {
          const k = check.dataValues.quantity + qty;
          if (avail >= k) {
            await db.Cart.update(
              {
                quantity: k,
              },
              {
                where: {
                  StockId,
                  UserId,
                },
              }
            );
          } else if (avail < k) {
            return res.status(400).send("Stock Insufficient");
          }
        } else {
          await db.Cart.create({
            quantity: qty,
            UserId,
            StockId,
          });
        }
        const result = await db.Cart.findAll({
          where: {
            UserId,
          },
        });
        return res.send(result);
      } else if (n < qty) {
        res.send("Stock Insufficient");
      }
    } catch (err) {
      console.log(err);
      return res.status(500).send({
        message: err.message,
      });
    }
  },
  deleteCart: async (req, res) => {
    try {
      await db.Cart.destroy({
        where: {
          //  id: req.params.id

          //   [Op.eq]: req.params.id

          id: req.params.id,
        },
      });
      return await db.Cart.findAll().then((result) => res.send(result));
    } catch (err) {
      console.log(err.message);
      return res.status(500).send({
        error: err.message,
      });
    }
  },
};

module.exports = cartController;
