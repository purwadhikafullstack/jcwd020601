const db = require("../../models");
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
      console.log({ service: payment_url, id });
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
      console.log({ service: id });
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
  getOrderInvoice: async (body) => {
    try {
      const { invoiceCode } = body;
      return await db.Order.findOne({
        where: {
          invoiceCode,
        },
      });
    } catch (error) {
      return error;
    }
  },
  updateStatus: async (body) => {
    try {
      const { OrderId, status } = body;
      console.log({ service: status });
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
  getBranchOrder: async (body, page1, limit1) => {
    try {
      const { BranchId, status, search } = body;
      let page = parseInt(page1) || 0;
      const limit = parseInt(limit1) || 10;

      const condition = {
        BranchId,
      };

      if (status !== "all") {
        console.log("NOT ALL NOT ALL NOT ALL");
        condition.status = status;
      }

      if (search) {
        console.log("SEARCH");
        condition.invoiceCode = search;
        delete condition.status;
        page = 0;
      }

      const offset = limit * page;

      const totalRows = await db.Order.count({
        where: condition,
      });
      const totalPage = Math.ceil(totalRows / limit);

      const Order = await db.Order.findAll({
        where: condition,
        offset: offset,
        limit: limit,
        order: [
          ["createdAt", "DESC"], // Order by createdAt in descending order
        ],
      });

      return { Order, page, limit, totalRows, totalPage };
    } catch (error) {
      return error;
    }
  },
};
