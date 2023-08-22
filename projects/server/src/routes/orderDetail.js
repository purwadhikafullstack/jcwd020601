const express = require("express");
const getUserByToken = require("../middlewares/getuserbytoken");
const getAdminByToken = require("../middlewares/getadminbytoken");

const router = express.Router();
const orderDetailController = require("../controllers").orderDetailController;
//get

router.get("/", orderDetailController.getAll);
router.post("/id", getUserByToken, orderDetailController.getById);
router.post("/admin", getAdminByToken, orderDetailController.getByIdAdmin);
router.post("/v1", orderDetailController.insertOrderDetail);
router.patch("/v2/:id", orderDetailController.editOrderDetail);
router.delete("/v3/:id", orderDetailController.deleteOrderDetail);

module.exports = router;
