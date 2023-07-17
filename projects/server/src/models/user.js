module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define(
    "Users",
    {
      first_name: Sequelize.STRING,
      last_name: Sequelize.STRING,
      email: Sequelize.STRING,
      phone: Sequelize.STRING,
      gender: Sequelize.STRING,
      username: Sequelize.STRING,
      password: Sequelize.TEXT,
      birthdate: Sequelize.DATE,
      verified: Sequelize.BOOLEAN(false, true),
      registered_by: Sequelize.ENUM("Google", "Register"),
      avatar_url: Sequelize.TEXT,
    },
    {
      paranoid: true,
    }
  );
  return User;
};
