const db = require("../models");
const Sequelize = require("sequelize");
const { Op } = db.Sequelize;

const discountServices = {
  getAll: async (page, limit, search) => {
    try {
      const offset = limit * page;
      const totalRows = await db.Discount.count({
        where: {
          [Op.or]: [
            {
              title: {
                [Op.like]: "%" + search + "%",
              },
            },
          ],
        },
      });
      const totalPage = Math.ceil(totalRows / limit);
      const Discount = await db.Discount.findAll({
        where: {
          [Op.or]: [
            {
              title: {
                [Op.like]: "%" + search + "%",
              },
            },
          ],
        },
        offset: offset,
        limit: limit,
        order: [["id"]],
      });

      const result = {
        Discount,
        page,
        limit,
        totalRows,
        totalPage,
      };
      return result;
    } catch (err) {
      throw err;
    }
  },
  getById: async (id) => {
    try {
      const discount = await db.Discount.findOne({
        where: {
          id: id,
        },
      });
      return discount;
    } catch (err) {
      throw err;
    }
  },
  insertDiscount: async (
    { title, discount, isPercent, start, end, BranchId },
    transaction
  ) => {
    try {
      const result = await db.Discount.create(
        {
          title,
          discount,
          isPercent,
          start,
          end,
          BranchId,
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
  editDiscount: async (
    id,
    { title, discount, isPercent, start, end, BranchId },
    transaction
  ) => {
    try {
      await db.Discount.update(
        {
          title,
          discount,
          isPercent,
          start,
          end,
          BranchId,
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
      let result = await db.Discount.findOne({
        where: {
          id: id,
        },
      });
      return result;
    } catch (err) {
      throw err;
    }
  },
  deleteDiscount: async (id, transaction) => {
    try {
      await db.Discount.destroy(
        {
          where: {
            id: id,
          },
        },
        {
          transaction: transaction,
        }
      );
      let result = db.Discount.findAll();
      return result;
    } catch (err) {
      throw err;
    }
  },
};

module.exports = discountServices;
