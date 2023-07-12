module.exports = (sequelize, Sequelize) => {
  const Stock = sequelize.define(
    "Stocks",
    {
      stock: Sequelize.INTEGER,
      BranchId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      BookId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
    },
    {
      paranoid: true,
      primaryKey: ["BranchId", "BookId"], // Define the composite key
    }
  );
  return Stock;
};
