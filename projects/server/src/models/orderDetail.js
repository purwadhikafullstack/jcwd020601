module.exports = (sequelize, Sequelize) => {
  const OrderDetail = sequelize.define(
    "OrderDetails",
    {
      quantity: Sequelize.INTEGER,
      price: Sequelize.INTEGER,
    },
    {
      paranoid: true,
    }
  );
  return OrderDetail;
};
