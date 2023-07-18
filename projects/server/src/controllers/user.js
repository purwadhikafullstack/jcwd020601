const db = require("../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const private_key = process.env.private_key;
const { nanoid } = require("nanoid");
const moment = require("moment");
const url = process.env.URL;
const urlVerify = process.env.URLverify;
const opencage = require("opencage-api-client");

const mailer = require("../lib/mailer");
const image_url = process.env.URL_IMAGE;
const sharp = require("sharp");
const { Op } = db.Sequelize;

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
  getByEmail: async (req, res) => {
    try {
      const user = await db.User.findOne({
        where: {
          email: req.query.email,
        },
      });
      return res.send(user);
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
  register: async (req, res) => {
    try {
      const { first_name, last_name, email, username, password } = req.body;
      const hashPassword = await bcrypt.hash(password, 10);
      const User = await db.User.findOne({
        where: {
          email,
        },
      });
      if (User) {
        throw new Error("Email has been used");
      } else {
        await db.User.create({
          first_name,
          last_name,
          email,
          username,
          password: hashPassword,
          registered_by: "Register",
        });

        return res.send({
          message: "register berhasil",
          private_key,
        });
      }
    } catch (err) {
      console.log(err.message);
      return res.status(500).send(err.message);
    }
  },
  loginV2: async (req, res) => {
    try {
      const { emus, password } = req.body;
      const user = await db.User.findOne({
        where: {
          [Op.or]: {
            email: emus,
            username: emus,
          },
        },
      });

      if (user) {
        const match = await bcrypt.compare(password, user.dataValues.password);
        if (match) {
          const payload = user.dataValues.id;
          const generateToken = nanoid();
          console.log(nanoid());
          const token = await db.Token.create({
            expired: moment().add(1, "days").format(),
            token: generateToken,
            UserId: JSON.stringify(payload),
            status: "LOGIN",
          });

          console.log(token);
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
  loginV3: async (req, res) => {
    try {
      let create = {};
      let newToken = "";
      const { email, family_name, given_name, name } = req.body;
      // const checkUser = await db.User.findOne({
      //   where: {
      //     email,
      //     registered_by: "Register",
      //   },
      // });
      // if (checkUser) {
      //   throw new Error(
      //     "Email has been Registered in this website, please sign in with the email and password that was registered"
      //   );
      // } else {
      const user = await db.User.findOne({
        where: {
          email,
          // registered_by: "Google",
        },
      });

      if (!user) {
        create = await db.User.create({
          first_name: given_name,
          last_name: family_name,
          email,
          username: name,
          registered_by: "Google",
        });
      }

      if (create || user) {
        const payload = user?.dataValues.id || create.dataValues.id;
        const generateToken = nanoid();
        // console.log(nanoid());
        const findToken = await db.Token.findOne({
          where: {
            UserId: payload,
            Status: "LOGIN",
          },
        });
        if (findToken) {
          await db.Token.update(
            {
              token: generateToken,
            },
            {
              where: {
                UserId: payload,
                Status: "LOGIN",
              },
            }
          );
          newToken = generateToken;
        } else {
          const token = await db.Token.create({
            expired: moment().add(1, "days").format(),
            token: generateToken,
            UserId: payload,
            status: "LOGIN",
          });
          newToken = generateToken;
        }

        // console.log(token);
        //  eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NiwibmFtZSI6InVkaW4yIiwiYWRkcmVzcyI6ImJhdGFtIiwicGFzc3dvcmQiOiIkMmIkMTAkWUkvcTl2dVdTOXQ0R1V5a1lxRGtTdWJnTTZwckVnRm9nZzJLSi9FckFHY3NXbXBRUjFOcXEiLCJlbWFpbCI6InVkaW4yQG1haWwuY29tIiwiY3JlYXRlZEF0IjoiMjAyMy0wNi0xOVQwNzowOTozNy4wMDBaIiwidXBkYXRlZEF0IjoiMjAyMy0wNi0xOVQwNzowOTozNy4wMDBaIiwiZGVsZXRlZEF0IjpudWxsLCJDb21wYW55SWQiOm51bGwsImlhdCI6MTY4NDQ4MzQ4NSwiZXhwIjoxNjg0NDgzNTQ1fQ.Ye5l7Yml1TBWUgV7eUnhTVQjdT3frR9E0HXNxO7bTXw;

        return res.send({
          message: "login berhasil",
          // value: user,
          token: newToken,
        });
      } else {
        throw new Error("wrong password");
      }
      // }
    } catch (err) {
      console.log(err.message);
      // console.log(dataValues);
      return res.status(500).send({ message: err.message });
    }
  },
  getByToken: async (req, res, next) => {
    try {
      let { token } = req.query;
      console.log(token);
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
      console.log(payload.dataValues);
      let user = await db.User.findOne({
        where: {
          id: payload.dataValues.UserId,
        },
      });
      delete user.dataValues.password;

      req.user = user;
      next();
    } catch (err) {
      console.log(err);
      return res.status(500).send({ message: err.message });
    }
  },
  getUserByToken: async (req, res) => {
    res.status(200).send(req.user);
  },
  generateTokenByEmail: async (req, res) => {
    try {
      const { email } = req.query;
      const user = await db.User.findOne({
        where: {
          email,
        },
      });

      if (user?.dataValues) {
        await db.Token.update(
          {
            valid: false,
          },
          {
            where: {
              UserId: user.dataValues.id,
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

        return res.send({ message: "Please check your email" });
      } else {
        throw new Error("User is not found");
      }
    } catch (err) {
      console.log(err);
      res.status(500).send({ message: err.message });
    }
  },
  generateTokenByEmailVerify: async (req, res) => {
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
              UserId: user.dataValues.id,
              Status: "VERIFY-ACCOUNT",
            },
          }
        );
        const generateToken = nanoid();
        const token = await db.Token.create({
          expired: moment().add(60, "minutes").format(),
          token: generateToken,
          UserId: user.dataValues.id,
          status: "VERIFY-ACCOUNT",
        });

        mailer({
          subject: "hello," + user.dataValues.username,
          to: user.dataValues.email,
          text: `hello ${
            user.dataValues.username
          } We received a request to verify the account to your Gramedia account, please click the link below to verify your account \n${
            urlVerify + token.dataValues.token
          } \nand do not share this link to anyone else`,
        });

        return res.send({ message: "Please check your email" });
      } else {
        throw new Error("user is not found");
      }
    } catch (err) {
      res.status(500).send({ message: err.message });
    }
  },

  changePassword: async (req, res) => {
    try {
      console.log(req.body);
      const { token } = req.query;
      const { password } = req.body.user;
      const { id } = req.user;
      console.log(id);

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
  verifyEmail: async (req, res) => {
    try {
      console.log(req.body);
      const { token } = req.query;
      const { id } = req.user;
      console.log(id);
      await db.User.update(
        {
          verified: true,
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
        message: "Email Verified",
      });
    } catch (err) {
      res.status(500).send({ message: err.message });
    }
  },
};

module.exports = userController;
