module.exports = (sequelize, Sequelize) => {
  const Book = sequelize.define(
    "Books",
    {
      title: Sequelize.STRING,
      language: Sequelize.STRING,
      publish_date: Sequelize.DATE,
      author: Sequelize.STRING,
      publisher: Sequelize.STRING,
      description: Sequelize.TEXT,
      book_url: Sequelize.TEXT,
      pages: Sequelize.INTEGER,
      weight: Sequelize.INTEGER,
      dimension: Sequelize.STRING,
      price: Sequelize.INTEGER,
      rating: Sequelize.STRING,
    },
    {
      paranoid: true,
    }
  );
  return Book;
};
