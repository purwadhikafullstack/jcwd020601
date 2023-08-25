const express = require("express");
const router = express.Router();
const validate = require("../middlewares/validateAdmin");
const categoryController = require("../controllers").categoryController;
//get

router.get("/", categoryController.getAll);
router.get("/:id", validate, categoryController.getById);
router.post("/v1", validate, categoryController.insertCategory);
router.patch("/v2/:id", validate, categoryController.editCategory);
router.delete("/v3/:id", validate, categoryController.deleteCategory);

module.exports = router;
