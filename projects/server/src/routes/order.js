const express = require("express");
const { fileUploader } = require("../middlewares/multer");
const getAdminByToken = require("../middlewares/getadminbytoken");
const getUserByToken = require("../middlewares/getuserbytoken");
const router = express.Router();
const orderController = require("../controllers").orderController;
//get

router.get("/", orderController.getAll);
router.get("/sales", orderController.getSalesOnAllTime);
router.get("/sales/week", orderController.getSalesOnLastWeek);
router.get(
  "/sales/week/:BranchId",
  orderController.getSalesFromBranchIdOnLastWeek
);
router.get("/sales/month", orderController.getSalesOnLastMonth);
router.get(
  "/sales/month/:BranchId",
  orderController.getSalesFromBranchIdOnLastMonth
);
router.get("/pending/:UserId", orderController.getPendingByUserId);
router.get("/history/:UserId", orderController.getHistoryByUserId);

router.get("/:id", orderController.getByUserId);

router.post("/branch", orderController.getBranchOrder);
router.post("/filter", orderController.getByFilter);
router.post("/allbranch", orderController.getAllBranchOrder);
router.post("/v1", orderController.insertOrder);
router.post(
  "/",
  fileUploader({ destinationFolder: "paymentImg" }).single("paymentImg"),
  orderController.uploadPayment
);
router.patch("/v2/status", getAdminByToken, orderController.updateStatus);
router.patch(
  "/v2/userstatus",
  getUserByToken,
  orderController.updateStatusUser
);
router.patch("/v2/:id", orderController.editOrder);
router.delete("/v3/:id", orderController.deleteOrder);
router.post("/shipping", orderController.getShipping);

module.exports = router;
