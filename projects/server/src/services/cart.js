const db = require("../models");

module.exports = {
  getCartUserId: async (body) => {
    try {
      const { UserId, BranchId } = body;
      return await db.Cart.findAll({
        where: {
          UserId,
        },
        raw: true,
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
};
