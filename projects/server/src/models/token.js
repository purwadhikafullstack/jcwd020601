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
      UserId: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      AdminId: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
    }, // nama nama kolom
    {
      paranoid: true,
      primaryKey: ["UserId", "AdminId"],
    } // options
  );

  return Token;
};
