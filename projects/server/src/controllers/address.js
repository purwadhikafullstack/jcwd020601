const db = require("../models");
const Sequelize = require("sequelize");
const { Op } = db.Sequelize;
const moment = require("moment");
const addressController = {
  getAll: async (req, res) => {
    try {
      const Address = await db.Address.findAll();
      return res.send(Address);
    } catch (err) {
      console.log(err.message);
      res.status(500).send({
        message: err.message,
      });
    }
  },
  getById: async (req, res) => {
    try {
      const Address = await db.Address.findOne({
        where: {
          id: req.params.id,
        },
      });
      return res.send(Address);
    } catch (err) {
      console.log(err.message);
      res.status(500).send({
        message: err.message,
      });
    }
  },
  editAddress: async (req, res) => {
    try {
      const {
        province,
        city,
        address,
        pos,
        isMain,
        latitude,
        longitude,
        userId,
      } = req.body;
      await db.Address.update(
        {
          province,
          city,
          address,
          pos,
          isMain,
          latitude,
          longitude,
          userId,
        },
        {
          where: {
            id: req.params.id,
          },
        }
      );

      return await db.Address.findOne({
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
  insertAddress: async (req, res) => {
    try {
      const {
        province,
        city,
        address,
        pos,
        isMain,
        latitude,
        longitude,
        userId,
      } = req.body;
      await db.Address.create({
        province,
        city,
        address,
        pos,
        isMain,
        latitude,
        longitude,
        userId,
      });
      return await db.Address.findAll().then((result) => {
        res.send(result);
      });
    } catch (err) {
      console.log(err);
      return res.status(500).send({
        message: err.message,
      });
    }
  },
  deleteAddress: async (req, res) => {
    try {
      await db.Address.destroy({
        where: {
          //  id: req.params.id

          //   [Op.eq]: req.params.id

          id: req.params.id,
        },
      });
      return await db.Address.findAll().then((result) => res.send(result));
    } catch (err) {
      console.log(err.message);
      return res.status(500).send({
        error: err.message,
      });
    }
  },
};

module.exports = addressController;
