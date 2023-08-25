const express = require("express");
const router = express.Router();
const branchController = require("../controllers").branchController;
//get

router.get("/", branchController.getAll);
router.get("/:id", branchController.getById);
router.post("/v1", branchController.insertBranch);
router.patch("/v2/:id", branchController.editBranch);
router.delete("/v3/:id", branchController.deleteBranch);

module.exports = router;
