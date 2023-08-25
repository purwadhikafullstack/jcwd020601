const express = require("express");
const router = express.Router();
const stockHistoryController = require("../controllers").stockHistoryController;
//get

router.get("/", stockHistoryController.getAll);
router.post("/id", stockHistoryController.getById);
router.post("/v1", stockHistoryController.insertStockHistory);
router.patch("/v2/:id", stockHistoryController.editStockHistory);
router.delete("/v3/:id", stockHistoryController.deleteStockHistory);

module.exports = router;
