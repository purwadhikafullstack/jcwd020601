const express = require("express");
const router = express.Router();
const { fileUploader, upload } = require("../middlewares/multer");
const getUserByToken = require("../middlewares/getuserbytoken");

const userController = require("../controllers").userController;
//get

router.get("/", userController.getAll);
router.get("/image/render/:id", userController.renderAvatar);
router.get("/email", userController.getByEmail);
router.get("/generate-token/email", userController.generateTokenByEmail);
router.get(
  "/generate-token/emailVerify",
  userController.generateTokenByEmailVerify
);
router.get("/token/verifyemail", getUserByToken, userController.verifyEmail);
router.get("/v3", userController.getByToken, userController.getUserByToken);
router.get("/:id", userController.getById);
router.post("/v1", userController.insertUser);
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
// router.post(
//   "/image/v2/:id",
//   upload.single("avatar"),
//   userController.uploadAvatarv2
// );
router.patch("/v4", userController.getByToken, userController.changePassword);
router.patch(
  "/v5",

  userController.checkOldPassword,
  userController.changePasswordNoToken
);
router.patch("/update", userController.updateProfile);
router.patch("/v2/:id", userController.editUser);
router.delete("/v3/:id", userController.deleteUser);

module.exports = router;
