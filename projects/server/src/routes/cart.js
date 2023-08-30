const express = require("express");
const getUserByToken = require("../middlewares/getuserbytoken");
const router = express.Router();
const cartController = require("../controllers").cartController;
//get

router.post("/id", getUserByToken, cartController.getById);
router.post("/qty", cartController.getQty);
router.post("/v1", getUserByToken, cartController.insertCart);
router.patch("/v2", getUserByToken, cartController.editCart);
router.delete("/v3/:id", getUserByToken, cartController.deleteCart);

module.exports = router;
