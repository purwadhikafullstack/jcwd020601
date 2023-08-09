const db = require("../models");
const Sequelize = require("sequelize");
const { Op } = db.Sequelize;
const moment = require("moment");
const stock = require("../models/stock");
const stockController = {
  getAllAsc: async (req, res) => {
    try {
      const limit = parseInt(req.query.limit) || 5;
      const place = req.query.place || "Jakarta";
      const search = req.query.search_book || "";
      const Stock = await db.Stock.findAll({
        include: [
          {
            model: db.Book,
            include: [db.Discount],
            required: true, // Inner join
            where: {
              [Op.or]: [
                {
                  title: {
                    [Op.like]: "%" + search + "%",
                  },
                },
              ],
            },
          },
          {
            model: db.Branch,
            required: true, // Inner join
            where: { name: place },
          },
        ],
        limit: limit,
        order: [["id", "ASC"]],
      });
      // const result = await db.Stock.findAll({
      //   include: [
      //     {
      //       model: db.Book,
      //       required: true, // Inner join
      //       where: {
      //         [Op.or]: [
      //           {
      //             title: {
      //               [Op.like]: "%" + search + "%",
      //             },
      //           },
      //         ],
      //       },
      //     },
      //     {
      //       model: db.Branch,
      //       required: true, // Inner join
      //       where: { name: place },
      //     },
      //   ],
      // });
      res.json({
        // result: result,
        result: Stock,
        limit: limit,
      });
    } catch (err) {
      console.log(err.message);
      res.status(500).send({
        message: err.message,
      });
    }
  },
  getAllDesc: async (req, res) => {
    try {
      const limit = parseInt(req.query.limit) || 4;
      const place = req.query.place || "Jakarta";
      const Stock = await db.Stock.findAll({
        include: [
          {
            model: db.Book,
            required: true, // Inner join
          },
          {
            model: db.Branch,
            required: true, // Inner join
            where: { name: place },
          },
        ],
        limit: limit,
        order: [["id", "DESC"]],
      });
      res.json({
        result: Stock,
        limit: limit,
      });
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
      const data = await db.Stock.create({
        stock,
        BranchId,
        BookId,
      });
      // add to stockHistory
      await db.StockHistory.create({
        StockId: data.id,
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
