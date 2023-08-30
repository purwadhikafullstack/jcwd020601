const db = require("../models");
const Sequelize = require("sequelize");
const { Op } = db.Sequelize;
const moment = require("moment");
const { stockHistoryServices } = require("../services");
const stockHistoryController = {
  getById: async (req, res) => {
    const { StockId } = req.body;
    try {
      const StockHistory = await stockHistoryServices.getStockHistoryV2({
        StockId,
      });
      return res.send(StockHistory);
    } catch (err) {
      console.log(err.message);
      res.status(500).send({
        message: err.message,
      });
    }
  },
};

module.exports = stockHistoryController;
