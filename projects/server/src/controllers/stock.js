const db = require("../models");
const Sequelize = require("sequelize");
const { Op } = db.Sequelize;
const moment = require("moment");
const stockController = {
  getAll: async (req, res) => {
    try {
      const Stock = await db.Stock.findAll({
        include: [
          {
            model: db.Book,
            required: true, // Inner join
          },
          {
            model: db.Branch,
            required: true, // Inner join
          },
        ],
      });
      return res.send(Stock);
    } catch (err) {
      console.log(err.message);
      res.status(500).send({
        message: err.message,
      });
    }
  },
  getById: async (req, res) => {
    try {
      const Stock = await db.Stock.findOne({
        where: {
          id: req.params.id,
        },
        include: [
          {
            model: db.Book,
            required: true, // Inner join
          },
          {
            model: db.Branch,
            required: true, // Inner join
          },
        ],
      });
      return res.send(Stock);
    } catch (err) {
      console.log(err.message);
      res.status(500).send({
        message: err.message,
      });
    }
  },
  editStock: async (req, res) => {
    try {
      // const { stock, BranchId, BookId } = req.body;
      // await db.Stock.update(
      //   {
      //     stock,
      //     BranchId,
      //     BookId,
      //   },
      //   {
      //     where: {
      //       id: req.params.id,
      //     },
      //   }
      // );

      const stockUpdates = req.body.stockUpdates;

      const updatedStocks = await Promise.all(
        stockUpdates.map(async (update) => {
          const { stock, BranchId, BookId, ...updateData } = update;

          // Find the existing stock
          const existingStock = await db.Stock.findOne({
            where: {
              BranchId,
              BookId,
            },
          });

          if (existingStock) {
            // Update the stock with the values from the update
            return existingStock.update(updateData);
          } else {
            // Create a new stock entry
            return db.Stock.create({
              stock,
              BranchId,
              BookId,
              ...updateData,
            });
          }
        })
      );

      res.send(updatedStocks);

      // return await db.Stock.findOne({
      //   where: {
      //     id: req.params.id,
      //   },
      // }).then((result) => res.send(result));
    } catch (err) {
      console.log(err.message);
      res.status(500).send({
        message: err.message,
      });
    }
  },
  insertStock: async (req, res) => {
    try {
      const { stock, BranchId, BookId } = req.body;
      await db.Stock.create({
        stock,
        BranchId,
        BookId,
      });
      return await db.Stock.findAll().then((result) => {
        res.send(result);
      });
    } catch (err) {
      console.log(err);
      return res.status(500).send({
        message: err.message,
      });
    }
  },
  deleteStock: async (req, res) => {
    try {
      await db.Stock.destroy({
        where: {
          //  id: req.params.id

          //   [Op.eq]: req.params.id

          id: req.params.id,
        },
      });
      return await db.Stock.findAll().then((result) => res.send(result));
    } catch (err) {
      console.log(err.message);
      return res.status(500).send({
        error: err.message,
      });
    }
  },
};

module.exports = stockController;
