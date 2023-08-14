const db = require("../models");
const Sequelize = require("sequelize");
const { Op, sequelize } = db.Sequelize;
const moment = require("moment");
const t = require("../helpers/transaction");
const categoryServices = require("../services").categoryServices;

const categoryController = {
  getAll: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 0;
      const limit = parseInt(req.query.limit) || 10;
      const search = req.query.search_query || "";
      const categoryData = await categoryServices.getAll(page, limit, search);
      res.json(categoryData);
    } catch (err) {
      console.log(err.message);
      res.status(500).send({
        message: err.message,
      });
    }
  },
  getById: async (req, res) => {
    try {
      let id = req.params.id;
      const categoryData = await categoryServices.getById(id);
      return res.json({
        result: categoryData,
        message: "success get detail",
      });
    } catch (err) {
      console.log(err.message);
      res.status(500).send({
        message: err.message,
      });
    }
  },
  editCategory: async (req, res) => {
    const transaction = await t.create();
    try {
      const id = req.params.id;
      const categoryData = await categoryServices.editCategory(
        id,
        req.body,
        transaction.data
      );
      const commit = await t.commit(transaction.data);
      if (!commit.status && commit.error) {
        throw commit.error;
      }
      res.json({
        result: categoryData,
        message: "success updated",
      });
    } catch (err) {
      console.log(err.message);
      res.status(500).send({
        message: err.message,
      });
    }
  },
  insertCategory: async (req, res) => {
    const transaction = await t.create();
    try {
      // const { category } = req.body;
      // transaction

      const categoryData = await categoryServices.insertCategory(
        req.body,
        transaction.data
      );
      const commit = await t.commit(transaction.data);
      if (!commit.status && commit.error) {
        throw commit.error;
      }
      // if (!transaction.status && transaction.error) {
      //   throw transaction.error;
      // }
      // await db.Category.create(
      //   {
      //     category,
      //   },
      //   { transaction: transaction.data }
      // );

      // return await db.Category.findAll().then((result) => {
      //   res.send(result);
      // });
      res.json({
        result: categoryData,
        message: "success added data",
      });
    } catch (err) {
      // console.log(err);

      return res.status(500).send({
        message: err.message,
      });
    }
  },
  deleteCategory: async (req, res) => {
    const transaction = await t.create();
    try {
      let id = req.params.id;
      const categoryData = await categoryServices.deleteCategory(
        id,
        transaction.data
      );
      const commit = await t.commit(transaction.data);
      if (!commit.status && commit.error) {
        throw commit.error;
      }
      res.json({
        result: categoryData,
        message: "success Deleted",
      });
    } catch (err) {
      console.log(err.message);
      return res.status(500).send({
        error: err.message,
      });
    }
  },
};

module.exports = categoryController;
