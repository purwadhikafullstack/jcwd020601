module.exports = (sequelize, Sequelize) => {
  const StockHistory = sequelize.define(
    "StockHistories",
    {
      stockIn: Sequelize.INTEGER,
      stockOut: Sequelize.INTEGER,
      totalBefore: Sequelize.INTEGER,
      totalAfter: Sequelize.INTEGER,
    },
    {
      paranoid: true,
    }
  );
  return StockHistory;
};
