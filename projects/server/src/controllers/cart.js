const db = require("../models");
const Sequelize = require("sequelize");
const { Op } = db.Sequelize;
const moment = require("moment");
const cartController = {
  getAll: async (req, res) => {
    try {
      const Cart = await db.Cart.findAll();
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
      const Cart = await db.Cart.findOne({
        where: {
          id: req.params.id,
        },
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
      const { quantity, UserId, StockId } = req.body;
      await db.Cart.update(
        {
          quantity,
          UserId,
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
      await db.Cart.create({
        quantity,
        UserId,
        StockId,
      });
      return await db.Cart.findAll().then((result) => {
        res.send(result);
      });
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
