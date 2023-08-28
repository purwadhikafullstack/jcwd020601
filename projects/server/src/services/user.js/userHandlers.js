const db = require("../../models");
const { Op } = db.Sequelize;
const opencage = require("opencage-api-client");
const bcrypt = require("bcrypt");
const { nanoid } = require("nanoid");
const url = process.env.URL;
const mailer = require("../../lib/mailer");
const urlVerify = process.env.URLverify;
const moment = require("moment");
const userHandlers = {
  register: async ({ first_name, last_name, email, username, password }, t) => {
    const hashPassword = await bcrypt.hash(password, 10);
    const User = await db.User.findOne({
      where: {
        email,
      },
    });
    if (User) {
      throw new Error("Email has been used");
    } else {
      await db.User.create(
        {
          first_name,
          last_name,
          email,
          username,
          password: hashPassword,
          registered_by: "Register",
        },
        { transaction: t }
      );
      return {
        message: "register berhasil",
      };
    }
  },
  loginV2: async ({ emus, password }, t) => {
    let token = "";
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
              transaction: t,
            }
          );
        } else {
          token = await db.Token.create(
            {
              expired: moment().add(1, "days").format(),
              token: generateToken,
              UserId: payload,
              status: "LOGIN",
            },
            { transaction: t }
          );
        }
        return {
          message: "login berhasil",
          token: generateToken,
        };
      } else {
        throw new Error("wrong password");
      }
    } else {
      throw new Error("user not found");
    }
  },
  patchProfile: async ({ first_name, last_name, gender, phone, id }, t) => {
    await db.User.update(
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
        transaction: t,
      }
    );
    return {
      message: "your account has been updated",
    };
  },
  loginV3: async ({ email, family_name, given_name, name }, t) => {
    let create = {};
    let newToken = "";
    const user = await db.User.findOne({
      where: {
        email,
      },
    });
    const generateToken = nanoid();
    if (!user) {
      create = await db.User.create(
        {
          first_name: given_name,
          last_name: family_name,
          email,
          username: name,
          registered_by: "Google",
          verified: true,
        },
        { transaction: t }
      );
    } else {
      await db.User.update(
        {
          verified: true,
        },
        {
          where: {
            id: user.dataValues.id,
          },
          transaction: t,
        }
      );
    }

    if (create || user) {
      const payload = user?.dataValues.id || create.dataValues.id;
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
            transaction: t,
          }
        );
        newToken = generateToken;
      } else {
        const token = await db.Token.create(
          {
            expired: moment().add(1, "days").format(),
            token: generateToken,
            UserId: payload,
            status: "LOGIN",
          },
          { transaction: t }
        );
        newToken = generateToken;
      }
      return {
        message: "login berhasil",
        token: newToken,
      };
    } else {
      throw new Error("wrong password");
    }
  },
  generateTokenByEmail: async (email, t) => {
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
          transaction: t,
        }
      );
      const generateToken = nanoid();
      const token = await db.Token.create(
        {
          expired: moment().add(60, "minutes").format(),
          token: generateToken,
          UserId: user.dataValues.id,
          status: "FORGOT-PASSWORD",
        },
        { transaction: t }
      );
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
      return { message: "Please check your email" };
    } else {
      throw new Error("User is not found");
    }
  },
  generateTokenByEmailVerify: async (email, t) => {
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
            Status: "VERIFY-ACCOUNT",
          },
          transaction: t,
        }
      );
      const generateToken = nanoid();
      const token = await db.Token.create(
        {
          expired: moment().add(60, "minutes").format(),
          token: generateToken,
          UserId: user.dataValues.id,
          status: "VERIFY-ACCOUNT",
        },
        { transaction: t }
      );
      mailer({
        subject: "hello," + user.dataValues.username,
        to: user.dataValues.email,
        text: `hello ${
          user.dataValues.username
        } We received a request to verify the account to your Gramedia account, please click the link below to verify your account \n${
          urlVerify + token.dataValues.token
        } \nand do not share this link to anyone else`,
      });
      return { message: "Please check your email" };
    } else {
      throw new Error("user is not found");
    }
  },
  changePasswordNoToken: async ({ password }, { id }, t) => {
    const hashPassword = await bcrypt.hash(password, 10);

    await db.User.update(
      {
        password: hashPassword,
      },
      {
        where: {
          id,
        },
        transaction: t,
      }
    );

    return {
      message: "password successfully updated",
    };
  },
  changePassword: async ({ token }, { password }, id, t) => {
    const hashPassword = await bcrypt.hash(password, 10);
    await db.User.update(
      {
        password: hashPassword,
      },
      {
        where: {
          id,
        },
        transaction: t,
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
        transaction: t,
      }
    );
    return {
      message: "password successfully updated",
    };
  },
  verifyEmail: async ({ token }, id, t) => {
    await db.User.update(
      {
        verified: true,
      },
      {
        where: {
          id,
        },
        transaction: t,
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
        transaction: t,
      }
    );

    return {
      message: "Email Verified",
    };
  },
};
module.exports = userHandlers;
