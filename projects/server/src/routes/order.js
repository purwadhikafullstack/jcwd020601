const express = require("express");
const router = express.Router();
const orderController = require("../controllers").orderController;
//get

router.get("/", orderController.getAll);
router.get("/:id", orderController.getById);
router.post("/v1", orderController.insertOrder);
router.patch("/v2/:id", orderController.editOrder);
router.delete("/v3/:id", orderController.deleteOrder);

module.exports = router;
