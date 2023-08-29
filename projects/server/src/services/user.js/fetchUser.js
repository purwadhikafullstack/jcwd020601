const db = require("../../models");
const { Op } = db.Sequelize;
const bcrypt = require("bcrypt");
const moment = require("moment");
const fetchUser = {
  fetchByEmail: async (email) => {
    const user = await db.User.findOne({
      where: {
        email,
      },
    });
    return user;
  },
  fetchByToken: async (token) => {
    let payload = await db.Token.findOne({
      where: {
        token,
        expired: {
          [db.Sequelize.Op.gte]: moment().format(),
        },
        valid: true,
      },
    });
    if (!payload) {
      throw new Error("token has expired");
    }
    let user = await db.User.findOne({
      where: {
        id: payload.dataValues.UserId,
      },
    });
    delete user.dataValues.password;
    return user;
  },
  oldPasswordChecker: async ({ email, oldPassword }, req, next) => {
    const user = await db.User.findOne({
      where: {
        email,
      },
    });
    if (user) {
      const match = await bcrypt
        .compare(oldPassword, user.dataValues.password)
        .catch((err) => {
          throw new Error("old password is incorrect");
        });

      if (match) {
        req.user = user;
        next();
      } else {
        throw new Error("old password is incorrect");
      }
    } else {
      throw new Error("user not found");
    }
  },
};
module.exports = fetchUser;
