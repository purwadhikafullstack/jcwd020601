const express = require("express");
const router = express.Router();
const stockController = require("../controllers").stockController;
//get

router.get("/all", stockController.getAll);
router.get("/", stockController.getAllAsc);
router.get("/price", stockController.getPrice);
router.get("/Desc", stockController.getAllDesc);
router.get("/:id", stockController.getById);
router.post("/v1", stockController.insertStock);
router.patch("/v2/:id", stockController.editStock);
router.delete("/v3/:id", stockController.deleteStock);

module.exports = router;
