const express = require("express");
const router = express.Router();
const cityController = require("../controllers").cityController;
//get

router.get("/", cityController.getCity);
router.get("/v1/:province_id", cityController.getCityByProvince);
router.get("/v2/:city_id", cityController.getPosByCity);
router.get("/v3", cityController.getIdByCity);
router.post("/v1", cityController.addCityData);
router.post("/order", cityController.getCityIdOrder);

module.exports = router;
