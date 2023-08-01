const db = require("../models");
const Sequelize = require("sequelize");
const bookImage = process.env.URL_BOOK_PROD;
const { Op } = db.Sequelize;
const moment = require("moment");
const bookController = {
  getAll: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 0;
      const limit = parseInt(req.query.limit) || 10;
      const search = req.query.search_query || "";
      const offset = limit * page;
      const totalRows = await db.Book.count({
        where: {
          [Op.or]: [
            {
              title: {
                [Op.like]: "%" + search + "%",
              },
            },
            {
              language: {
                [Op.like]: "%" + search + "%",
              },
            },
          ],
        },
      });
      const totalPage = Math.ceil(totalRows / limit);
      const result = await db.Book.findAll({
        where: {
          [Op.or]: [
            {
              title: {
                [Op.like]: "%" + search + "%",
              },
            },
            {
              language: {
                [Op.like]: "%" + search + "%",
              },
            },
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
      const Book = await db.Book.findOne({
        where: {
          id: req.params.id,
        },
      });
      return res.send(Book);
    } catch (err) {
      console.log(err.message);
      res.status(500).send({
        message: err.message,
      });
    }
  },
  editBook: async (req, res) => {
    try {
      const {
        title,
        language,
        publish_date,
        author,
        publisher,
        description,
        pages,
        weight,
        dimension,
        price,
        rating,
        CategoryId,
        DiscountId,
      } = req.body;
      const { filename } = req.file;
      console.log(filename);
      await db.Book.update(
        {
          title,
          language,
          publish_date,
          author,
          publisher,
          description,
          book_url: bookImage + filename,
          pages,
          weight,
          dimension,
          price,
          rating,
          CategoryId,
          DiscountId,
        },
        {
          where: {
            id: req.params.id,
          },
        }
      );
      return await db.Book.findOne({
        where: {
          id: req.params.id,
        },
      }).then((result) =>
        res.json({
          result: result,
          message: "success updated",
        })
      );
    } catch (err) {
      console.log(err.message);
      res.status(500).send({
        message: err.message,
      });
    }
  },
  insertBook: async (req, res) => {
    try {
      const {
        title,
        language,
        publish_date,
        author,
        publisher,
        description,
        pages,
        weight,
        dimension,
        price,
        rating,
      } = req.body;
      const { filename } = req.file;
      await db.Book.create({
        title,
        language,
        publish_date,
        author,
        publisher,
        description,
        book_url: bookImage + filename,
        pages,
        weight,
        dimension,
        price,
        rating,
        // CategoryId,
      });

      return res.send({ message: "success added new product" });

      // return await db.Book.findAll().then((result) => {
      // 	res.send(result);
      // });
    } catch (err) {
      console.log(err);
      return res.status(500).send({
        message: err.message,
      });
    }
  },
  deleteBook: async (req, res) => {
    try {
      await db.Book.destroy({
        where: {
          //  id: req.params.id

          //   [Op.eq]: req.params.id

          id: req.params.id,
        },
      });
      return await db.Book.findAll().then((result) => res.send(result));
    } catch (err) {
      console.log(err.message);
      return res.status(500).send({
        error: err.message,
      });
    }
  },
};

module.exports = bookController;
