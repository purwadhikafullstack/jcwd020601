const db = require("../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const private_key = process.env.private_key;
const { nanoid } = require("nanoid");
const moment = require("moment");
const url = process.env.URL;
const urlVerify = process.env.URLverify;

const mailer = require("../lib/mailer");
const image_url = process.env.URL_IMAGE;
const sharp = require("sharp");
const { default: axios } = require("axios");
const user = require("../models/user");
const { userServices } = require("../services");
const { Op } = db.Sequelize;

const userController = {
  getByEmail: async (req, res) => {
    try {
      const result = await userServices.fetchByEmail(req.query.email);
      res.send(result);
    } catch (err) {
      console.log(err.message);
      res.status(500).send({
        message: err.message,
      });
    }
  },
  register: async (req, res) => {
    const t = await db.sequelize.transaction();
    try {
      const result = await userServices.register(req.body, t);
      await t.commit();
      res.send(result);
    } catch (err) {
      await t.rollback();
      console.log(err.message);
      return res.status(500).send(err.message);
    }
  },
  loginV2: async (req, res) => {
    const t = await db.sequelize.transaction();
    try {
      const result = await userServices.loginV2(req.body, t);
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
  updateProfile: async (req, res) => {
    const t = await db.sequelize.transaction();
    try {
      const result = await userServices.patchProfile(req.body, t);
      await t.commit();
      res.send(result);
    } catch (err) {
      await t.rollback();
      console.log(err.message);
      return res.status(500).send(err.message);
    }
  },
  loginV3: async (req, res) => {
    const t = await db.sequelize.transaction();
    try {
      const result = await userServices.loginV3(req.body, t);
      await t.commit();
      res.send(result);
    } catch (err) {
      await t.rollback();
      console.log(err.message);
      return res.status(500).send({ message: err.message });
    }
  },
  getByToken: async (req, res, next) => {
    try {
      const result = await userServices.fetchByToken(req.query.token);
      req.user = result;
      next();
    } catch (err) {
      console.log(err);
      return res.status(500).send({ message: err.message });
    }
  },
  getUserByLoginToken: async (req, res) => {
    res.status(200).send(req.user);
  },
  generateTokenByEmail: async (req, res) => {
    const t = await db.sequelize.transaction();
    try {
      const result = await userServices.generateTokenByEmail(
        req.query.email,
        t
      );
      await t.commit();
      res.send(result);
    } catch (err) {
      await t.rollback();
      console.log(err);
      res.status(500).send({ message: err.message });
    }
  },
  generateTokenByEmailVerify: async (req, res) => {
    const t = await db.sequelize.transaction();
    try {
      const result = await userServices.generateTokenByEmailVerify(
        req.query.email,
        t
      );
      await t.commit();
      res.send(result);
    } catch (err) {
      await t.rollback();
      console.log(err);
      res.status(500).send({ message: err.message });
    }
  },
  checkOldPassword: async (req, res, next) => {
    try {
      const result = await userServices.oldPasswordChecker(req.body, req, next);
    } catch (err) {
      res.status(500).send({ message: err.message });
    }
  },
  changePasswordNoToken: async (req, res) => {
    const t = await db.sequelize.transaction();
    try {
      const result = await userServices.changePasswordNoToken(
        req.body,
        req.user,
        t
      );
      await t.commit();
      res.send(result);
    } catch (err) {
      await t.rollback();
      res.status(500).send({ message: err.message });
    }
  },
  changePassword: async (req, res) => {
    const t = await db.sequelize.transaction();
    try {
      const result = await userServices.changePassword(
        req.query,
        req.body.user,
        req.user.id,
        t
      );
      await t.commit();
      res.send(result);
    } catch (err) {
      await t.rollback();
      res.status(500).send({ message: err.message });
    }
  },
  verifyEmail: async (req, res) => {
    const t = await db.sequelize.transaction();
    try {
      const result = await userServices.verifyEmail(req.query, req.user.id, t);
      await t.commit();
      res.send(result);
    } catch (err) {
      await t.rollback();
      res.status(500).send({ message: err.message });
    }
  },

  uploadAvatar: async (req, res) => {
    const { filename } = req.file;
    await db.User.update(
      {
        avatar_url: "avatar/" + filename,
      },
      {
        where: {
          id: req.params.id,
        },
      }
    );
    await db.User.findOne({
      where: {
        id: req.params.id,
      },
    }).then((result) => res.send(result));
  },
};

module.exports = userController;
