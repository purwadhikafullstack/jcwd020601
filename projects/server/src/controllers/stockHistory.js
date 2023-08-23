const db = require("../models");
const Sequelize = require("sequelize");
const { Op } = db.Sequelize;
const moment = require("moment");
const stockHistoryController = {
  getAll: async (req, res) => {
    try {
      const StockHistory = await db.StockHistory.findAll();
      return res.send(StockHistory);
    } catch (err) {
      console.log(err.message);
      res.status(500).send({
        message: err.message,
      });
    }
  },
  getById: async (req, res) => {
    const { StockId } = req.body;
    try {
      const StockHistory = await db.StockHistory.findAll({
        where: {
          StockId,
        },
      });
      return res.send(StockHistory);
    } catch (err) {
      console.log(err.message);
      res.status(500).send({
        message: err.message,
      });
    }
  },
  editStockHistory: async (req, res) => {
    try {
      const { subject, type, quantity, totalBefore, totalAfter, StockId } =
        req.body;
      await db.StockHistory.update(
        {
          subject,
          type,
          quantity,
          stockOut,
          totalBefore,
          totalAfter,
          StockId,
        },
        {
          where: {
            id: req.params.id,
          },
        }
      );

      return await db.StockHistory.findOne({
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
  insertStockHistory: async (req, res) => {
    try {
      const { type, quantity, stockOut, totalBefore, totalAfter, StockId } =
        req.body;
      await db.StockHistory.create({
        subject,
        type,
        quantity,
        stockOut,
        totalBefore,
        totalAfter,
        StockId,
      });
      return await db.StockHistory.findAll().then((result) => {
        res.send(result);
      });
    } catch (err) {
      console.log(err);
      return res.status(500).send({
        message: err.message,
      });
    }
  },
  deleteStockHistory: async (req, res) => {
    try {
      await db.StockHistory.destroy({
        where: {
          //  id: req.params.id

          //   [Op.eq]: req.params.id

          id: req.params.id,
        },
      });
      return await db.StockHistory.findAll().then((result) => res.send(result));
    } catch (err) {
      console.log(err.message);
      return res.status(500).send({
        error: err.message,
      });
    }
  },
};

module.exports = stockHistoryController;
