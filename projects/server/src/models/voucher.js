module.exports = (sequelize, Sequelize) => {
  const Voucher = sequelize.define(
    "Vouchers",
    {
      kode: Sequelize.STRING,
      discount: Sequelize.INTEGER,
      isPercent: Sequelize.BOOLEAN,
      terms: Sequelize.TEXT,
      min: Sequelize.INTEGER,
      start: Sequelize.DATE,
      end: Sequelize.DATE,
      limit: Sequelize.INTEGER,
    },
    {
      paranoid: true,
    }
  );
  return Voucher;
};
