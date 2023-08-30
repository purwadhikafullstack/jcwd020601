const express = require("express");
const getUserByToken = require("../middlewares/getuserbytoken");
const getAdminByToken = require("../middlewares/getadminbytoken");

const router = express.Router();
const orderDetailController = require("../controllers").orderDetailController;

router.post("/id", getUserByToken, orderDetailController.getById);
router.post("/admin", getAdminByToken, orderDetailController.getByIdAdmin);

module.exports = router;
