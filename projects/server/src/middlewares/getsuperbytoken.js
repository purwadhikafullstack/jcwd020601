const { Op } = require("sequelize");

async function getSuperAdminByToken(req, res, next) {
  const db = require("../models");
  const moment = require("moment");

  try {
    let token = req.headers["auth"];
    // console.log(token);
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
    let admin = await db.Admin.findOne({
      where: {
        [Op.and]: [{ id: payload.dataValues.AdminId }, { role: "Super-Admin" }],
      },
    });
    delete admin.dataValues.password;

    req.admin = admin;
    // console.log(admin);
    console.log("SUKESS");

    next();
  } catch (err) {
    console.log(err);
    console.log("Not SUKES");
    return res.status(500).send({ message: err.message });
  }
}
module.exports = getSuperAdminByToken;
