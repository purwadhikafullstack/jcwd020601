const db = require("../models");
const Sequelize = require("sequelize");
const { Op, sequelize } = db.Sequelize;
const moment = require("moment");
const t = require("../helpers/transaction");

const categoryController = {
  getAll: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 0;
      const limit = parseInt(req.query.limit) || 10;
      const search = req.query.search_query || "";
      const offset = limit * page;
      const totalRows = await db.Category.count({
        where: {
          [Op.or]: [
            {
              Category: {
                [Op.like]: "%" + search + "%",
              },
            },
            // {
            // 	language: {
            // 		[Op.like]: "%" + search + "%",
            // 	},
            // },
          ],
        },
      });
      const totalPage = Math.ceil(totalRows / limit);
      const result = await db.Category.findAll({
        where: {
          [Op.or]: [
            {
              Category: {
                [Op.like]: "%" + search + "%",
              },
            },
            // {
            // 	language: {
            // 		[Op.like]: "%" + search + "%",
            // 	},
            // },
          ],
        },
        offset: offset,
        limit: limit,
        order: [["id"]],
      });
      res.json({
        result: result,
        page: page,
        limit: limit,
        totalRows: totalRows,
        totalPage: totalPage,
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
      const Category = await db.Category.findOne({
        where: {
          id: req.params.id,
        },
      });
      return res.send(Category);
    } catch (err) {
      console.log(err.message);
      res.status(500).send({
        message: err.message,
      });
    }
  },
  editCategory: async (req, res) => {
    try {
      const { category } = req.body;
      // create transaction
      const transaction = await t.create();
      if (!transaction.status && transaction.error) {
        throw transaction.error;
      }
      await db.Category.update(
        {
          category,
        },
        {
          where: {
            id: req.params.id,
          },
        },
        {
          transaction: transaction.data,
        }
      );
      const commit = await t.commit(transaction.data);
      if (!commit.status && commit.error) {
        throw commit.error;
      }
      return await db.Category.findOne(
        {
          where: {
            id: req.params.id,
          },
        },
        {
          transaction: transaction.data,
        }
      ).then((result) => res.send(result));
    } catch (err) {
      console.log(err.message);
      res.status(500).send({
        message: err.message,
      });
    }
  },
  insertCategory: async (req, res) => {
    try {
      const { category } = req.body;
      // transaction
      const transaction = await t.create();
      if (!transaction.status && transaction.error) {
        throw transaction.error;
      }
      await db.Category.create(
        {
          category,
        },
        { transaction: transaction.data }
      );
      const commit = await t.commit(transaction.data);
      if (!commit.status && commit.error) {
        throw commit.error;
      }
      return await db.Category.findAll().then((result) => {
        res.send(result);
      });
    } catch (err) {
      console.log(err);

      return res.status(500).send({
        message: err.message,
      });
    }
  },
  deleteCategory: async (req, res) => {
    try {
      const transaction = await t.create();
      await db.Category.destroy(
        {
          where: {
            //  id: req.params.id

            //   [Op.eq]: req.params.id

            id: req.params.id,
          },
        },
        {
          transaction: transaction.data,
        }
      );
      const commit = await t.commit(transaction.data);
      if (!commit.status && commit.error) {
        throw commit.error;
      }
      return await db.Category.findAll().then((result) => res.send(result));
    } catch (err) {
      console.log(err.message);
      return res.status(500).send({
        error: err.message,
      });
    }
  },
};

module.exports = categoryController;
