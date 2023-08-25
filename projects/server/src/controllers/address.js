const db = require("../models");
const Sequelize = require("sequelize");
const { Op } = db.Sequelize;
const moment = require("moment");
const { default: axios } = require("axios");
const opencage = require("opencage-api-client");
const { addressServices } = require("../services");
const addressController = {
  getAll: async (req, res) => {
    try {
      const Address = await addressServices.findAllAddress();
      return res.send(Address);
    } catch (err) {
      res.status(500).send({
        message: err.message,
      });
    }
  },
  getById: async (req, res) => {
    try {
      const Address = await addressServices.findOneAddress(req.params.id);
      if (Address) {
        return res.send(Address);
      }
      throw new Error("Address does not exist");
    } catch (err) {
      console.log(err.message);
      res.status(500).send({
        message: err.message,
      });
    }
  },
  getByUserId: async (req, res) => {
    try {
      const { id } = req.params;
      const Address = await addressServices.findAllAddressByUserId(id);
      return res.send(Address);
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
      const Address = await addressServices.findMainAddressByUserId(id);
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
      const result = await addressServices.getClosestBranch(lat, lon);
      return res.send(result);
    } catch (err) {
      console.log(err.message);
      res.status(500).send({
        message: err.message,
      });
    }
  },
  editAddress: async (req, res) => {
    try {
      const result = await addressServices.patchAddress(
        req.body,
        req.params.id
      );
      res.status(200).send(result);
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
      const { id } = req.params;
      const result = await addressServices.patchMainAddress(UserId, id);
      res.send(result);
    } catch (err) {
      console.log(err.message);
      res.status(500).send({
        message: err.message,
      });
    }
  },
  insertAddress: async (req, res) => {
    try {
      const result = await addressServices.createAddress(req.body);
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
          id: req.params.id,
        },
      });
      if (Address.isMain) {
        const Addresses = await db.Address.findAll({
          where: {
            UserId: req.body.UserId,
          },
        });
        if (Addresses[0]) {
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
      }

      return await db.Address.findAll().then((result) => res.send(result));
    } catch (err) {
      console.log(err.message);
      return res.status(500).send({
        error: err.message,
      });
    }
  },
};

module.exports = addressController;
