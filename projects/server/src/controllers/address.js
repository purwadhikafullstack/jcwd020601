const db = require("../models");
const Sequelize = require("sequelize");
const { Op } = db.Sequelize;
const moment = require("moment");
const { default: axios } = require("axios");
const opencage = require("opencage-api-client");
function distance(lat1, lon1, lat2, lon2, BranchId) {
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
const addressController = {
  getAll: async (req, res) => {
    try {
      const Address = await db.Address.findAll();
      return res.send(Address);
    } catch (err) {
      console.log(err.message);
      res.status(500).send({
        message: err.message,
      });
    }
  },
  getById: async (req, res) => {
    try {
      const Address = await db.Address.findOne({
        where: {
          id: req.params.id,
        },
      });
      return res.send(Address);
    } catch (err) {
      console.log(err.message);
      res.status(500).send({
        message: err.message,
      });
    }
  },
  getByUserId: async (req, res) => {
    try {
      const Address = await db.Address.findAll({
        where: {
          UserId: req.params.id,
        },
      });
      return res.send(Address);
    } catch (err) {
      console.log(err.message);
      res.status(500).send({
        message: err.message,
      });
    }
  },
  getLatLonByCity: async (req, res) => {
    try {
      const Address = await opencage.geocode({
        q: "Bandung",
        language: "id",
      });
      return res.send(Address.results);
    } catch (err) {
      console.log(err.message);
      res.status(500).send({
        message: err.message,
      });
    }
  },
  getIsMainByUserId: async (req, res) => {
    try {
      const { id } = req.params;
      const Address = await db.Address.findOne({
        where: {
          [Op.and]: [{ UserId: id }, { isMain: true }],
        },
      });
      return res.send(Address);
    } catch (err) {
      console.log(err.message);
      res.status(500).send({
        message: err.message,
      });
    }
  },
  getClosestBranchByLatLon: async (req, res) => {
    try {
      const { lat, lon } = req.body;
      const result = [];
      const Branches = await db.Branch.findAll();
      await Branches.map((val) => {
        result.push(distance(lat, lon, val.latitude, val.longitude, val.id));
      });
      let min = Math.min(...result.map((item) => item.distance));
      let lowest = result.filter((item) => item.distance === min);
      return res.send(lowest);
    } catch (err) {
      console.log(err.message);
      res.status(500).send({
        message: err.message,
      });
    }
  },

  editAddress: async (req, res) => {
    try {
      const {
        labelAlamat,
        namaPenerima,
        no_Handphone,
        province,
        city,
        alamatLengkap,
        pos,
        isMain,
        latitude,
        longitude,
        UserId,
      } = req.body;
      await db.Address.update(
        {
          labelAlamat,
          namaPenerima,
          no_Handphone,
          province,
          city,
          alamatLengkap,
          pos,
          isMain,
          latitude,
          longitude,
          UserId,
        },
        {
          where: {
            id: req.params.id,
          },
        }
      );

      return await db.Address.findOne({
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
  editMainAddress: async (req, res) => {
    try {
      const { UserId } = req.body;
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
            id: req.params.id,
          },
        }
      );

      return await db.Address.findOne({
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
  insertAddress: async (req, res) => {
    try {
      let place = {};
      const Main = await db.Address.findOne({
        where: {
          isMain: true,
        },
      });

      const {
        labelAlamat,
        namaPenerima,
        no_Handphone,
        province,
        city,
        alamatLengkap,
        pos,
        latitude,
        longitude,
        UserId,
      } = req.body;
      await opencage.geocode({ q: city, language: "id" }).then(async (res) => {
        place = res.results[0].geometry;

        await db.Address.create({
          labelAlamat,
          namaPenerima,
          no_Handphone,
          province,
          city,
          isMain: Main ? false : true,
          alamatLengkap,
          pos,
          latitude: place.lat,
          longitude: place.lng,
          UserId,
        });
      });
      const result = await db.Address.findAll();
      res.send(result);
    } catch (err) {
      console.log(err);
      return res.status(500).send({
        message: err.message,
      });
    }
  },
  deleteAddress: async (req, res) => {
    try {
      const Address = await db.Address.findOne({
        where: {
          id: req.params.id,
        },
      });
      await db.Address.destroy({
        where: {
          //  id: req.params.id

          //   [Op.eq]: req.params.id

          id: req.params.id,
        },
      });
      if (Address.isMain) {
        const Addresses = await db.Address.findAll({
          where: {
            UserId: req.body.UserId,
          },
        });
        await db.Address.update(
          {
            isMain: true,
          },
          {
            where: {
              id: Addresses[0].id,
            },
          }
        );
      }

      return await db.Address.findAll().then((result) => res.send(result));
    } catch (err) {
      console.log(err.message);
      return res.status(500).send({
        error: err.message,
      });
    }
  },
  addAddressByLongitudeLatitude: async (req, res) => {
    try {
      const {
        latitude,
        longitude,
        UserId,
        alamatLengkap,
        namaPenerima,
        no_Handphone,
      } = req.body;
      opencage
        .geocode({ q: latitude + "," + longitude, language: "id" })
        .then(async (data) => {
          // console.log(JSON.stringify(data));
          if (data.status.code === 200 && data.results.length > 0) {
            const place = data.results[0].geometry;
            const Main = await db.Address.findOne({
              where: {
                isMain: true,
              },
            });
            // await db.Address.create({
            //   // province: place.components.state,
            //   // city: place.components.city,
            //   // address,
            //   // pos: place.components.postcode,
            //   // isMain: Main ? false : true,
            //   // latitude,
            //   // longitude,
            //   // UserId,labelAlamat,
            //   namaPenerima,
            //   no_Handphone,
            //   province: place.components.state,
            //   city: place.components.city,
            //   alamatLengkap,
            //   pos: place.components.postcode,
            //   latitude,
            //   longitude,
            //   UserId,
            // });
            res.send({
              place: data.results[0].components,

              // namaPenerima,
              // no_Handphone,
              // province: place.components.state,
              // city: place.components.city,
              // alamatLengkap,
              // pos: place.components.postcode,
              // latitude,
              // longitude,
              // UserId,
            });
          } else {
            console.log("status", data.status.message);
            console.log("total_results", data.total_results);
          }
        })
        .catch((error) => {
          console.log("error", error.message);
          if (error.status.code === 402) {
            console.log("hit free trial daily limit");
            console.log("become a customer: https://opencagedata.com/pricing");
          }
        });
      const user = await db.User.findAll();
    } catch (err) {
      console.log(err.message);
      res.status(500).send({
        message: err.message,
      });
    }
  },
  getAllProvince: async (req, res) => {
    try {
      const province = await axios
        .get("https://api.rajaongkir.com/starter/province", {
          headers: { key: "fdaa10aca9ee40feab355d1646c531eb" },
        })
        .then((res) => {
          return res.data.rajaongkir.results;
        });
      // .catch((err) => {
      //   console.log(err.message);
      // });

      return res.status(200).send(province);
    } catch (err) {
      console.log(err.message);
      res.status(500).send({
        message: err.message,
      });
    }
  },
  getAllCityByProvince: async (req, res) => {
    try {
      const { id } = req.body;
      const province = await axios
        .get("https://api.rajaongkir.com/starter/city?&province=" + id, {
          headers: { key: "fdaa10aca9ee40feab355d1646c531eb" },
        })
        .then((res) => {
          return res.data.rajaongkir.results;
        });
      return res.status(200).send(province);
    } catch (err) {
      console.log(err.message);
      res.status(500).send({
        message: err.message,
      });
    }
  },
  getAllPosByCity: async (req, res) => {
    try {
      const { id } = req.body;
      const province = await axios
        .get("https://api.rajaongkir.com/starter/city?id=" + id, {
          headers: { key: "fdaa10aca9ee40feab355d1646c531eb" },
        })
        .then((res) => {
          return res.data.rajaongkir.results;
        });
      return res.status(200).send(province);
    } catch (err) {
      console.log(err.message);
      res.status(500).send({
        message: err.message,
      });
    }
  },
};

module.exports = addressController;
