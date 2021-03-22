var multer = require("multer");
const util = require("util");

const MIME_TYPES = {
  "image/jpg": "jpg",
  "image/jpeg": "jpeg",
  "image/png": "png",
  "application/pdf": "pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
    "docx",
  "application/zip": "zip",
};

var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/uploads");
  },
  filename: (req, file, cb) => {
    const name = file.originalname.split(" ").join();
    const extension = MIME_TYPES[file.mimetype];
    cb(null, name + "-" + Date.now() + "." + extension);
  },
});

var upload = multer({ storage: storage }).single("image");
var multerInstance = util.promisify(upload);

// const test = (req, res, next) => {
//   console.log(req);
//   console.log(req.file);
// };

module.exports = { multerInstance };
