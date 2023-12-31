const express = require("express");
const getAdminByToken = require("../middlewares/getadminbytoken");
const router = express.Router();
const stockHistoryController = require("../controllers").stockHistoryController;

router.post("/id", getAdminByToken, stockHistoryController.getById);

module.exports = router;
