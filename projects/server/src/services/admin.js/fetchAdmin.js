const db = require("../../models");
const { Op } = db.Sequelize;
const fetchAdmin = {
  fetchBranchAdminsWithBranchFiltered: async (
    { AdminId, BranchName, before, after, sort },
    queryPage,
    queryLimit
  ) => {
    let page = parseInt(queryPage) || 0;
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
};
module.exports = fetchAdmin;
