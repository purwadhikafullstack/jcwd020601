const db = require("../models");
const Sequelize = require("sequelize");
const { Op } = db.Sequelize;
const moment = require("moment");
const { cartServices, stockServices } = require("../services");

const cartController = {
  getAll: async (req, res) => {
    try {
      const Cart = cartServices.getAll();
      return res.send(Cart);
    } catch (err) {
      console.log(err.message);
      res.status(500).send({
        message: err.message,
      });
    }
  },
  getQty: async (req, res) => {
    try {
      const { UserId } = req.body;
      const result = await cartServices.getQty({ UserId });
      res.send(result);
    } catch (error) {
      res.status(500).send({
        message: error.message,
      });
    }
  },
  getById: async (req, res) => {
    try {
      const { UserId, BranchId } = req.body;
      const Cart = await cartServices.getCartUserId({
        UserId,
        BranchId,
        raw: false,
      });

      const weight = Cart.reduce((prev, curr) => {
        return (
          prev +
          curr.dataValues.quantity *
            curr.dataValues.Stock.dataValues.Book.weight
        );
      }, 0);

      const quantity = Cart.reduce((prev, curr) => {
        return prev + curr.dataValues.quantity;
      }, 0);

      return res.send({ Cart, weight, quantity });
    } catch (err) {
      console.log(err.message);
      res.status(500).send({
        message: err.message,
      });
    }
  },
  editCart: async (req, res) => {
    try {
      const trans = await db.sequelize.transaction();
      const { StockId, type, id } = req.body;

      // get initial quantity from chart
      const cart = await cartServices.getOneCart({ id });
      const qty = cart.quantity;

      // operation type(condition)
      if (type === "plus") {
        quantity = qty + 1;
      } else if (type === "minus") {
        quantity = qty - 1;
      }

      //condition for stocks availability
      const stock = await stockServices.getStockById({ StockId });
      const n = stock.stock - stock.bucket;

      if (quantity <= 0) {
        await trans.rollback();
        return res
          .status(400)
          .send("Unable to order less than 1 product, please delete instead");
      } else if (n < quantity) {
        await trans.rollback();
        return res.status(400).send("Stock Insufficient");
      } else {
        // update quantity
        await cartServices.updateCart({ quantity, id, trans });
      }
      await trans.commit();
      return res.send(`${type} ${quantity}`);
    } catch (err) {
      await trans.rollback();
      console.log(err.message);
      res.status(500).send({
        message: err.message,
      });
    }
  },
  insertCart: async (req, res) => {
    try {
      const trans = await db.sequelize.transaction();
      const { qty, UserId, StockId } = req.body;

      //condition for stocks availability
      const stock = await stockServices.getStockById({ StockId });
      const avail = stock.stock - stock.bucket;

      if (qty <= 0) {
        await trans.rollback();
        res
          .status(400)
          .send("Unable to order less than 1 product, please delete instead");
      } else if (avail >= qty) {
        // check to update or create cart
        const check = await cartServices.getCartStockIdUserId({
          StockId,
          UserId,
        });

        if (check) {
          const k = check.dataValues.quantity + qty;
          if (avail >= k) {
            await cartServices.updateCartById({ k, StockId, UserId, trans });
          } else if (avail < k) {
            await trans.rollback();
            return res.status(400).send("Stock Insufficient");
          }
        } else {
          await cartServices.insertCart({ qty, UserId, StockId, trans });
        }
        await trans.commit();
        return res.send("product inserted");
      } else if (avail < qty) {
        console.log({ masuk: avail, qty: qty });
        await trans.rollback();
        res.status(400).send("Stock Insufficient");
      }
    } catch (err) {
      console.log(err);
      await trans.rollback();
      return res.status(500).send({
        message: err.message,
      });
    }
  },
  deleteCart: async (req, res) => {
    try {
      const trans = await db.sequelize.transaction();
      const id = req.params.id;
      await cartServices.destroyCartId({ id, trans });
      await trans.commit();
      return await db.Cart.findAll().then((result) => res.send(result));
    } catch (err) {
      console.log(err.message);
      await trans.rollback();
      return res.status(500).send({
        error: err.message,
      });
    }
  },
};

module.exports = cartController;
