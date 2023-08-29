const express = require("express");
const getSuperAdminByToken = require("../middlewares/getsuperbytoken");
const router = express.Router();
const adminController = require("../controllers").adminController;
//get

router.get("/", adminController.getAll);
router.get(
  "/v3",
  adminController.getByToken,
  adminController.getAdminOrUserByToken
);
router.post("/filter", adminController.getByFilter);
router.post("/allAdminP", adminController.getAllBranchAdminWithPaginate);
router.post(
  "/v4",
  getSuperAdminByToken,
  adminController.insertBranchAdminAndBranch
);
router.post("/v2", adminController.loginV2);
router.patch("/v2/:id", adminController.editAdmin);
router.delete("/v3/:id", adminController.deleteAdmin);

module.exports = router;
