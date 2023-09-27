const multer = require("multer");
const multerConfig = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "public/images");
  },
  filename: (req, file, callback) => {
    console.log("Filename:", req.headers.imagename);
    const ext = file.mimetype.split("/")[1];
    callback(null, `${req.headers.imagename}.${ext}`);
  },
});
const isImage = (req, file, callback) => {
  if (file.mimetype.startsWith("image")) {
    callback(null, true);
  } else {
    const error = { message: "Only image is allowed.", status: 400 };
    callback(error);
  }
};
const upload = multer({
  storage: multerConfig,
  fileFilter: isImage,
});
exports.uploadImage = (req, res, next) => {
  console.log("Called!!");
  // Use the upload middleware to handle the file upload
  upload.single("photo")(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      // Handle Multer errors
      console.log("Multer error:", err);
      req.error = err;
      // return res.status(err.status || 500).json({ err });
    } else if (err) {
      // Handle other errors (e.g., non-image files)
      req.error = err;
      console.log("Unknown error:", err);
      // return res.status(err.status || 500).send(err);
    }

    // If there is no error, you can access the file details via req.file
    // Pass the file details to the next function in the middleware chain

    // Continue to the next middleware function
    next();
  });
};
exports.upload = (req, res) => {
  //   console.log(req.file);
  if (!req.error) {
    res.status(200).send(req.file);
  } else {
    const { message, status } = req.error;
    console.log(message);
    res.status(status).json({ message });
  }
};
