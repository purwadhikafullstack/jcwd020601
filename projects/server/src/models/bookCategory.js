module.exports = (sequelize, Sequelize) => {
  const Book = sequelize.define(
    "BooksCategories",
    {
      CategoryId: {
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
      primaryKey: ["CategoryId", "BookId"], // Define the composite key
    }
  );
  return Book;
};
