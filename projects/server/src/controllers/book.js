const db = require("../models");
const Sequelize = require("sequelize");
const { Op } = db.Sequelize;
const moment = require("moment");
const bookController = {
  getAll: async (req, res) => {
    try {
      const Book = await db.Book.findAll();
      return res.send(Book);
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
        book_url,
        pages,
        weight,
        dimension,
        price,
        rating,
        CategoryId,
        DiscountId,
      } = req.body;
      await db.Book.update(
        {
          title,
          language,
          publish_date,
          author,
          publisher,
          description,
          book_url,
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
      }).then((result) => res.send(result));
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
        book_url,
        pages,
        weight,
        dimension,
        price,
        rating,
        CategoryId,
        DiscountId,
      } = req.body;
      await db.Book.create({
        title,
        language,
        publish_date,
        author,
        publisher,
        description,
        book_url,
        pages,
        weight,
        dimension,
        price,
        rating,
        CategoryId,
        DiscountId,
      });
      return await db.Book.findAll().then((result) => {
        res.send(result);
      });
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
