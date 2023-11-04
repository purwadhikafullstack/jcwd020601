const db = require("../models");
const Sequelize = require("sequelize");
const bookImage = process.env.URL_BOOK_PROD;
const bookServices = require("../services").bookServices;
const { Op } = db.Sequelize;
const moment = require("moment");
const t = require("../helpers/transaction");
const bookController = {
  getAll: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 0;
      const limit = parseInt(req.query.limit) || 10;
      const search = req.query.search_query || "";
      const category = req.query.category || null;
      const list = req.query.list || null;
      const bookData = await bookServices.getAll(
        page,
        limit,
        search,
        category,
        list
      );
      return res.json({
        value: bookData,
        message: "success get detail",
      });
    } catch (err) {
      res.status(500).send({
        message: err.message,
      });
    }
  },
  getAllBook: async (req, res) => {
    try {
      const result = await bookServices.getAllBook();
      return res.json(result);
    } catch (err) {
      res.status(500).send({
        message: err.message,
      });
    }
  },
  getById: async (req, res) => {
    try {
      const id = req.params.id;
      const result = await bookServices.getById(id);
      return res.json({
        value: result,
        message: "success get detail",
      });
    } catch (err) {
      res.status(500).send({
        message: err.message,
      });
    }
  },
  editBook: async (req, res) => {
    const transaction = await t.create();
    try {
      const { filename } = req.file;
      const updateBook = await bookServices.editBook(
        req.params.id,
        req.body,
        filename,
        transaction.data
      );

      const commit = await t.commit(transaction.data);
      if (!commit.status & commit.error) {
        throw commit.error;
      }
      res.json({
        result: updateBook,
        message: "success updated",
      });
    } catch (err) {
      // console.log(err.message);
      await t.rollback(transaction.data);
      res.status(500).send({
        message: err.message,
      });
    }
  },
  insertBook: async (req, res) => {
    const transaction = await t.create();
    try {
      const { filename } = req.file;
      const insertBook = await bookServices.insertBook(
        req.body,
        filename,
        transaction.data
      );
      const commit = await t.commit(transaction.data);
      if (!commit.status && commit.error) {
        throw commit.error;
      }

      res.json({
        result: insertBook,
        message: "success added data",
      });
    } catch (err) {
      console.log(err);
      return res.status(500).send({
        message: err.message,
      });
    }
  },
  deleteBook: async (req, res) => {
    const transaction = await t.create();
    try {
      const deleteBook = await bookServices.deleteBook(
        req.params.id,
        transaction
      );
      const commit = await t.commit(transaction.data);
      if (!commit.status && commit.error) {
        throw commit.error;
      }
      res.json({
        result: deleteBook,
        message: "Success deleted",
      });
    } catch (err) {
      console.log(err.message);
      return res.status(500).send({
        error: err.message,
      });
    }
  },
};

module.exports = bookController;
