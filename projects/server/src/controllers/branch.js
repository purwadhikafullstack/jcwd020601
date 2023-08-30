const db = require("../models");
const Sequelize = require("sequelize");
const { Op } = db.Sequelize;
const moment = require("moment");
const branchController = {
  getAll: async (req, res) => {
    try {
      const Branch = await db.Branch.findAll();
      return res.send(Branch);
    } catch (err) {
      console.log(err.message);
      res.status(500).send({
        message: err.message,
      });
    }
  },
};

module.exports = branchController;
