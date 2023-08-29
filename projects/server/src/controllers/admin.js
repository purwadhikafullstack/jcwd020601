const db = require("../models");
const Sequelize = require("sequelize");
const { Op } = db.Sequelize;
const { nanoid } = require("nanoid");
const opencage = require("opencage-api-client");
const bcrypt = require("bcrypt");
const private_key = process.env.private_key;
const moment = require("moment");
const { adminServices } = require("../services");

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
  getByFilter: async (req, res) => {
    try {
      const result = await adminServices.fetchBranchAdminsWithBranchFiltered(
        req.body,
        req.query.page,
        req.query.limit
      );
      return res.send(result);
    } catch (err) {
      console.log(err.message);
      res.status(500).send({
        message: err.message,
      });
    }
  },
  getAllBranchAdminWithPaginate: async (req, res) => {
    try {
      const result = await adminServices.fetchBranchAdminsWithBranch(
        req.body,
        req.query.page,
        req.query.limit
      );
      res.send(result);
    } catch (err) {
      console.log(err.message);
      res.status(500).send({
        message: err.message,
      });
    }
  },
  editAdmin: async (req, res) => {
    const t = await db.sequelize.transaction();
    try {
      const result = await adminServices.patchAdmin(req.body, req.params.id, t);
      await t.commit();
      res.send(result);
    } catch (err) {
      await t.rollback();
      console.log(err.message);
      res.status(500).send({
        message: err.message,
      });
    }
  },
  insertBranchAdminAndBranch: async (req, res) => {
    const t = await db.sequelize.transaction();

    try {
      const result = await adminServices.insertBranchAdminAndBranch(
        req.body,
        t
      );
      await t.commit();
      res.send(result);
    } catch (err) {
      await t.rollback();
      console.log(err);
      return res.status(500).send({
        message: err.message,
      });
    }
  },
  deleteAdmin: async (req, res) => {
    const t = await db.sequelize.transaction();

    try {
      const result = await adminServices.deleteAdmin(req.params.id, t);
      await t.commit();
      res.send(result);
    } catch (err) {
      await t.rollback();
      console.log(err.message);
      return res.status(500).send({
        error: err.message,
      });
    }
  },
  loginV2: async (req, res) => {
    const t = await db.sequelize.transaction();
    try {
      const result = await adminServices.loginAdmin(req.body, t);
      await t.commit();
      res.send(result);
    } catch (err) {
      await t.rollback();
      console.log(err.message);
      return res
        .status(500)
        .send({ message: "Email or password is incorrect" });
    }
  },
  getByToken: async (req, res, next) => {
    try {
      let { token } = req.query;
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
      let user = await db.User.findOne({
        where: {
          id: payload.dataValues.UserId,
        },
      });
      if (admin) {
        delete admin.dataValues.password;
        req.user = admin;
        next();
      } else {
        delete user?.dataValues.password;
        req.user = user;
        next();
      }
    } catch (err) {
      console.log(err);
      return res.status(400).send({ message: err.message });
    }
  },
  getAdminOrUserByToken: async (req, res) => {
    try {
      if (req.admin) {
        res.status(200).send(req.admin);
      }
      res.status(200).send(req.user);
    } catch (err) {
      res.status(500).send({ message: err.message });
    }
  },
};

module.exports = adminController;
