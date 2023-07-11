"use strict";

const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const process = require("process");
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || "development";
const config = require(__dirname + "/../config/config.js")[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config
  );
}

fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf(".") !== 0 &&
      file !== basename &&
      file.slice(-3) === ".js" &&
      file.indexOf(".test.js") === -1
    );
  })
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(
      sequelize,
      Sequelize.DataTypes
    );
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;
db.Address = require("./address")(sequelize, Sequelize);
db.Admin = require("./admin")(sequelize, Sequelize);
db.Book = require("./book")(sequelize, Sequelize);
db.Branch = require("./branch")(sequelize, Sequelize);
db.Cart = require("./cart")(sequelize, Sequelize);
db.Category = require("./category")(sequelize, Sequelize);
db.Discount = require("./discount")(sequelize, Sequelize);
db.Order = require("./order")(sequelize, Sequelize);
db.OrderDetail = require("./orderDetail")(sequelize, Sequelize);
db.Stock = require("./stock")(sequelize, Sequelize);
db.StockHistory = require("./stockHistory")(sequelize, Sequelize);
db.User = require("./user")(sequelize, Sequelize);
db.Voucher = require("./voucher")(sequelize, Sequelize);
db.Token = require("./token")(sequelize, Sequelize);
db.Address.belongsTo(db.User, {
  foreignKey: "userId",
});
db.Stock.belongsTo(db.Branch, {
  foreignKey: "branchId",
});
db.OrderDetail.belongsTo(db.Order, {
  foreignKey: "orderId",
});
db.Category.hasMany(db.Book);
db.Book.belongsTo(db.Category);
db.Book.belongsTo(db.Discount, {
  foreignKey: "discountId",
});
db.Discount.belongsTo(db.Branch, {
  foreignKey: "branchId",
});
db.StockHistory.belongsTo(db.Stock, {
  foreignKey: "stockId",
});
db.User.hasOne(db.Token);
db.Token.belongsTo(db.User);
db.Book.hasOne(db.Stock);
db.Stock.belongsTo(db.Book);

db.Cart.belongsTo(db.Stock, {
  foreignKey: "stockId",
});
db.Branch.hasOne(db.Admin);
db.Admin.belongsTo(db.Branch);
db.User.hasOne(db.Cart);
db.Cart.belongsTo(db.User);
db.Order.belongsTo(db.User, {
  foreignKey: "userId",
});
db.Address.hasOne(db.Order);
db.Order.belongsTo(db.Address);
db.Order.belongsTo(db.Branch, {
  foreignKey: "branchId",
});
db.Address.hasOne(db.Order);
db.OrderDetail.belongsTo(db.Stock);
module.exports = db;
