const express = require("express");
const { fileUploader } = require("../middlewares/multer");
const router = express.Router();
const orderController = require("../controllers").orderController;
//get

router.get("/", orderController.getAll);
router.get("/:id", orderController.getById);
router.post("/v1", orderController.insertOrder);
router.post(
  "/",
  fileUploader({ destinationFolder: "paymentImg" }).single("paymentImg"),
  orderController.uploadPayment
);
router.patch("/v2/:id", orderController.editOrder);
router.patch("/v2/confirm/:id", orderController.confirmPayment);
router.delete("/v3/:id", orderController.deleteOrder);
router.post("shipping", orderController.getShipping);

module.exports = router;
