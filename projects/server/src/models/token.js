module.exports = (sequelize, Sequelize) => {
  const Token = sequelize.define(
    "Tokens", //nama table
    {
      token: {
        type: Sequelize.STRING,
      },
      expired: {
        type: Sequelize.DATE,
      },

      valid: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      status: {
        type: Sequelize.ENUM("LOGIN", "FORGOT-PASSWORD", "VERIFY-ACCOUNT"),
      },
    }, // nama nama kolom
    {
      paranoid: true,
    } // options
  );

  return Token;
};
