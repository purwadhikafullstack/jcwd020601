const express = require("express");
const { getAdminOrUserByToken } = require("../controllers/admin");
const router = express.Router();
const discountController = require("../controllers").discountController;
//get

router.get("/", discountController.getAll);
router.get("/:id", discountController.getById);
router.post("/v1", getAdminOrUserByToken, discountController.insertDiscount);
router.patch("/v2/:id", getAdminOrUserByToken, discountController.editDiscount);
router.delete(
  "/v3/:id",
  getAdminOrUserByToken,
  discountController.deleteDiscount
);

module.exports = router;
