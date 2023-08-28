const bookServices = require("./book");
const categoryServices = require("./category");
const discountServices = require("./diskon");
const stockServices = require("./stock");
const addressServices = require("./address");
const fetchAdmin = require("./admin.js/fetchAdmin.js");
const adminHandlers = require("./admin.js/adminHandlers");
const fetchUser = require("./user.js/fetchUser");
const userHandlers = require("./user.js/userHandlers");

module.exports = {
  bookServices,
  categoryServices,
  discountServices,
  stockServices,
  addressServices,
  adminServices: { ...fetchAdmin, ...adminHandlers },
  userServices: { ...fetchUser, ...userHandlers },
};
