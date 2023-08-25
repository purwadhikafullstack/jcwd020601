module.exports = (sequelize, Sequelize) => {
  const Stock = sequelize.define(
    "Stocks",
    {
      stock: Sequelize.INTEGER,
      bucket: Sequelize.INTEGER,
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
      indexes: [
        {
          unique: true,
          fields: ["BranchId", "BookId"], // Add the unique constraint on the composite key
        },
      ],
    }
  );
  return Stock;
};
