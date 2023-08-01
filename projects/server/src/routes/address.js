const express = require("express");
const getUserByToken = require("../middlewares/getuserbytoken");
const router = express.Router();
const addressController = require("../controllers").addressController;
//get

router.get("/", addressController.getAll);
router.get("/province", addressController.getAllProvince);
router.get("/user/:id", addressController.getByUserId);
router.get("/ismain/:id", addressController.getIsMainByUserId);
router.post("/city", addressController.getAllCityByProvince);
router.post("/lat", addressController.addAddressByLongitudeLatitude);
router.post("/pos", addressController.getAllPosByCity);
router.post("/v1", getUserByToken, addressController.insertAddress);
router.patch("/v2/:id", getUserByToken, addressController.editAddress);
router.post("/v4/:id", getUserByToken, addressController.deleteAddress);

module.exports = router;
