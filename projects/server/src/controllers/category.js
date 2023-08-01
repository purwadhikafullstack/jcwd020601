const db = require("../models");
const Sequelize = require("sequelize");
const { Op } = db.Sequelize;
const moment = require("moment");
const categoryController = {
	getAll: async (req, res) => {
		try {
			const page = parseInt(req.query.page) || 0;
			const limit = parseInt(req.query.limit) || 10;
			const search = req.query.search_query || "";
			const offset = limit * page;
			const totalRows = await db.Category.count({
				where: {
					[Op.or]: [
						{
							Category: {
								[Op.like]: "%" + search + "%",
							},
						},
						// {
						// 	language: {
						// 		[Op.like]: "%" + search + "%",
						// 	},
						// },
					],
				},
			});
			const totalPage = Math.ceil(totalRows / limit);
			const result = await db.Category.findAll({
				where: {
					[Op.or]: [
						{
							Category: {
								[Op.like]: "%" + search + "%",
							},
						},
						// {
						// 	language: {
						// 		[Op.like]: "%" + search + "%",
						// 	},
						// },
					],
				},
				offset: offset,
				limit: limit,
				order: [["id"]],
			});
			res.json({
				result: result,
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
			const Category = await db.Category.findOne({
				where: {
					id: req.params.id,
				},
			});
			return res.send(Category);
		} catch (err) {
			console.log(err.message);
			res.status(500).send({
				message: err.message,
			});
		}
	},
	editCategory: async (req, res) => {
		try {
			const { category } = req.body;
			await db.Category.update(
				{
					category,
				},
				{
					where: {
						id: req.params.id,
					},
				}
			);

			return await db.Category.findOne({
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
	insertCategory: async (req, res) => {
		try {
			const { category } = req.body;
			await db.Category.create({
				category,
			});
			return await db.Category.findAll().then((result) => {
				res.send(result);
			});
		} catch (err) {
			console.log(err);
			return res.status(500).send({
				message: err.message,
			});
		}
	},
	deleteCategory: async (req, res) => {
		try {
			await db.Category.destroy({
				where: {
					//  id: req.params.id

					//   [Op.eq]: req.params.id

					id: req.params.id,
				},
			});
			return await db.Category.findAll().then((result) => res.send(result));
		} catch (err) {
			console.log(err.message);
			return res.status(500).send({
				error: err.message,
			});
		}
	},
};

module.exports = categoryController;
