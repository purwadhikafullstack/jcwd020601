module.exports = (sequelize, Sequelize) => {
  const Discount = sequelize.define(
    "Discounts",
    {
      title: Sequelize.STRING,
      discount: Sequelize.INTEGER,
      isPercent: Sequelize.BOOLEAN,
      start: Sequelize.DATE,
      end: Sequelize.DATE,
    },
    {
      paranoid: true,
    }
  );
  return Discount;
};
