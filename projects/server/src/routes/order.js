const express = require("express");
const { fileUploader } = require("../middlewares/multer");
const getAdminByToken = require("../middlewares/getadminbytoken");
const getUserByToken = require("../middlewares/getuserbytoken");
const router = express.Router();
const orderController = require("../controllers").orderController;
//get

// router.get("/", orderController.getAll);
router.get("/totalsales/week", orderController.getTotalSalesOnLastWeek);
router.get("/sales", orderController.getSalesOnTime);
router.get("/sales/:BranchId", orderController.getSalesFromBranchIdOnTime);
router.get("/qty", orderController.getSalesQuantityOnTime);
router.get(
  "/qty/:BranchId",
  orderController.getSalesQuantityFromBranchIdOnTime
);
router.get("/transaction", orderController.getTransactionOnTime);
router.get(
  "/transaction/:BranchId",
  orderController.getTransactionFromBranchIdOnTime
);

router.get("/pending/:UserId", orderController.getPendingByUserId);
router.get("/history/:UserId", orderController.getHistoryByUserId);

router.post("/branch", getAdminByToken, orderController.getBranchOrder);
router.post("/filter", getAdminByToken, orderController.getByFilter);
router.post("/allbranch", getAdminByToken, orderController.getAllBranchOrder);
router.post("/v1", getUserByToken, orderController.insertOrder);
router.post(
  "/",
  getUserByToken,
  fileUploader({ destinationFolder: "paymentImg" }).single("paymentImg"),
  orderController.uploadPayment
);
router.patch("/v2/status", getAdminByToken, orderController.updateStatus);
router.patch(
  "/v2/userstatus",
  getUserByToken,
  orderController.updateStatusUser
);
router.post("/shipping", orderController.getShipping);

module.exports = router;
