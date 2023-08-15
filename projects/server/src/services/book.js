const db = require("../models");
const { Op } = db.Sequelize;
const bookImage = process.env.URL_BOOK_PROD;
const bookServices = {
  getAll: async (page, limit, search) => {
    try {
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
        include: [{ model: db.Discount }, { model: db.Category }],
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
      return {
        result,
        page,
        limit,
        totalRows,
        totalPage,
      };
    } catch (err) {
      throw err;
    }
  },
  getAllBook: async () => {
    try {
      const all = await db.Book.findAll();
      return all;
    } catch (err) {
      throw err;
    }
  },
  getById: async (id) => {
    try {
      const Book = await db.Book.findOne({
        include: [{ model: db.Discount }],
        where: {
          id: id,
        },
      });
      return Book;
    } catch (err) {
      throw err;
    }
  },
  editBook: async (
    id,
    {
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
    },
    filename,
    transaction
  ) => {
    try {
      // const bookImage = "http://localhost:2000/bookImage/";
      // console.log("this is" + filename);
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
            id: id,
          },
        },
        {
          transaction: transaction,
        }
      );
      const updateBook = await db.Book.findOne({
        where: {
          id: id,
        },
        transaction: transaction,
      });

      return updateBook;
    } catch (err) {
      throw err;
    }
  },
  insertBook: async (
    {
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
      // DiscountId,
      CategoryId,
    },
    filename,
    transaction
  ) => {
    try {
      const result = await db.Book.create(
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
          // DiscountId,
        },
        {
          transaction: transaction,
        }
      );
      return result;
    } catch (err) {
      throw err;
    }
  },
  deleteBook: async (id, transaction) => {
    try {
      await db.Book.destroy(
        {
          where: {
            id: id,
          },
        },
        {
          transaction: transaction.data,
        }
      );
      let result = await db.Book.findAll();
      return result;
    } catch (err) {
      throw err;
    }
  },
};

module.exports = bookServices;