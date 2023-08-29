const db = require("../../models");
const { Op } = db.Sequelize;
const opencage = require("opencage-api-client");
const bcrypt = require("bcrypt");
const { nanoid } = require("nanoid");
const moment = require("moment");
const adminHandlers = {
  patchAdmin: async (
    { role, name, email, phone, password, BranchId },
    id,
    t
  ) => {
    let hashPassword = "";
    if (password) {
      hashPassword = await bcrypt.hash(password, 10);
    }
    await db.Admin.update(
      {
        name,
        role,
        email,
        phone,
        password: hashPassword || password,
        BranchId,
      },
      {
        where: {
          id,
        },
        transaction: t,
      }
    );
    const Admin = await db.Admin.findOne({
      where: {
        id,
      },
    });
    return Admin;
  },
  insertBranchAdminAndBranch: async (
    {
      name,
      email,
      password,
      phone,
      branchName,
      province,
      city,
      pos,
      alamatLengkap,
    },
    t
  ) => {
    let BranchId;
    let place = {};
    const hashPassword = await bcrypt.hash(password, 10);
    await opencage.geocode({ q: city, language: "id" }).then(async (res) => {
      place = res.results[0].geometry;
      await db.Branch.create({
        latitude: place.lat,
        longitude: place.lng,
        name: branchName,
        province,
        city,
        pos,
        alamatLengkap,
      });
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
      },
      {
        transaction: t,
      }
    );
    return "Success!";
  },
  deleteAdmin: async (id, t) => {
    await db.Admin.destroy({
      where: {
        id,
      },
      transaction: t,
    });
    return await db.Admin.findAll();
  },
  loginAdmin: async ({ email, password }, t) => {
    const admin = await db.Admin.findOne({
      where: {
        [Op.or]: {
          email,
        },
      },
    });
    if (admin) {
      const match = await bcrypt.compare(password, admin.dataValues.password);
      if (match) {
        const payload = admin.dataValues.id;
        const generateToken = nanoid();
        const findToken = await db.Token.findOne({
          where: {
            AdminId: payload,
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
                AdminId: payload,
                Status: "LOGIN",
              },
              transaction: t,
            }
          );
        } else {
          token = await db.Token.create({
            expired: moment().add(1, "days").format(),
            token: generateToken,
            AdminId: payload,
            status: "LOGIN",
          });
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
};
module.exports = adminHandlers;
