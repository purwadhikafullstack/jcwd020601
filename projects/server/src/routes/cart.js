const express = require("express");
const router = express.Router();
const cartController = require("../controllers").cartController;
//get

router.get("/", cartController.getAll);
router.post("/id", cartController.getById);
router.post("/v1", cartController.insertCart);
router.patch("/v2", cartController.editCart);
router.delete("/v3/:id", cartController.deleteCart);

module.exports = router;
