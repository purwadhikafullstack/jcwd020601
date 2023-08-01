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
      const Cart = await db.Cart.findAll({
        where: {
          UserId: req.params.id,
        },
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
  editCart: async (req, res) => {
    try {
      const { quantity, StockId } = req.body;
      await db.Cart.update(
        {
          quantity,
          StockId,
        },
        {
          where: {
            id: req.params.id,
          },
        }
      );

      return await db.Cart.findOne({
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
  insertCart: async (req, res) => {
    try {
      const { quantity, UserId, StockId } = req.body;

      //condition for stocks availability
      const stock = await db.Stock.findOne({
        where: {
          id: StockId,
        },
      });
      const qty = stock.stock - stock.bucket;

      if (quantity <= 0) {
        res
          .status(400)
          .send("Unable to order less than 1 product, please delete instead");
      } else if (qty >= quantity) {
        // check to update or create cart
        const check = await db.Cart.findOne({
          where: {
            StockId,
            UserId,
          },
        });

        if (check) {
          await db.Cart.update(
            {
              quantity,
            },
            {
              where: {
                StockId,
                UserId,
              },
            }
          );
        } else {
          await db.Cart.create({
            quantity,
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
      } else if (qty < quantity) {
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
