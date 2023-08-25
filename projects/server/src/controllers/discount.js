const db = require("../models");
const Sequelize = require("sequelize");
const { Op } = db.Sequelize;
const moment = require("moment");
const t = require("../helpers/transaction");
const discountServices = require("../services").discountServices;
const discountController = {
  getAll: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 0;
      const limit = parseInt(req.query.limit) || 10;
      const search = req.query.search_query || "";
      const place = req.query.place;
      const discountData = await discountServices.getAll(
        page,
        limit,
        search,
        place
      );
      res.send(discountData);
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
      const discountData = await discountServices.getById(id);
      res.json({
        result: discountData,
        message: "success get detail",
      });
    } catch (err) {
      console.log(err.message);
      res.status(500).send({
        message: err.message,
      });
    }
  },
  editDiscount: async (req, res) => {
    const transaction = await t.create();
    try {
      const discountData = await discountServices.editDiscount(
        req.params.id,
        req.body,
        transaction.data
      );

      const commit = await t.commit(transaction.data);
      if (!commit.status && commit.error) {
        throw commit.error;
      }
      res.json({
        result: discountData,
        message: "success update data",
      });
    } catch (err) {
      console.log(err.message);
      res.status(500).send({
        message: err.message,
      });
    }
  },
  insertDiscount: async (req, res) => {
    const transaction = await t.create();
    try {
      const discountData = await discountServices.insertDiscount(
        req.body,
        transaction.data
      );
      const commit = await t.commit(transaction.data);
      if (!commit.status && commit.error) {
        throw commit.error;
      }
      res.json({
        result: discountData,
        message: "Success Added",
      });
    } catch (err) {
      console.log(err);
      return res.status(500).send({
        message: err.message,
      });
    }
  },
  deleteDiscount: async (req, res) => {
    const transaction = await t.create();
    try {
      const discountData = await discountServices.deleteDiscount(
        req.params.id,
        transaction.data
      );
      const commit = await t.commit(transaction.data);
      if (!commit.status && commit.error) {
        throw commit.error;
      }
      res.json({
        result: discountData,
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

module.exports = discountController;
