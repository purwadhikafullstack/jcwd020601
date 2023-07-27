const multer = require("multer");
const { nanoid } = require("nanoid");

const fileUploader = ({
	destinationFolder = "",
	prefix = "POST",
	fileType = "image",
}) => {
	const storageConfig = multer.diskStorage({
		destination: (req, file, cb) => {
			cb(null, `${__dirname}//../public/${destinationFolder}`);
		},
		filename: (req, file, cb) => {
			const fileExtension = file.mimetype.split("/")[1];
			const filename = `${prefix}_${nanoid()}.${fileExtension}`;
			cb(null, filename);
		},
	});

	const uploader = multer({
		storage: storageConfig,
		fileFilter: (req, file, cb) => {
			console.log(file);


      if (file.mimetype.split("/")[0] != fileType) {
        return cb(null, false);
      }
      cb(null, true);
    },
  });
  return uploader;
};
const upload = multer({
	limits: {
		fileSize: 10000000,
	},
	fileFilter: (req, file, cb) => {
		console.log(file);
		const file_type = file.mimetype.split("/")[0];
		const format_file = file.mimetype.split("/")[1];

		// if (file_type != "image" && format_file != ("jpg" || "png")) {
		// 	return cb(null, false);
		// }
		if (file.mimetype.split("/")[0] != "image") {
			return cb(null, false);
		}
		cb(null, true);
	},
});
module.exports = { fileUploader, upload };
