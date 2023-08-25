const db = require("../models");
const Sequelize = require("sequelize");
const { Op } = db.Sequelize;
const moment = require("moment");
const t = require("../helpers/transaction");
// const stock = require("../models/stock");
const stockServices = require("../services").stockServices;
const stockController = {
  getAllAsc: async (req, res) => {
    console.log("masuk");
    try {
      const l = parseInt(req.query.limit);
      const limit = l || null;
      const place = req.query.place || 1;
      const search = req.query.search_book || "";
      const stockData = await stockServices.getAllAsc(limit, place, search);
      res.json({
        result: stockData,
        message: "success get stock /",
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
      const place = req.query.place || 1;
      const stockData = await stockServices.getAllDesc(place, limit);
      res.json({
        result: stockData,
        limit: limit,
        message: "success get stock /Desc",
      });
    } catch (err) {
      console.log(err.message);
      res.status(500).send({
        message: err.message,
      });
    }
  },
  getAll: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 0;
      const limit = parseInt(req.query.limit) || 10;
      const search = req.query.search_query || "";
      const place = req.query.place;
      const stockData = await stockServices.getAll(page, limit, search, place);

      // const offset = limit * page;
      // const totalRows = await db.Stock.count({
      //   // search: req.query.search_stock || "Demotivasi",
      //   include: [
      //     {
      //       model: db.Book,
      //       where: {
      //         title: {
      //           [Op.like]: "%" + search + "%",
      //         },
      //       },
      //     },
      //   ],
      // });
      // const totalPage = Math.ceil(totalRows / limit);
      // const result = await db.Stock.findAll({
      //   include: [
      //     {
      //       model: db.Book,
      //       where: {
      //         title: {
      //           [Op.like]: "%" + search + "%",
      //         },
      //       },
      //     },
      //     {
      //       model: db.Branch,
      //     },
      //   ],
      //   offset: offset,
      //   limit: limit,
      //   order: [["id"]],
      // });

      // return res.json({
      //   result: result,
      //   limit: limit,
      //   page: page,
      //   totalRows: totalRows,
      //   totalPage: totalPage,
      // });
      res.send(stockData);
    } catch (err) {
      console.log(err.message);
      res.status(500).send({
        message: err.message,
      });
    }
  },
  getById: async (req, res) => {
    try {
      const stockData = await stockServices.getById(req.params.id);
      return res.send(stockData);
    } catch (err) {
      console.log(err.message);
      res.status(500).send({
        message: err.message,
      });
    }
  },
  getPrice: async (req, res) => {
    try {
      const place = req.query.place || 2;
      const price = req.query.price || null;
      const category = req.query.category || null;
      const priceData = await stockServices.getPrice(place, price, category);
      return res.send(priceData);
    } catch (err) {
      console.log(err.message);
      res.status(500).send({
        message: err.message,
      });
    }
  },
  editStock: async (req, res) => {
    const transaction = await t.create();
    try {
      const stockData = await stockServices.editStock(
        req.params.id,
        req.body,
        transaction.data
      );
      const commit = await t.commit(transaction.data);
      if (!commit.status && commit.error) {
        throw commit.error;
      }

      // const stockUpdates = req.body.stockUpdates;

      // const updatedStocks = await Promise.all(
      //   stockUpdates.map(async (update) => {
      //     const { stock, BranchId, BookId, ...updateData } = update;

      //     // Find the existing stock
      //     const existingStock = await db.Stock.findOne({
      //       where: {
      //         BranchId,
      //         BookId,
      //       },
      //     });

      //     if (existingStock) {
      //       // Update the stock with the values from the update
      //       return existingStock.update(updateData);
      //     } else {
      //       // Create a new stock entry
      //       return db.Stock.create({
      //         stock,
      //         BranchId,
      //         BookId,
      //         ...updateData,
      //       });
      //     }
      //   })
      // );

      // res.send(updatedStocks);

      // let result = await db.Stock.findOne({
      //   where: {
      //     id: req.params.id,
      //   },
      // });
      res.json({
        result: stockData,
        message: "success updated",
      });
    } catch (err) {
      console.log(err.message);
      res.status(500).send({
        message: err.message,
      });
    }
  },
  insertStock: async (req, res) => {
    const transaction = await t.create();
    try {
      const stockData = await stockServices.insertStock(
        req.body,
        transaction.data
      );
      const commit = await t.commit(transaction.data);
      if (!commit.status && commit.error) {
        throw commit.error;
      }
      res.send(stockData);
    } catch (err) {
      console.log(err);
      return res.status(500).send({
        message: err.message,
      });
    }
  },
  deleteStock: async (req, res) => {
    const transaction = await t.create();
    try {
      const stockData = await stockServices.deleteStock(
        req.params.id,
        transaction.data
      );
      const commit = await t.commit(transaction.data);
      if (!commit.status && commit.error) {
        throw commit.error;
      }
      res.send(stockData);
    } catch (err) {
      console.log(err.message);
      return res.status(500).send({
        error: err.message,
      });
    }
  },
};

module.exports = stockController;
