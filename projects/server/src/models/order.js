module.exports = (sequelize, Sequelize) => {
  const Order = sequelize.define(
    "Orders",
    {
      payment_url: Sequelize.TEXT,
      status: Sequelize.ENUM("init", "cancel", "payed", "delivery", "done"),
      total: Sequelize.INTEGER,
      shipping: Sequelize.INTEGER,
      weight: Sequelize.INTEGER,
    },
    {
      paranoid: true,
    }
  );
  return Order;
};
