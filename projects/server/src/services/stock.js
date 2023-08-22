const db = require("../models");
const Sequelize = require("sequelize");
const { Op } = db.Sequelize;

const stockServices = {
  getAllAsc: async (limit, place, search) => {
    try {
      const Stock = await db.Stock.findAll({
        include: [
          {
            model: db.Book,
            // include: [db.Discount],
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
            // where: { id: place },
          },
          {
            model: db.Discount,
            // where: { id: place },
          },
        ],
        where: {
          BranchId: place,
        },
        limit: limit,
        order: [["id", "ASC"]],
      });
      return Stock;
    } catch (err) {
      throw err;
    }
  },
  getAllDesc: async (place, limit) => {
    const Stock = await db.Stock.findAll({
      include: [
        {
          model: db.Book,
          required: true, // Inner join
        },
        {
          model: db.Branch,
          required: true, // Inner join
          where: { id: place },
        },
        {
          model: db.Discount,
          // where: { id: place },
        },
      ],
      limit: limit,
      order: [["id", "DESC"]],
    });
    return Stock;
  },
  getAll: async (page, limit, search, place) => {
    try {
      const offset = limit * page;
      const totalRows = await db.Stock.count({
        // search: req.query.search_stock || "Demotivasi",
        include: [
          {
            model: db.Book,
            where: {
              title: {
                [Op.like]: "%" + search + "%",
              },
            },
          },
          {
            model: db.Branch,
          },
          {
            model: db.Discount,
          },
        ],
        where: {
          BranchId: place,
        },
      });
      const totalPage = Math.ceil(totalRows / limit);
      const result = await db.Stock.findAll({
        include: [
          {
            model: db.Book,
            where: {
              title: {
                [Op.like]: "%" + search + "%",
              },
            },
          },
          {
            model: db.Branch,
          },
          {
            model: db.Discount,
          },
        ],
        where: {
          BranchId: place,
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
      // return result2;
    } catch (err) {
      throw err;
    }
  },
  getById: async (id) => {
    try {
      const Stock = await db.Stock.findOne({
        where: {
          id: id,
        },
        include: [
          {
            model: db.Book,
            // include: [db.Discount],
            required: true, // Inner join
          },
          {
            model: db.Branch,
            required: true, // Inner join
          },
          {
            model: db.Discount,
            required: true,
          },
        ],
      });
      return Stock;
    } catch (err) {
      throw err;
    }
  },
  insertStock: async ({ stock, BranchId, BookId, DiscountId }, transaction) => {
    try {
      // const data =
      await db.Stock.create(
        {
          stock,
          BranchId,
          BookId,
          DiscountId,
        },
        {
          transaction: transaction,
        }
      );
      // add to stockHistory
      // await db.StockHistory.create({
      //   StockId: data.id,
      // });
      let result = await db.Stock.findAll();
      return result;
    } catch (err) {
      throw err;
    }
  },
  editStock: async (
    id,
    { stock, BranchId, BookId, DiscountId },
    transaction
  ) => {
    try {
      await db.Stock.update(
        {
          stock,
          BranchId,
          BookId,
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
      let result = await db.Stock.findOne({
        where: {
          id: id,
        },
      });
      return result;
    } catch (err) {
      throw err;
    }
  },
  deleteStock: async (id, transaction) => {
    try {
      await db.Stock.destroy(
        {
          where: {
            id: id,
          },
        },
        {
          transaction: transaction,
        }
      );
      let result = db.Stock.findAll();
      return result;
    } catch (err) {
      throw err;
    }
  },
};

module.exports = stockServices;
