module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define(
    "Users",
    {
      name: Sequelize.STRING,
      email: Sequelize.STRING,
      phone: Sequelize.STRING,
      gender: Sequelize.STRING,
      username: Sequelize.STRING,
      password: Sequelize.TEXT,
      birthday: Sequelize.DATE,
      status: Sequelize.ENUM("Not-Verified", "Verified"),
      avatar_url: Sequelize.TEXT,
    },
    {
      paranoid: true,
    }
  );
  return User;
};
