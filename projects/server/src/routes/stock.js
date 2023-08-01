const express = require("express");
const router = express.Router();
const stockController = require("../controllers").stockController;
//get

router.get("/", stockController.getAll);
router.get("/:id", stockController.getById);
router.post("/v1", stockController.insertStock);
router.patch("/v2", stockController.editStock);
router.delete("/v3/:id", stockController.deleteStock);

module.exports = router;
