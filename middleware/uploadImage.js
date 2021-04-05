var multer = require("multer");
const util = require("util");

const MIME_TYPES = {
  "image/jpg": "jpg",
  "image/jpeg": "jpeg",
  "image/png": "png",
  "application/pdf": "pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
    "docx",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation":
    "pptx",
  "application/zip": "zip",
};

var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads");
  },
  filename: (req, file, cb) => {
    const name = file.originalname.split(" ").join();
    const extension = MIME_TYPES[file.mimetype];
    cb(null, name + "-" + Date.now() + "." + extension);
  },
});

var upload = multer({ storage: storage }).single("image");
var multerInstance = util.promisify(upload);

module.exports = { multerInstance };
