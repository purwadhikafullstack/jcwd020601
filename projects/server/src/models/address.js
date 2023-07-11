module.exports = (sequelize, Sequelize) => {
  const Address = sequelize.define(
    "Addresses",
    {
      province: Sequelize.STRING,
      city: Sequelize.STRING,
      address: Sequelize.STRING,
      pos: Sequelize.STRING,
      isMain: Sequelize.BOOLEAN,
      latitude: Sequelize.STRING,
      longitude: Sequelize.STRING,
    },
    {
      paranoid: true,
    }
  );
  return Address;
};
