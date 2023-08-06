const express = require("express");
const router = express.Router();
const cityController = require("../controllers").cityController;
//get

router.get("/", cityController.getCity);
router.get("/v1/:province_id", cityController.getCityByProvince);
router.get("/v2/:city_id", cityController.getPosByCity);
router.post("/v1", cityController.addCityData);

module.exports = router;
