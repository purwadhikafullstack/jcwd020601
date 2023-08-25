const db = require("../models");
const { Op } = db.Sequelize;
const addressServices = {
  addressChecker: async (id) => {
    try {
      return await db.Address.findOne({
        where: {
          id,
        },
        raw: true,
      });
    } catch (err) {
      return err;
    }
  },
};
module.exports = addressServices;
