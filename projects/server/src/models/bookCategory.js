module.exports = (sequelize, Sequelize) => {
  const Book = sequelize.define(
    "BooksCategory",
    {},
    {
      paranoid: true,
      primaryKey: ["BookId", "CategoryId"],
      indexes: [
        {
          unique: true,
          fields: ["CategoryId", "BookId"], // Add the unique constraint on the composite key
        },
      ],
    }
  );
  return Book;
};
