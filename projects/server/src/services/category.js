const db = require("../models");
const { Op } = db.Sequelize;

const categoryServices = {
  getAll: async (page, limit, search) => {
    try {
      const offset = limit * page;
      const totalRows = await db.Category.count({
        where: {
          [Op.or]: [
            {
              Category: {
                [Op.like]: "%" + search + "%",
              },
            },
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
  getById: async (id) => {
    try {
      const Category = await db.Category.findOne({
        where: {
          id: id,
        },
      });
      return Category;
    } catch (err) {
      throw err;
    }
  },
  insertCategory: async ({ category }, transaction) => {
    try {
      await db.Category.create(
        {
          category,
        },
        { transaction: transaction }
      );
      let result = await db.Category.findAll();
      return result;
    } catch (err) {
      throw err;
    }
  },
  editCategory: async (id, { category }, transaction) => {
    try {
      await db.Category.update(
        {
          category,
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
      let result = await db.Category.findOne(
        {
          where: {
            id: id,
          },
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
  deleteCategory: async (id, transaction) => {
    try {
      await db.Category.destroy(
        {
          where: {
            id: id,
          },
        },
        {
          transaction: transaction,
        }
      );
      let result = await db.Category.findAll();
      return result;
    } catch (err) {
      throw err;
    }
  },
};

module.exports = categoryServices;
