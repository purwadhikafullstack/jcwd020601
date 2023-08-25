module.exports = (sequelize, Sequelize) => {
  const Category = sequelize.define(
    "Categories",
    {
      category: Sequelize.STRING,
    },
    {
      paranoid: true,
    }
  );
  return Category;
};
