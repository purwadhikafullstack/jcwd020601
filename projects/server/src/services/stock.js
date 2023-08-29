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
            required: true, // Inner join
          },
          {
            model: db.Branch,
            required: true, // Inner join
          },
          {
            model: db.Discount,
            // required: true, // Inner join
          },
        ],
      });
      return Stock;
    } catch (err) {
      throw err;
    }
  },
  getPrice: async (place, price, category, page, limit) => {
    try {
      const offset = limit * page;
      const orderConfig = [];
      if (price !== null && price !== undefined) {
        orderConfig.push([db.Book, "price", price]);
      }
      const totalRows = await db.Stock.count({
        include: [
          {
            model: db.Book,
            required: true,
            include: category
              ? [
                  {
                    model: db.Category,
                    required: true,
                    where: {
                      id: category,
                    },
                  },
                ]
              : [],
          },
        ],
        where: {
          [Op.and]: [
            {
              BranchId: place,
            },
          ],
        },
      });
      const totalPage = Math.ceil(totalRows / limit);
      const Stock = await db.Stock.findAll({
        include: [
          {
            model: db.Book,
            required: true, // Inner join
            include: category
              ? [
                  {
                    model: db.Category,
                    required: true,
                    where: {
                      id: category,
                    },
                  },
                ]
              : [],
          },
          {
            model: db.Branch,
            required: true, // Inner join
          },
          {
            model: db.Discount,
            // required: true, // Inner join
          },
        ],
        where: {
          [Op.and]: [{ BranchId: place }],
        },
        order: orderConfig,
        limit: limit,
        offset: offset,
      });

      return {
        Stock,
        page,
        limit,
        totalRows,
        totalPage,
      };
    } catch (err) {
      throw err;
    }
  },
  insertStock: async ({ stock, BranchId, BookId, DiscountId }, transaction) => {
    try {
      const data = await db.Stock.create(
        {
          stock,
          BranchId,
          BookId,
          DiscountId,
        }
        // {
        //   transaction: transaction,
        // }
      );
      await db.StockHistory.create({
        subject: "update",
        type: "plus",
        quantity: stock,
        totalBefore: 0,
        totalAfter: stock,
        StockId: data.id,
      });
      let result = await db.Stock.findOne({
        where: {
          id: data.id,
        },
      });
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
      const Stock = await db.Stock.findOne({
        where: {
          id: id,
        },
      });

      const data = await db.Stock.update(
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
      let types;
      if (stock >= Stock.stock) {
        types = "plus";
      } else {
        types = "minus";
      }
      await db.StockHistory.create({
        subject: "update",
        type: types,
        quantity: stock,
        totalBefore: Stock.stock,
        totalAfter: stock,
        StockId: id,
      });
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
