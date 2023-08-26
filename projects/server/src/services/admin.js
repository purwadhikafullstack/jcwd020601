const db = require("../models");
const { Op } = db.Sequelize;
const opencage = require("opencage-api-client");
const bcrypt = require("bcrypt");
const { nanoid } = require("nanoid");
const moment = require("moment");
const adminServices = {
  fetchBranchAdminsWithBranchFiltered: async (
    { AdminId, BranchName, before, after, sort },
    queryPage,
    queryLimit
  ) => {
    const page = parseInt(queryPage) || 0;
    const limit = parseInt(queryLimit) || 10;
    const offset = limit * page;
    const whereClause = {
      offset: offset,
      limit: limit,
      where: {
        createdAt: {
          [Op.and]: {
            [Op.gte]: new Date(after || "1900-01-01"),
            [Op.lte]: new Date(before || "2100-10-10"),
          },
        },
        role: "Admin-Branch",
      },
      include: {
        model: db.Branch,
        as: "Branch",
      },
    };
    if (BranchName) {
      whereClause.include.where = { name: BranchName };
    }
    if (AdminId) {
      whereClause.where.id = AdminId;
    }
    if (sort?.sortedBy == "branchName") {
      whereClause.order = [
        [{ model: db.Branch, as: "Branch" }, "name", sort.asc],
      ];
    } else if (sort.sortedBy) {
      whereClause.order = [[sort.sortedBy, sort.asc]];
    } else {
      whereClause.order = [["id", sort.asc]];
    }
    const Admin = await db.Admin.findAll(whereClause);
    const totalRows = await db.Admin.count(whereClause);
    const totalPage = Math.ceil(totalRows / limit);
    Admin.map((val) => {
      delete val.dataValues.password;
    });

    return { Admin, page, limit, totalRows, totalPage };
  },
  fetchBranchAdminsWithBranch: async ({ sort }, queryPage, queryLimit) => {
    const page = parseInt(queryPage) || 0;
    const limit = parseInt(queryLimit) || 10;
    const offset = limit * page;
    const totalRows = await db.Admin.count({});
    const totalPage = Math.ceil(totalRows / limit);
    const whereAdmin = {
      offset: offset,
      limit: limit,
      where: {
        role: "Admin-Branch",
      },
      include: {
        model: db.Branch,
        as: "Branch",
      },
    };
    if (sort?.sortedBy == "branchName") {
      whereAdmin.order = [
        [{ model: db.Branch, as: "Branch" }, "name", sort.asc],
      ];
    } else if (sort) {
      whereAdmin.order = [[sort.sortedBy, sort.asc]];
    } else {
    }

    const Admin = await db.Admin.findAll(whereAdmin);
    return { Admin, page, limit, totalRows, totalPage };
  },
  patchAdmin: async ({ role, name, email, phone, password, BranchId }, id) => {
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
      }
    );
    const Admin = await db.Admin.findOne({
      where: {
        id,
      },
    });
    return Admin;
  },
  insertBranchAdminAndBranch: async ({
    name,
    email,
    password,
    phone,
    branchName,
    province,
    city,
    pos,
    alamatLengkap,
  }) => {
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
    await db.Admin.create({
      BranchId,
      name,
      email,
      password: hashPassword,
      role: "Admin-Branch",
      phone,
    });
    return "Success!";
  },
  deleteAdmin: async () => {
    await db.Admin.destroy({
      where: {
        id,
      },
    });
    return await db.Admin.findAll();
  },
  loginAdmin: async ({ email, password }) => {
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
module.exports = adminServices;
