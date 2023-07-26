module.exports = (sequelize, Sequelize) => {
  const Branch = sequelize.define(
    "Branches",
    {
      name: Sequelize.STRING,
      province: Sequelize.STRING,
      city: Sequelize.STRING,
      alamatLengkap: Sequelize.STRING,
      pos: Sequelize.STRING,
      latitude: Sequelize.STRING,
      longitude: Sequelize.STRING,
    },
    {
      paranoid: true,
    }
  );
  return Branch;
};
