async function getUserByToken(req, res, next) {
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
    let user = await db.User.findOne({
      where: {
        id: payload.dataValues.UserId,
      },
    });
    delete user.dataValues.password;

    req.user = user;

    next();
  } catch (err) {
    console.log(err);
    return res.status(500).send({ message: err.message });
  }
}
module.exports = getUserByToken;
