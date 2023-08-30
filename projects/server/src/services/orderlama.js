const db = require("../models");
const { nanoid } = require("nanoid");

module.exports = {
  createOrder: async (body) => {
    try {
      // Invoice Code
      const code = nanoid(8).toUpperCase();
      const invoiceCode = "INV-" + code;
      const { total, UserId, BranchId, AddressId, shipping, courier, weight } =
        body;

      return await db.Order.create(
        {
          status: "waiting for payment",
          total,
          UserId,
          BranchId,
          AddressId,
          shipping,
          courier,
          weight,
          invoiceCode,
        },
        { transaction: body.trans }
      );
    } catch (error) {
      return error;
    }
  },
  uploadPayment: async (body) => {
    try {
      const { payment_url, id } = body;
      return await db.Order.update(
        {
          payment_url,
        },
        {
          where: {
            id,
          },
          transaction: body.trans,
        }
      );
    } catch (error) {
      return error;
    }
  },
  deletePayment: async (body) => {
    try {
      const { id } = body;
      return await db.Order.update(
        {
          payment_url: null,
        },
        {
          where: {
            id,
          },
          transaction: body.trans,
        }
      );
    } catch (error) {
      return error;
    }
  },
  getOrder: async (body) => {
    try {
      const { OrderId } = body;
      return await db.Order.findOne({
        where: {
          id: OrderId,
        },
      });
    } catch (error) {
      return error;
    }
  },
  updateStatus: async (body) => {
    try {
      const { OrderId, status } = body;
      return await db.Order.update(
        {
          status,
        },
        {
          where: {
            id: OrderId,
          },
          transaction: body.trans,
        }
      );
    } catch (error) {
      return error;
    }
  },
};
