const db = require("../../models");
const { Op } = db.Sequelize;
const Sequelize = require("sequelize");
const opencage = require("opencage-api-client");
const bcrypt = require("bcrypt");
const { nanoid } = require("nanoid");
const moment = require("moment");
const orderReportServices = {
  getByFilter: async (
    { BranchName, OrderId, status, before, after, sort, invoiceCode },
    page1,
    limit1
  ) => {
    const page = parseInt(page1) || 0;
    const limit = parseInt(limit1) || 10;
    const offset = limit * page;
    const whereClause = {
      offset: offset,
      limit: limit,
      where: {
        createdAt: {
          [Op.and]: {
            [Op.gte]: new Date(after || "1900-01-01"),
            [Op.lte]: new Date(before || "2100-10-10"),
          },
        },
      },
      include: {
        model: db.Branch,
      },
    };
    if (BranchName) {
      whereClause.include.where = { name: BranchName };
    }
    if (OrderId) {
      whereClause.where.id = OrderId;
    }
    if (invoiceCode) {
      whereClause.where.invoiceCode = invoiceCode;
    }
    if (status) {
      whereClause.where.status = status;
    }
    if (sort?.sortedBy == "branchName") {
      whereClause.order = [
        [{ model: db.Branch, as: "Branch" }, "name", sort.asc],
      ];
    } else if (sort?.sortedBy) {
      whereClause.order = [[sort.sortedBy, sort.asc]];
    } else {
      whereClause.order = [["id", sort.asc]];
    }
    const Order = await db.Order.findAll(whereClause);
    const totalRows = await db.Order.count(whereClause);
    const totalPage = Math.ceil(totalRows / limit);

    return { Order, page, limit, totalRows, totalPage };
  },
  getTotalSalesOnLastWeek: async ({ BranchId }) => {
    let sales = 0;
    let quantitySold = 0;
    const whereOrder = {
      [Op.and]: [
        { Status: "delivery confirm" },
        {
          createdAt: {
            [db.Sequelize.Op.gte]: moment()
              .subtract(1, "week")
              .startOf("day")
              .format(),
          },
        },
      ],
    };
    const whereQuantity = {
      where: {
        [Op.and]: [
          {
            createdAt: {
              [db.Sequelize.Op.gte]: moment()
                .subtract(1, "week")
                .startOf("day")
                .format(),
            },
          },
        ],
      },
    };
    const whereTransaction = {
      [Op.and]: [
        { Status: "delivery confirm" },
        {
          createdAt: {
            [db.Sequelize.Op.gte]: moment()
              .subtract(1, "week")
              .startOf("day")
              .format(),
          },
        },
      ],
    };
    if (BranchId) {
      whereOrder.BranchId = BranchId;
      whereQuantity.include = {
        model: db.Order,
        as: "Order",
        where: { BranchId },
      };
      whereTransaction.BranchId = BranchId;
    }
    const Order = await db.Order.findAll({
      where: whereOrder,
    });
    Order.map((val) => {
      sales = val.total + sales;
    });
    const quantity = await db.OrderDetail.findAll(whereQuantity);
    quantity.map((val) => {
      quantitySold = quantitySold + val.quantity;
    });
    const transaction = await db.Order.findAndCountAll({
      where: whereTransaction,
    });
    return {
      Date: "From Last Week",
      TotalSales: "Rp." + parseInt(sales).toLocaleString("id-ID"),
      TotalSold: JSON.stringify(quantitySold),
      TotalTransaction: transaction.count,
    };
  },
  getPendingByUserId: async ({ UserId }) => {
    const Order = await db.Order.findAll({
      where: {
        [Op.and]: [
          { UserId },
          {
            status: {
              [Op.or]: [
                "waiting for payment",
                "waiting for payment confirmation",
                "process",
                "sending",
              ],
            },
          },
        ],
      },
      include: {
        model: db.Address,
      },
    });
    return Order;
  },
  getHistoryByUserId: async ({ UserId }) => {
    const Order = await db.Order.findAll({
      where: {
        [Op.and]: [
          { UserId },
          { status: { [Op.or]: ["delivery confirm", "canceled"] } },
        ],
      },
      include: {
        model: db.Address,
      },
    });
    return Order;
  },
  getAllBranchOrder: async (page1, limit1) => {
    const page = parseInt(page1) || 0;
    const limit = parseInt(limit1) || 10;
    const offset = limit * page;
    const totalRows = await db.Order.count({});
    const totalPage = Math.ceil(totalRows / limit);
    const Order = await db.Order.findAll({
      offset: offset,
      limit: limit,
      include: {
        model: db.Branch,
      },
    });
    return { Order, page, limit, totalRows, totalPage };
  },
  getSalesOnTime: async (time) => {
    let total = 0;

    const today = new Date();
    const Duration = new Date(today);
    if (time == "allTime") {
      Duration.setDate(today.getDate() - 20000);
    } else if (time == "monthly") {
      Duration.setDate(today.getDate() - 30);
    } else {
      Duration.setDate(today.getDate() - 7);
    }
    const Sales = await db.Order.findAll({
      attributes: [
        [Sequelize.fn("date", Sequelize.col("createdAt")), "date"],
        [Sequelize.fn("sum", Sequelize.col("total")), "total_sales"],
      ],
      where: {
        status: "delivery confirm",
        createdAt: {
          [Sequelize.Op.between]: [Duration, today],
        },
      },
      group: [Sequelize.fn("date", Sequelize.col("createdAt"))],
      raw: true,
    });
    Sales.map((val) => {
      total = total + parseInt(val.total_sales);
    });
    total = "Rp." + parseInt(total).toLocaleString("id-ID");

    let max = Math.max(...Sales.map((item) => parseInt(item.total_sales)));
    let highest = Sales.filter((item) => parseInt(item.total_sales) === max);
    return { sales: Sales, highest: highest[0], total };
  },
  getSalesFromBranchIdOnTime: async (BranchId, time) => {
    console.log("dsakd");
    let total = 0;
    const today = new Date();
    const Duration = new Date(today);
    if (time == "allTime") {
      Duration.setDate(today.getDate() - 20000);
    } else if (time == "monthly") {
      Duration.setDate(today.getDate() - 30);
    } else {
      Duration.setDate(today.getDate() - 7);
    }
    const Sales = await db.Order.findAll({
      attributes: [
        [Sequelize.fn("date", Sequelize.col("createdAt")), "date"],
        [Sequelize.fn("sum", Sequelize.col("total")), "total_sales"],
      ],
      where: {
        BranchId,
        status: "delivery confirm",
        createdAt: {
          [Sequelize.Op.between]: [Duration, today],
        },
      },
      group: [Sequelize.fn("date", Sequelize.col("createdAt"))],
      raw: true,
    });
    Sales.map((val) => {
      total = total + parseInt(val.total_sales);
    });
    total = "Rp." + parseInt(total).toLocaleString("id-ID");
    let max = Math.max(...Sales.map((item) => parseInt(item.total_sales)));
    let highest = Sales.filter((item) => parseInt(item.total_sales) === max);

    return { sales: Sales, highest: highest[0], total };
  },
  getSalesQuantityOnTime: async (time) => {
    let total = 0;
    const today = new Date();
    const Duration = new Date(today);
    if (time == "allTime") {
      Duration.setDate(today.getDate() - 20000);
    } else if (time == "monthly") {
      Duration.setDate(today.getDate() - 30);
    } else {
      Duration.setDate(today.getDate() - 7);
    }
    const Sales = await db.OrderDetail.findAll({
      attributes: [
        [Sequelize.fn("date", Sequelize.col("createdAt")), "date"],
        [Sequelize.fn("sum", Sequelize.col("quantity")), "qty_sold"],
      ],
      where: {
        createdAt: {
          [Sequelize.Op.between]: [Duration, today],
        },
      },
      group: [Sequelize.fn("date", Sequelize.col("createdAt"))],
      raw: true,
    });
    Sales.map((val) => {
      total = total + parseInt(val.qty_sold);
    });

    let max = Math.max(...Sales.map((item) => parseInt(item.qty_sold)));
    let highest = Sales.filter((item) => parseInt(item.qty_sold) === max);

    return { sales: Sales, highest: highest[0], total };
  },
  getSalesQuantityFromBranchIdOnTime: async (BranchId, time) => {
    let total = 0;
    const today = new Date();
    const Duration = new Date(today);
    if (time == "allTime") {
      Duration.setDate(today.getDate() - 20000);
    } else if (time == "monthly") {
      Duration.setDate(today.getDate() - 30);
    } else {
      Duration.setDate(today.getDate() - 7);
    }
    const Sales = await db.OrderDetail.findAll({
      attributes: [
        [Sequelize.fn("date", Sequelize.col("OrderDetails.createdAt")), "date"],
        [Sequelize.fn("sum", Sequelize.col("quantity")), "qty_sold"],
      ],
      where: {
        createdAt: {
          [Sequelize.Op.between]: [Duration, today],
        },
      },
      group: [Sequelize.fn("date", Sequelize.col("OrderDetails.createdAt"))],
      include: {
        model: db.Order,
        as: "Order",
        where: { BranchId },
      },
      raw: true,
    });
    Sales.map((val) => {
      total = total + parseInt(val.qty_sold);
    });
    let max = Math.max(...Sales.map((item) => parseInt(item.qty_sold)));
    let highest = Sales.filter((item) => parseInt(item.qty_sold) === max);

    return { sales: Sales, highest: highest[0], total };
  },
  getTransactionOnTime: async (time) => {
    let total = 0;
    const today = new Date();
    const Duration = new Date(today);
    if (time == "allTime") {
      Duration.setDate(today.getDate() - 20000);
    } else if (time == "monthly") {
      Duration.setDate(today.getDate() - 30);
    } else {
      Duration.setDate(today.getDate() - 7);
    }
    const Sales = await db.Order.findAll({
      attributes: [
        [Sequelize.fn("date", Sequelize.col("createdAt")), "date"],
        [Sequelize.fn("count", Sequelize.col("id")), "total_transaction"],
      ],
      where: {
        status: "delivery confirm",
        createdAt: {
          [Sequelize.Op.between]: [Duration, today],
        },
      },
      group: [Sequelize.fn("date", Sequelize.col("createdAt"))],
      raw: true,
    });
    Sales.map((val) => {
      total = total + parseInt(val.total_transaction);
    });
    let max = Math.max(
      ...Sales.map((item) => parseInt(item.total_transaction))
    );
    let highest = Sales.filter(
      (item) => parseInt(item.total_transaction) === max
    );

    return { sales: Sales, highest: highest[0], total };
  },
  getTransactionFromBranchIdOnTime: async (BranchId, time) => {
    let total = 0;
    const today = new Date();
    const Duration = new Date(today);
    if (time == "allTime") {
      Duration.setDate(today.getDate() - 20000);
    } else if (time == "monthly") {
      Duration.setDate(today.getDate() - 30);
    } else {
      Duration.setDate(today.getDate() - 7);
    }
    const Sales = await db.Order.findAll({
      attributes: [
        [Sequelize.fn("date", Sequelize.col("createdAt")), "date"],
        [Sequelize.fn("count", Sequelize.col("id")), "total_transaction"],
      ],
      where: {
        BranchId,
        status: "delivery confirm",
        createdAt: {
          [Sequelize.Op.between]: [Duration, today],
        },
      },
      group: [Sequelize.fn("date", Sequelize.col("createdAt"))],
      raw: true,
    });
    Sales.map((val) => {
      total = total + parseInt(val.total_transaction);
    });
    let max = Math.max(
      ...Sales.map((item) => parseInt(item.total_transaction))
    );
    let highest = Sales.filter(
      (item) => parseInt(item.total_transaction) === max
    );
    return { sales: Sales, highest: highest[0], total };
  },
};
module.exports = orderReportServices;
