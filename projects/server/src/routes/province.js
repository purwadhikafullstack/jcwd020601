const express = require("express");
const router = express.Router();
const provinceController = require("../controllers").provinceController;
//get

router.get("/", provinceController.getProvince);
router.post("/v1", provinceController.addProvinceData);

module.exports = router;
