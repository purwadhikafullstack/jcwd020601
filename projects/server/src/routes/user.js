const express = require("express");
const router = express.Router();
const userController = require("../controllers").userController;
//get

router.get("/", userController.getAll);
router.get("/:id", userController.getById);
router.post("/v1", userController.insertUser);
router.patch("/v2/:id", userController.editUser);
router.delete("/v3/:id", userController.deleteUser);

module.exports = router;
