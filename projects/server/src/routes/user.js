const express = require("express");
const router = express.Router();
const { fileUploader, upload } = require("../middlewares/multer");
const getUserByToken = require("../middlewares/getuserbytoken");

const userController = require("../controllers").userController;
//get

router.get("/email", userController.getByEmail);
router.get("/generate-token/email", userController.generateTokenByEmail);
router.get(
  "/generate-token/emailVerify",
  userController.generateTokenByEmailVerify
);
router.get("/token/verifyemail", getUserByToken, userController.verifyEmail);
router.get(
  "/v3",
  userController.getByToken,
  userController.getUserByLoginToken
);
router.post("/", userController.register);
router.post("/v2", userController.loginV2);
router.post("/v3", userController.loginV3);
router.post(
  "/image/v1/:id",
  fileUploader({
    destinationFolder: "avatar",
  }).single("avatar"),
  getUserByToken,
  userController.uploadAvatar
);

router.patch("/v4", userController.getByToken, userController.changePassword);
router.patch(
  "/v5",
  getUserByToken,
  userController.checkOldPassword,
  userController.changePasswordNoToken
);
router.patch("/update", getUserByToken, userController.updateProfile);

module.exports = router;
