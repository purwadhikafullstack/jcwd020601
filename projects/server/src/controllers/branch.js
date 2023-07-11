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
  getById: async (req, res) => {
    try {
      const Branch = await db.Branch.findOne({
        where: {
          id: req.params.id,
        },
      });
      return res.send(Branch);
    } catch (err) {
      console.log(err.message);
      res.status(500).send({
        message: err.message,
      });
    }
  },
  editBranch: async (req, res) => {
    try {
      const { name, address, latitude, longitude } = req.body;
      await db.Branch.update(
        {
          name,
          address,
          latitude,
          longitude,
        },
        {
          where: {
            id: req.params.id,
          },
        }
      );

      return await db.Branch.findOne({
        where: {
          id: req.params.id,
        },
      }).then((result) => res.send(result));
    } catch (err) {
      console.log(err.message);
      res.status(500).send({
        message: err.message,
      });
    }
  },
  insertBranch: async (req, res) => {
    try {
      const { name, address, latitude, longitude } = req.body;
      await db.Branch.create({
        name,
        address,
        latitude,
        longitude,
      });
      return await db.Branch.findAll().then((result) => {
        res.send(result);
      });
    } catch (err) {
      console.log(err);
      return res.status(500).send({
        message: err.message,
      });
    }
  },
  deleteBranch: async (req, res) => {
    try {
      await db.Branch.destroy({
        where: {
          //  id: req.params.id

          //   [Op.eq]: req.params.id

          id: req.params.id,
        },
      });
      return await db.Branch.findAll().then((result) => res.send(result));
    } catch (err) {
      console.log(err.message);
      return res.status(500).send({
        error: err.message,
      });
    }
  },
};

module.exports = branchController;
