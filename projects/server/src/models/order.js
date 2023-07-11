module.exports = (sequelize, Sequelize) => {
  const Order = sequelize.define(
    "Orders",
    {
      payment_url: Sequelize.TEXT,
      status: Sequelize.STRING,
      total: Sequelize.INTEGER,
    },
    {
      paranoid: true,
    }
  );
  return Order;
};
