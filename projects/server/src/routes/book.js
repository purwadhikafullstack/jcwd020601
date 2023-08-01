const express = require("express");
const router = express.Router();
const { fileUploader } = require("../middlewares/multer");
const bookController = require("../controllers").bookController;
//get

router.get("/", bookController.getAll);
router.get("/:id", bookController.getById);
router.post(
  "/v1",
  fileUploader({ destinationFolder: "book" }).single("book_url"),
  bookController.insertBook
);
router.patch(
  "/v2/:id",
  fileUploader({ destinationFolder: "book" }).single("book_url"),
  bookController.editBook
);
router.delete("/v3/:id", bookController.deleteBook);

module.exports = router;
