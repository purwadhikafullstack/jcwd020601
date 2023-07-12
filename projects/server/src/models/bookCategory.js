module.exports = (sequelize, Sequelize) => {
  const Book = sequelize.define(
    "BooksCategory",
    {},
    {
      paranoid: true,
    }
  );
  return Book;
};
