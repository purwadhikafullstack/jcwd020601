module.exports = (sequelize, Sequelize) => {
  const StockHistory = sequelize.define(
    "StockHistories",
    {
      subject: Sequelize.ENUM("transaction", "update"),
      type: Sequelize.ENUM("plus", "minus"),
      quantity: Sequelize.INTEGER,
      totalBefore: Sequelize.INTEGER,
      totalAfter: Sequelize.INTEGER,
    },
    {
      paranoid: true,
    }
  );
  return StockHistory;
};
