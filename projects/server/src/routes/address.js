const express = require("express");
const router = express.Router();
const addressController = require("../controllers").addressController;
//get

router.get("/", addressController.getAll);
router.get("/:id", addressController.getById);
router.post("/v1", addressController.insertAddress);
router.patch("/v2/:id", addressController.editAddress);
router.delete("/v3/:id", addressController.deleteAddress);

module.exports = router;
