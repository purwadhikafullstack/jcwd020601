const express = require("express");
const router = express.Router();
const userController = require("../controllers").userController;
//get

router.get("/", userController.getAll);
router.get("/email", userController.getByEmail);
router.get("/generate-token/email", userController.generateTokenByEmail);
router.get(
  "/generate-token/emailVerify",
  userController.generateTokenByEmailVerify
);
router.get(
  "/token/verifyemail",
  userController.getByToken,
  userController.verifyEmail
);
router.get("/v3", userController.getByToken, userController.getUserByToken);
router.get("/:id", userController.getById);
router.post("/v1", userController.insertUser);
router.post("/", userController.register);
router.post("/v2", userController.loginV2);
router.patch("/v4", userController.getByToken, userController.changePassword);
router.patch("/v2/:id", userController.editUser);
router.delete("/v3/:id", userController.deleteUser);

module.exports = router;
