const db = require("../models");
const { Op } = db.Sequelize;
const moment = require("moment");

const verifyToken = async (req, res, next) => {
  try {
    const token = req.headers["authorization"];
    if (!token) {
      return res.status(400).json({ message: "Token not found" });
    }
    let payload = await db.Token.findOne({
      where: {
        token,
        expired: {
          [db.Sequelize.Op.gte]: moment().format(),
        },
        valid: true,
      },
      // include: [db.Admin],
    });
    if (!payload) {
      return res.status(400).json({ message: "Token has expired" });
    }
    // console.log(payload.dataValues.AdminId.name);
    next();
  } catch (error) {
    console.error("Error verifying token:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = verifyToken;
