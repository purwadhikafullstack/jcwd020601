const db = require("../models");
const Sequelize = require("sequelize");
const { Op } = db.Sequelize;
const moment = require("moment");
const voucherController = {
  getAll: async (req, res) => {
    try {
      const Voucher = await db.Voucher.findAll();
      return res.send(Voucher);
    } catch (err) {
      console.log(err.message);
      res.status(500).send({
        message: err.message,
      });
    }
  },
  getById: async (req, res) => {
    try {
      const Voucher = await db.Voucher.findOne({
        where: {
          id: req.params.id,
        },
      });
      return res.send(Voucher);
    } catch (err) {
      console.log(err.message);
      res.status(500).send({
        message: err.message,
      });
    }
  },
  editVoucher: async (req, res) => {
    try {
      const { kode, discount, isPercent, terms, min, start, end, limit } =
        req.body;
      await db.Voucher.update(
        {
          kode,
          discount,
          isPercent,
          terms,
          min,
          start,
          end,
          limit,
        },
        {
          where: {
            id: req.params.id,
          },
        }
      );

      return await db.Voucher.findOne({
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
  insertVoucher: async (req, res) => {
    try {
      const { kode, discount, isPercent, terms, min, start, end, limit } =
        req.body;
      await db.Voucher.create({
        kode,
        discount,
        isPercent,
        terms,
        min,
        start,
        end,
        limit,
      });
      return await db.Voucher.findAll().then((result) => {
        res.send(result);
      });
    } catch (err) {
      console.log(err);
      return res.status(500).send({
        message: err.message,
      });
    }
  },
  deleteVoucher: async (req, res) => {
    try {
      await db.Voucher.destroy({
        where: {
          //  id: req.params.id

          //   [Op.eq]: req.params.id

          id: req.params.id,
        },
      });
      return await db.Voucher.findAll().then((result) => res.send(result));
    } catch (err) {
      console.log(err.message);
      return res.status(500).send({
        error: err.message,
      });
    }
  },
};

module.exports = voucherController;
