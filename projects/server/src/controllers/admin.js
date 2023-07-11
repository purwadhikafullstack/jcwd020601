const db = require("../models");
const Sequelize = require("sequelize");
const { Op } = db.Sequelize;
const moment = require("moment");
const adminController = {
  getAll: async (req, res) => {
    try {
      const Admin = await db.Admin.findAll();
      return res.send(Admin);
    } catch (err) {
      console.log(err.message);
      res.status(500).send({
        message: err.message,
      });
    }
  },
  getById: async (req, res) => {
    try {
      const Admin = await db.Admin.findOne({
        where: {
          id: req.params.id,
        },
      });
      return res.send(Admin);
    } catch (err) {
      console.log(err.message);
      res.status(500).send({
        message: err.message,
      });
    }
  },
  editAdmin: async (req, res) => {
    try {
      const { role, email, phone, password, branchId } = req.body;
      await db.Admin.update(
        {
          role,
          email,
          phone,
          password,
          branchId,
        },
        {
          where: {
            id: req.params.id,
          },
        }
      );

      return await db.Admin.findOne({
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
  insertAdmin: async (req, res) => {
    try {
      const { role, email, phone, password, branchId } = req.body;
      await db.Admin.create({
        role,
        email,
        phone,
        password,
        branchId,
      });
      return await db.Admin.findAll().then((result) => {
        res.send(result);
      });
    } catch (err) {
      console.log(err);
      return res.status(500).send({
        message: err.message,
      });
    }
  },
  deleteAdmin: async (req, res) => {
    try {
      await db.Admin.destroy({
        where: {
          //  id: req.params.id

          //   [Op.eq]: req.params.id

          id: req.params.id,
        },
      });
      return await db.Admin.findAll().then((result) => res.send(result));
    } catch (err) {
      console.log(err.message);
      return res.status(500).send({
        error: err.message,
      });
    }
  },
};

module.exports = adminController;
