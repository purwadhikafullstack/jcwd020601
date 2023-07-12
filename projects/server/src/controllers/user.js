const db = require("../models");
const Sequelize = require("sequelize");
const { Op } = db.Sequelize;
const moment = require("moment");
const userController = {
  getAll: async (req, res) => {
    try {
      const User = await db.User.findAll();
      return res.send(User);
    } catch (err) {
      console.log(err.message);
      res.status(500).send({
        message: err.message,
      });
    }
  },
  getById: async (req, res) => {
    try {
      const User = await db.User.findOne({
        where: {
          id: req.params.id,
        },
      });
      return res.send(User);
    } catch (err) {
      console.log(err.message);
      res.status(500).send({
        message: err.message,
      });
    }
  },
  editUser: async (req, res) => {
    try {
      const {
        first_name,
        last_name,
        email,
        phone,
        gender,
        username,
        password,
        birthdate,
        verified,
        avatar_url,
      } = req.body;
      await db.User.update(
        {
          first_name,
          last_name,
          email,
          phone,
          gender,
          username,
          password,
          birthdate,
          verified,
          avatar_url,
        },
        {
          where: {
            id: req.params.id,
          },
        }
      );

      return await db.User.findOne({
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
  insertUser: async (req, res) => {
    try {
      const {
        first_name,
        last_name,
        email,
        phone,
        gender,
        username,
        password,
        birthdate,
        verified,
        avatar_url,
      } = req.body;
      await db.User.create({
        first_name,
        last_name,
        email,
        phone,
        gender,
        username,
        password,
        birthdate,
        verified,
        avatar_url,
      });
      return await db.User.findAll().then((result) => {
        res.send(result);
      });
    } catch (err) {
      console.log(err);
      return res.status(500).send({
        message: err.message,
      });
    }
  },
  deleteUser: async (req, res) => {
    try {
      await db.User.destroy({
        where: {
          //  id: req.params.id

          //   [Op.eq]: req.params.id

          id: req.params.id,
        },
      });
      return await db.User.findAll().then((result) => res.send(result));
    } catch (err) {
      console.log(err.message);
      return res.status(500).send({
        error: err.message,
      });
    }
  },
};

module.exports = userController;
