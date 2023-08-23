module.exports = (sequelize, Sequelize) => {
  const Order = sequelize.define(
    "Orders",
    {
      payment_url: Sequelize.TEXT,
      status: Sequelize.ENUM(
        "waiting for payment",
        "waiting for payment confirmation",
        "process",
        "sending",
        "delivery confirm",
        "canceled"
      ),
      total: Sequelize.INTEGER,
      shipping: Sequelize.INTEGER,
      courier: Sequelize.STRING,
      weight: Sequelize.INTEGER,
      TransactionId: Sequelize.STRING,
    },
    {
      paranoid: true,
    }
  );
  return Order;
};
