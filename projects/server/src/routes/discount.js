const express = require("express");
const router = express.Router();
const discountController = require("../controllers").discountController;
//get

router.get("/", discountController.getAll);
router.get("/:id", discountController.getById);
router.post("/v1", discountController.insertDiscount);
router.patch("/v2/:id", discountController.editDiscount);
router.delete("/v3/:id", discountController.deleteDiscount);

module.exports = router;
