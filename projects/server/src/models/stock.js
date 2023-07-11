module.exports = (sequelize, Sequelize) => {
  const Stock = sequelize.define(
    "Stocks",
    {
      stock: Sequelize.INTEGER,
    },
    {
      paranoid: true,
    }
  );
  return Stock;
};
