const express = require("express");
const router = express.Router();
const adminController = require("../controllers").adminController;
//get

router.get("/", adminController.getAll);
router.get("/:id", adminController.getById);
router.post("/v1", adminController.insertAdmin);
router.patch("/v2/:id", adminController.editAdmin);
router.delete("/v3/:id", adminController.deleteAdmin);

module.exports = router;
