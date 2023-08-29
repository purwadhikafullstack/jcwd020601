const db = require("../models");

module.exports = {
  getStockHistory: async (body) => {
    try {
      const { StockId } = body;
      return await db.StockHistory.findOne({
        where: {
          StockId,
        },
        order: [
          ["createdAt", "DESC"], // Order by createdAt in descending order
        ],
      });
    } catch (error) {
      return error;
    }
  },
  createStockHistory: async (body) => {
    try {
      const { updatedStock, quantity, tB, StockId } = body;
      console.log({ tB, updatedStock, quantity, StockId });
      return await db.StockHistory.create(
        {
          StockId,
          totalBefore: tB,
          totalAfter: updatedStock,
          quantity: quantity,
          type: "minus",
          subject: "transaction",
        },
        { transaction: body.trans }
      );
    } catch (error) {
      return error;
    }
  },
};
