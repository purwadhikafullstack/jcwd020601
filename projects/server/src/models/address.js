module.exports = (sequelize, Sequelize) => {
  const Address = sequelize.define(
    "Addresses",
    {
      labelAlamat: Sequelize.STRING,
      namaPenerima: Sequelize.STRING,
      no_Handphone: Sequelize.STRING,
      province: Sequelize.STRING,
      city: Sequelize.STRING,
      alamatLengkap: Sequelize.STRING,
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
