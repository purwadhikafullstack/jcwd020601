module.exports = (sequelize, Sequelize) => {
  const Admin = sequelize.define(
    "Admins",
    {
      role: Sequelize.ENUM("Admin-Branch", "Super-Admin"),
      email: Sequelize.STRING,
      phone: Sequelize.STRING,
      password: Sequelize.STRING,
    },
    {
      paranoid: true,
    }
  );
  return Admin;
};
