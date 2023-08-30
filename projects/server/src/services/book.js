const db = require("../models");
const { Op } = db.Sequelize;
const bookImage = process.env.URL_BOOK_PROD;
const bookServices = {
  getAll: async (page, limit, search, category, list) => {
    try {
      const order = [];
      const offset = limit * page;
      const query = {
        model: db.Category,
        required: true,
      };
      if (category) {
        query.where = {
          id: category,
        };
      }
      if (list === "alfabet") {
        order.push(["title", "ASC"]); // ASC for ascending order, DESC for descending
      } else if (list === "highest") {
        order.push(["price", "DESC"]);
      } else if (list === "lowest") {
        order.push(["price", "ASC"]);
      } else {
        order.push(["id", "ASC"]);
      }
      const totalRows = await db.Book.count({
        include: [query],
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
        include: [query],
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
        order: order,
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
      const all = await db.Book.findAll({
        include: [{ model: db.Category }],
      });
      return all;
    } catch (err) {
      throw err;
    }
  },
  getById: async (id) => {
    try {
      const Book = await db.Book.findOne({
        // include: [{ model: db.Discount }],
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
      // DiscountId,
    },
    filename,
    transaction
  ) => {
    try {
      await db.Book.update(
        {
          title,
          language,
          publish_date,
          author,
          publisher,
          description,
          book_url: "bookImage/" + filename,
          pages,
          weight,
          dimension,
          price,
          rating,
          CategoryId,
          // DiscountId,
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
          book_url: "bookImage/" + filename,
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
