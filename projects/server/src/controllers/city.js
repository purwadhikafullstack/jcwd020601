const { default: axios } = require("axios");
const db = require("../models");

const cityController = {
  addCityData: async (req, res) => {
    try {
      const response = await axios.get(
        "https://api.rajaongkir.com/starter/city",
        {
          headers: { key: process.env.RAJA_ONGKIR },
        }
      );
      await db.City.bulkCreate(response.data.rajaongkir.results);
      return res.status(200).send(response.data.rajaongkir.results);
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
  },
  getCity: async (req, res) => {
    try {
      const result = await db.City.findAll({
        where: {
          province_id: req.params.id,
        },
      });
      res.status(200).send({
        message: "OK",
        result: result,
      });
    } catch (err) {
      res.status(500).send({
        message: err.message,
      });
    }
  },
  getCityByProvince: async (req, res) => {
    try {
      const { province_id } = req.params;
      const result = await db.City.findAll({
        where: { province_id },
      });
      res.status(200).send({
        message: "OK",
        result: result,
      });
    } catch (err) {
      res.status(500).send({
        message: err.message,
      });
    }
  },
  getPosByCity: async (req, res) => {
    try {
      const { city_id } = req.params;
      const result = await db.City.findOne({
        where: { city_id },
      });
      res.status(200).send({
        message: "OK",
        result: result,
      });
    } catch (err) {
      res.status(500).send({
        message: err.message,
      });
    }
  },
  getIdByCity: async (req, res) => {
    try {
      const { city_name } = req.body;
      const result = await db.City.findOne({
        where: {
          city_name,
        },
      });
      res.status(200).send({
        result: result.city_id,
      });
    } catch (err) {
      res.status(500).send({
        message: err.message,
      });
    }
  },
  getCityIdOrder: async (req, res) => {
    try {
      const { BranchId, AddressId } = req.body;

      const city = await db.Branch.findOne({
        where: {
          id: BranchId,
        },
      });

      const origin = await db.City.findOne({
        where: {
          city_name: city.name,
        },
      });

      const destination = await db.Address.findOne({
        where: {
          id: AddressId,
        },
      });

      res.status(200).send({
        origin: origin.city_id,
        destination: destination.CityId,
      });
    } catch (err) {
      res.status(500).send({
        message: err.message,
      });
    }
  },
};

module.exports = cityController;
