const db = require("../models");

module.exports = {
  createOrderDetail: async (body) => {
    try {
      const { quantity, price, OrderId, StockId } = body;
      return await db.OrderDetail.create(
        {
          quantity,
          price,
          OrderId,
          StockId,
        },
        {
          transaction: body.trans,
        }
      );
    } catch (error) {
      return error;
    }
  },
  getOrderDetail: async (body) => {
    try {
      const { OrderId } = body;
      return await db.OrderDetail.findAll({
        where: {
          OrderId,
        },
      });
    } catch (error) {
      return error;
    }
  },
};
