module.exports = (sequelize, Sequelize) => {
  const Branch = sequelize.define(
    "Branches",
    {
      name: Sequelize.STRING,
      address: Sequelize.STRING,
      latitude: Sequelize.STRING,
      longitude: Sequelize.STRING,
    },
    {
      paranoid: true,
    }
  );
  return Branch;
};
