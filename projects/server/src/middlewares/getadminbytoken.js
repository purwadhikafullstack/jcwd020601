async function getAdminByToken(req, res, next) {
  const db = require("../models");
  const moment = require("moment");

  try {
    let token = req.headers["auth"];
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
        id: payload.dataValues.AdminId,
      },
    });
    delete admin.dataValues.password;

    req.admin = admin;

    next();
  } catch (err) {
    console.log(err);
    return res.status(500).send({ message: err.message });
  }
}
module.exports = getAdminByToken;
