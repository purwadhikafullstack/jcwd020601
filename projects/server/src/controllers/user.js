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
      let token = "";
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
          const findToken = await db.Token.findOne({
            where: {
              UserId: payload,
              Status: "LOGIN",
            },
          });
          if (findToken) {
            token = await db.Token.update(
              {
                expired: moment().add(1, "d").format(),
                token: generateToken,
              },
              {
                where: {
                  UserId: payload,
                  Status: "LOGIN",
                },
              }
            );
          } else {
            token = await db.Token.create({
              expired: moment().add(1, "days").format(),
              token: generateToken,
              UserId: payload,
              status: "LOGIN",
            });
          }

          //  eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NiwibmFtZSI6InVkaW4yIiwiYWRkcmVzcyI6ImJhdGFtIiwicGFzc3dvcmQiOiIkMmIkMTAkWUkvcTl2dVdTOXQ0R1V5a1lxRGtTdWJnTTZwckVnRm9nZzJLSi9FckFHY3NXbXBRUjFOcXEiLCJlbWFpbCI6InVkaW4yQG1haWwuY29tIiwiY3JlYXRlZEF0IjoiMjAyMy0wNi0xOVQwNzowOTozNy4wMDBaIiwidXBkYXRlZEF0IjoiMjAyMy0wNi0xOVQwNzowOTozNy4wMDBaIiwiZGVsZXRlZEF0IjpudWxsLCJDb21wYW55SWQiOm51bGwsImlhdCI6MTY4NDQ4MzQ4NSwiZXhwIjoxNjg0NDgzNTQ1fQ.Ye5l7Yml1TBWUgV7eUnhTVQjdT3frR9E0HXNxO7bTXw;

          return res.send({
            message: "login berhasil",
            // value: user,
            token: generateToken,
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
  updateProfile: async (req, res) => {
    try {
      const { first_name, last_name, gender, phone, id } = req.body;
      const user = await db.User.update(
        {
          first_name,
          last_name,
          gender,
          phone:
            phone && phone[1] == "0"
              ? phone.slice(2)
              : phone && phone[0] == "0"
              ? phone.slice(1)
              : phone,
        },
        {
          where: {
            id,
          },
        }
      );
      return res.status(200).send({
        message: "your account has been updated",
      });
    } catch (err) {
      console.log(err.message);
      return res.status(500).send(err.message);
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
      const generateToken = nanoid();

      if (!user) {
        create = await db.User.create({
          first_name: given_name,
          last_name: family_name,
          email,
          username: name,
          registered_by: "Google",
          verified: true,
        });
      } else {
        await db.User.update(
          {
            verified: true,
          },
          {
            where: {
              id: user.dataValues.id,
            },
          }
        );
      }

      if (create || user) {
        const payload = user?.dataValues.id || create.dataValues.id;
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
              expired: moment().add(5, "d").format(),
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
      // console.log(token);
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
  checkOldPassword: async (req, res, next) => {
    try {
      const { email, oldPassword } = req.body;
      const user = await db.User.findOne({
        where: {
          email,
        },
      });
      if (user) {
        const match = await bcrypt
          .compare(oldPassword, user.dataValues.password)
          .catch((err) => {
            throw new Error("old password is incorrect");
          });

        if (match) {
          req.user = user;
          next();
        } else {
          throw new Error("old password is incorrect");
        }
      } else {
        throw new Error("user not found");
      }
    } catch (err) {
      res.status(500).send({ message: err.message, lol: "lasdosa" });
    }
  },
  changePasswordNoToken: async (req, res) => {
    try {
      const { password } = req.body;
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

      res.send({
        message: "password successfully updated",
      });
    } catch (err) {
      res.status(500).send({ lol: "saldsa", message: err.message });
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
  verifyEmail: async (req, res) => {
    try {
      const { token } = req.query;
      const { id } = req.user;
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
  renderAvatar: async (req, res) => {
    try {
      await db.User.findOne({
        where: {
          id: req.params.id,
        },
      }).then((result) => {
        res.set("Content-type", "image/png");
        res.send(result.dataValues.avatar);
      });
    } catch (err) {
      return res.send({
        message: err.message,
      });
    }
  },
  uploadAvatar: async (req, res) => {
    const { filename } = req.file;
    await db.User.update(
      {
        avatar_url: image_url + filename,
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
  uploadAvatarv2: async (req, res) => {
    const buffer = await sharp(req.file.buffer).resize(25, 25).png().toBuffer();
    var fullUrl =
      req.protocol +
      "://" +
      req.get("host") +
      "/auth/image/render/" +
      req.params.id;
    await db.User.update(
      {
        avatar_url: fullUrl,
        avatar: buffer,
      },
      {
        where: {
          id: req.params.id,
        },
      }
    );
    // await db.User.findOne({
    //   where: {
    //     id: req.params.id,
    //   },
    // }).then((result) => res.send(result));
    res.send("berhasil upload");
  },
};

module.exports = userController;
