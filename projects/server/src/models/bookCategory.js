module.exports = (sequelize, Sequelize) => {
  const Book = sequelize.define(
    "BooksCategories",
    {
      CategoryId: {
        // type: Sequelize.STRING,
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      BookId: {
        // type: Sequelize.STRING,
        type: Sequelize.INTEGER,
        allowNull: false,
      },
    },
    {
      paranoid: true,

      primaryKey: ["CategoryId", "BookId"], // Define the composite key

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
