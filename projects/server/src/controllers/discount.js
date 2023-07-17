const db = require("../models");
const Sequelize = require("sequelize");
const { Op } = db.Sequelize;
const moment = require("moment");
const discountController = {
  getAll: async (req, res) => {
    try {
      const Discount = await db.Discount.findAll();
      return res.send(Discount);
    } catch (err) {
      console.log(err.message);
      res.status(500).send({
        message: err.message,
      });
    }
  },
  getById: async (req, res) => {
    try {
      const Discount = await db.Discount.findOne({
        where: {
          id: req.params.id,
        },
      });
      return res.send(Discount);
    } catch (err) {
      console.log(err.message);
      res.status(500).send({
        message: err.message,
      });
    }
  },
  editDiscount: async (req, res) => {
    try {
      const { title, discount, isPercent, start, end, BranchId } = req.body;
      await db.Discount.update(
        {
          title,
          discount,
          isPercent,
          start,
          end,
          BranchId,
        },
        {
          where: {
            id: req.params.id,
          },
        }
      );

      return await db.Discount.findOne({
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
  insertDiscount: async (req, res) => {
    try {
      const { title, discount, isPercent, start, end, BranchId } = req.body;
      await db.Discount.create({
        title,
        discount,
        isPercent,
        start,
        end,
        BranchId,
      });
      return await db.Discount.findAll().then((result) => {
        res.send(result);
      });
    } catch (err) {
      console.log(err);
      return res.status(500).send({
        message: err.message,
      });
    }
  },
  deleteDiscount: async (req, res) => {
    try {
      await db.Discount.destroy({
        where: {
          //  id: req.params.id

          //   [Op.eq]: req.params.id

          id: req.params.id,
        },
      });
      return await db.Discount.findAll().then((result) => res.send(result));
    } catch (err) {
      console.log(err.message);
      return res.status(500).send({
        error: err.message,
      });
    }
  },
};

module.exports = discountController;
