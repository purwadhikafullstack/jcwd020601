const express = require("express");
const router = express.Router();
const voucherController = require("../controllers").voucherController;
//get

router.get("/", voucherController.getAll);
router.get("/:id", voucherController.getById);
router.post("/v1", voucherController.insertVoucher);
router.patch("/v2/:id", voucherController.editVoucher);
router.delete("/v3/:id", voucherController.deleteVoucher);

module.exports = router;
