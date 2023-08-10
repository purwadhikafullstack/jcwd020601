const db = require("../models");
const Sequelize = require("sequelize");
const { Op } = db.Sequelize;
const moment = require("moment");
const discountController = {
  getAll: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 0;
      const limit = parseInt(req.query.limit) || 10;
      const search = req.query.search_query || "";
      const offset = limit * page;
      const totalRows = await db.Discount.count({
        where: {
          [Op.or]: [
            {
              title: {
                [Op.like]: "%" + search + "%",
              },
            },
          ],
        },
      });
      const totalPage = Math.ceil(totalRows / limit);
      const Discount = await db.Discount.findAll({
        where: {
          [Op.or]: [
            {
              title: {
                [Op.like]: "%" + search + "%",
              },
            },
          ],
        },
        offset: offset,
        limit: limit,
        order: [["id"]],
      });
      res.json({
        result: Discount,
        page: page,
        limit: limit,
        totalRows: totalRows,
        totalPage: totalPage,
      });
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
