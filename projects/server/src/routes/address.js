const express = require("express");
const router = express.Router();
const addressController = require("../controllers").addressController;
//get

router.get("/", addressController.getAll);
router.get("/province", addressController.getAllProvince);
router.get("/user/:id", addressController.getByUserId);
router.post("/city", addressController.getAllCityByProvince);
router.post("/lat", addressController.addAddressByLongitudeLatitude);
router.post("/pos", addressController.getAllPosByCity);
router.post("/v1", addressController.insertAddress);
router.patch("/v2/:id", addressController.editAddress);
router.delete("/v3/:id", addressController.deleteAddress);

module.exports = router;
