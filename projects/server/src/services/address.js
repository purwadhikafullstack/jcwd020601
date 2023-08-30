const db = require("../models");
const { Op } = db.Sequelize;
const opencage = require("opencage-api-client");

function distanceMeasurer(lat1, lon1, lat2, lon2, BranchId) {
  const r = 6371; // km
  const p = Math.PI / 180;

  const a =
    0.5 -
    Math.cos((lat2 - lat1) * p) / 2 +
    (Math.cos(lat1 * p) *
      Math.cos(lat2 * p) *
      (1 - Math.cos((lon2 - lon1) * p))) /
      2;

  return {
    BranchId,
    distance: 2 * r * Math.asin(Math.sqrt(a)),
  };
}
const addressServices = {
  findOneAddress: async (id) => {
    return await db.Address.findOne({
      where: {
        id,
      },
    });
  },
  findAllAddress: async (id) => {
    return await db.Address.findAll({});
  },
  findAllAddressByUserId: async (id) => {
    return await db.Address.findAll({
      where: { UserId: id },
    });
  },
  findMainAddressByUserId: async (id) => {
    return await db.Address.findOne({
      where: {
        [Op.and]: [{ UserId: id }, { isMain: true }],
      },
    });
  },
  getClosestBranch: async (lat, lon) => {
    const result = [];
    const Branches = await db.Branch.findAll();
    await Branches.map((val) => {
      result.push(
        distanceMeasurer(lat, lon, val.latitude, val.longitude, val.id)
      );
    });
    let min = Math.min(...result.map((item) => item.distance));
    let lowest = result.filter((item) => item.distance === min);
    if (lowest[0].distance <= 50) {
      return {
        BranchId: lowest[0].BranchId,
        distance: lowest[0].distance,
        TooFar: false,
      };
    }
    return {
      message: "Branch Terdekat Melebihi 50km",
      TooFar: true,
      BranchId: 2,
      ClosestBranchId: lowest[0].BranchId,
      distance: lowest[0].distance,
    };
  },
  patchAddress: async (
    {
      labelAlamat,
      namaPenerima,
      no_Handphone,
      province,
      city,
      alamatLengkap,
      pos,
      isMain,
      UserId,
    },
    id,
    t
  ) => {
    let place = {};
    await opencage
      .geocode({ q: city?.split("#")[1], language: "id" })
      .then(async (res) => {
        place = res?.results[0].geometry;
      });
    await db.Address.update(
      {
        labelAlamat,
        namaPenerima,
        no_Handphone,
        province: province?.split("#")[1],
        city: city?.split("#")[1],
        isMain,
        alamatLengkap,
        pos,
        latitude: place.lat,
        longitude: place.lng,
        UserId,
        ProvinceId: province?.split("#")[0],
        CityId: city?.split("#")[0],
      },
      {
        where: {
          id,
        },
        transaction: t,
      }
    );
    const result = await db.Address.findOne({
      where: {
        id,
      },
    });
    return result;
  },
  patchMainAddress: async (UserId, id, t) => {
    const Address = await db.Address.update(
      {
        isMain: false,
      },
      {
        where: {
          [Op.and]: [{ UserId }, { isMain: true }],
        },
      }
    );
    await db.Address.update(
      {
        isMain: true,
      },
      {
        where: {
          id,
        },
        transaction: t,
      }
    );
    return await db.Address.findOne({
      where: {
        id,
      },
    });
  },
  createAddress: async ({
    labelAlamat,
    namaPenerima,
    no_Handphone,
    province,
    city,
    alamatLengkap,
    pos,
    UserId,
  },t) => {
    let place = {};
    const Main = await db.Address.findOne({
      where: {
        UserId,
        isMain: true,
      },
    });

    await opencage
      .geocode({ q: city.split("#")[1], language: "id" })
      .then(async (res) => {
        place = res.results[0].geometry;

        await db.Address.create(
          {
            labelAlamat,
            namaPenerima,
            no_Handphone,
            province: province.split("#")[1],
            city: city.split("#")[1],
            isMain: Main ? false : true,
            alamatLengkap,
            pos,
            latitude: place.lat,
            longitude: place.lng,
            UserId,
            ProvinceId: province.split("#")[0],
            CityId: city.split("#")[0],
          },
          { transaction: t }
        );
      });
    return await db.Address.findAll();
  },
};
module.exports = addressServices;
