const express = require("express");
const router = express.Router();
const { fileUploader } = require("../middlewares/multer");
const validate = require("../middlewares/validateAdmin");
const bookController = require("../controllers").bookController;
//get

router.get("/", bookController.getAll);
router.get("/:id", validate, bookController.getById);
router.post(
  "/v1",
  fileUploader({ destinationFolder: "book" }).single("book_url"),
  validate,
  bookController.insertBook
);
router.patch(
  "/v2/:id",
  fileUploader({ destinationFolder: "book" }).single("book_url"),
  validate,
  bookController.editBook
);
router.delete("/v3/:id", validate, bookController.deleteBook);

module.exports = router;
