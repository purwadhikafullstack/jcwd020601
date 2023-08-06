const express = require("express");
const router = express.Router();
const adminController = require("../controllers").adminController;
//get

router.get("/", adminController.getAll);
router.get(
  "/v3",
  adminController.getByToken,
  adminController.getAdminOrUserByToken
);
router.get("/:id", adminController.getById);
router.post("/v1", adminController.insertSuperAdmin);
router.post("/v4", adminController.insertBranchAdminAndBranch);
router.post("/", adminController.register);
router.post("/v2", adminController.loginV2);
router.patch("/v2/:id", adminController.editAdmin);
router.delete("/v3/:id", adminController.deleteAdmin);

module.exports = router;
