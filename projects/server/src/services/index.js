const bookServices = require("./book");
const categoryServices = require("./category");
const discountServices = require("./diskon");
const stockServices = require("./stock");
const addressServices = require("./address");
const fetchAdmin = require("./admin.js/fetchAdmin.js");
const adminHandlers = require("./admin.js/adminHandlers");
const fetchUser = require("./user.js/fetchUser");
const userHandlers = require("./user.js/userHandlers");
const orderTransactionServices = require("./order/transaction");
const orderReportServices = require("./order/report");
const stockHistoryServices = require("./stockHistory");
const orderDetailServices = require("./orderDetail");
const cartServices = require("./cart");

module.exports = {
  bookServices,
  categoryServices,
  discountServices,
  stockServices,
  stockHistoryServices,
  addressServices,
  adminServices: { ...fetchAdmin, ...adminHandlers },
  userServices: { ...fetchUser, ...userHandlers },
  orderServices: {
    ...orderTransactionServices,
    ...orderReportServices,
  },
  orderDetailServices,
  cartServices,
};
