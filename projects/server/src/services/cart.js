const db = require("../models");

module.exports = {
  getCartUserId: async (body) => {
    try {
      const { UserId, BranchId, raw } = body;
      return await db.Cart.findAll({
        where: {
          UserId,
        },
        raw,
        include: [
          {
            model: db.Stock,
            required: true,
            where: {
              BranchId,
            },
            include: [
              {
                model: db.Book,
                required: true,
              },
              {
                model: db.Discount,
                required: false,
              },
              {
                model: db.Branch,
                required: true,
              },
            ],
          },
        ],
      });
    } catch (error) {
      return error;
    }
  },
  destroyCart: async (body) => {
    try {
      const { UserId } = body;
      await db.Cart.destroy({
        where: {
          UserId,
        },
        transaction: body.trans,
      });
    } catch (error) {
      return error;
    }
  },
  destroyCartId: async (body) => {
    try {
      console.log("HAPUS CART");
      const { id, trans } = body;
      return await db.Cart.destroy({
        where: {
          id,
        },
        transaction: trans,
      });
    } catch (error) {
      return error;
    }
  },
  getOneCart: async (body) => {
    try {
      const { id } = body;
      return await db.Cart.findOne({
        where: {
          id,
        },
      });
    } catch (error) {
      return error;
    }
  },
  getCartStockIdUserId: async (body) => {
    try {
      const { StockId, UserId } = body;
      return await db.Cart.findOne({
        where: {
          StockId,
          UserId,
        },
      });
    } catch (error) {
      return error;
    }
  },
  updateCart: async (body) => {
    try {
      const { quantity, id, trans } = body;
      return await db.Cart.update(
        {
          quantity,
        },
        {
          where: {
            id,
          },
          transaction: trans,
        }
      );
    } catch (error) {
      return error;
    }
  },
  updateCartById: async (body) => {
    try {
      const { k, StockId, UserId, trans } = body;
      return await db.Cart.update(
        {
          quantity: k,
        },
        {
          where: {
            StockId,
            UserId,
          },
          transaction: trans,
        }
      );
    } catch (error) {
      return error;
    }
  },
  insertCart: async (body) => {
    try {
      const { qty, UserId, StockId, trans } = body;
      return await db.Cart.create(
        {
          quantity: qty,
          UserId,
          StockId,
        },
        { transaction: trans }
      );
    } catch (error) {
      return error;
    }
  },
  getQty: async (body) => {
    try {
      const { UserId } = body;
      return await db.Cart.findAndCountAll({
        where: {
          UserId,
        },
      });
    } catch (error) {}
  },
};
