module.exports = (sequelize, Sequelize) => {
  const Cart = sequelize.define("Carts", {
    quantity: Sequelize.INTEGER,
  });
  return Cart;
};
