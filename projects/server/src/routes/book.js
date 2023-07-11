const express = require("express");
const router = express.Router();
const bookController = require("../controllers").bookController;
//get

router.get("/", bookController.getAll);
router.get("/:id", bookController.getById);
router.post("/v1", bookController.insertBook);
router.patch("/v2/:id", bookController.editBook);
router.delete("/v3/:id", bookController.deleteBook);

module.exports = router;
