const db = require("../models");
const Sequelize = require("sequelize");
const { Op } = db.Sequelize;
const { nanoid } = require("nanoid");
const opencage = require("opencage-api-client");
const bcrypt = require("bcrypt");
const private_key = process.env.private_key;
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
      const { role, email, phone, password, BranchId } = req.body;
      await db.Admin.update(
        {
          role,
          email,
          phone,
          password,
          BranchId,
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
  insertSuperAdmin: async (req, res) => {
    try {
      const { name, email, phone, password } = req.body;
      const hashPassword = await bcrypt.hash(password, 10);
      await db.Admin.create({
        name,
        role: "Super-Admin",
        email,
        phone,
        password: hashPassword,
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
  insertBranchAdminAndBranch: async (req, res) => {
    // const t = await db.sequelize.transaction();
    try {
      let place = {};
      let BranchId;
      const {
        name,
        email,
        password,
        phone,
        branchName,
        province,
        city,
        pos,
        alamatLengkap,
      } = req.body;
      const hashPassword = await bcrypt.hash(password, 10);
      await opencage.geocode({ q: city, language: "id" }).then(async (res) => {
        place = res.results[0].geometry;
        await db.Branch.create(
          {
            latitude: place.lat,
            longitude: place.lng,
            name: branchName,
            province,
            city,
            pos,
            alamatLengkap,
          }
          // { transaction: t }
        );
        const branch = await db.Branch.findOne({
          where: {
            latitude: place.lat,
            longitude: place.lng,
            name: branchName,
            province,
            city,
            pos,
            alamatLengkap,
          },
        });
        BranchId = branch.id;
      });
      await db.Admin.create(
        {
          BranchId,
          name,
          email,
          password: hashPassword,
          role: "Admin-Branch",
          phone,
        }
        // { transaction: t }
      );

      return await db.Admin.findAll().then((result) => {
        // t.commit();
        res.send("Success!");
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
  register: async (req, res) => {
    try {
      const { name, role, email, phone, password, BranchId } = req.body;
      const hashPassword = await bcrypt.hash(password, 10);

      await db.Admin.create({
        name,
        role: "Admin-Branch",
        email,
        phone,
        BranchId,
        password: hashPassword,
      });

      return res.send({
        message: "register berhasil",
        private_key,
      });
    } catch (err) {
      console.log(err.message);
      return res.status(500).send(err.message);
    }
  },
  loginV2: async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await db.Admin.findOne({
        where: {
          [Op.or]: {
            email,
          },
        },
      });
      // console.log(req.body.email);
      if (user) {
        const match = await bcrypt.compare(password, user.dataValues.password);
        if (match) {
          const payload = user.dataValues.id;
          const generateToken = nanoid();
          const token = await db.Token.create({
            expired: moment().add(1, "days").format(),
            token: generateToken,
            AdminId: JSON.stringify(payload),
            status: "LOGIN",
          });

          //  eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NiwibmFtZSI6InVkaW4yIiwiYWRkcmVzcyI6ImJhdGFtIiwicGFzc3dvcmQiOiIkMmIkMTAkWUkvcTl2dVdTOXQ0R1V5a1lxRGtTdWJnTTZwckVnRm9nZzJLSi9FckFHY3NXbXBRUjFOcXEiLCJlbWFpbCI6InVkaW4yQG1haWwuY29tIiwiY3JlYXRlZEF0IjoiMjAyMy0wNi0xOVQwNzowOTozNy4wMDBaIiwidXBkYXRlZEF0IjoiMjAyMy0wNi0xOVQwNzowOTozNy4wMDBaIiwiZGVsZXRlZEF0IjpudWxsLCJDb21wYW55SWQiOm51bGwsImlhdCI6MTY4NDQ4MzQ4NSwiZXhwIjoxNjg0NDgzNTQ1fQ.Ye5l7Yml1TBWUgV7eUnhTVQjdT3frR9E0HXNxO7bTXw;

          return res.send({
            message: "login berhasil",
            // value: user,
            token: token.dataValues.token,
          });
        } else {
          throw new Error("wrong password");
        }
      } else {
        throw new Error("user not found");
      }
    } catch (err) {
      console.log(err.message);
      return res
        .status(500)
        .send({ message: "Email or password is incorrect" });
    }
  },
  changePassword: async (req, res) => {
    try {
      const { token } = req.query;
      const { password } = req.body.user;
      const { id } = req.user;
      const hashPassword = await bcrypt.hash(password, 10);
      await db.User.update(
        {
          password: hashPassword,
        },
        {
          where: {
            id,
          },
        }
      );

      await db.Token.update(
        {
          valid: false,
        },
        {
          where: {
            token,
          },
        }
      );

      res.send({
        message: "password successfully updated",
      });
    } catch (err) {
      res.status(500).send({ message: err.message });
    }
  },
  generateTokenByEmail: async (req, res) => {
    try {
      const { email } = req.query;
      const user = await db.User.findOne({
        where: {
          email,
        },
      });

      if (user.dataValues) {
        await db.Token.update(
          {
            valid: false,
          },
          {
            where: {
              UserId: JSON.stringify(user.dataValues.id),
              Status: "FORGOT-PASSWORD",
            },
          }
        );
        const generateToken = nanoid();
        const token = await db.Token.create({
          expired: moment().add(60, "minutes").format(),
          token: generateToken,
          UserId: JSON.stringify(user.dataValues.id),
          status: "FORGOT-PASSWORD",
        });

        mailer({
          subject: "Hello, " + user.dataValues.username,
          to: user.dataValues.email,
          text: `Hello ${
            user.dataValues.username
          } We received a request to reset the password to your Gramedia account, please click the link to reset your password
          \n${
            url + token.dataValues.token
          } \nand do not share this link to anyone else`,
        });
        return res.send({ message: "please check your email" });
      } else {
        throw new Error("user is not found");
      }
    } catch (err) {
      res.status(500).send({ message: err.message });
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
    res.status(200).send(req.user);
  },
};

module.exports = adminController;
