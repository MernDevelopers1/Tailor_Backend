const multer = require("multer");
const multerConfig = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, "public/images");
    },
    filename: (req, file, callback) => {
        console.log("Filename:",req.headers.imagename);
        const ext = file.mimetype.split('/')[1];
        callback(null, `${req.headers.imagename}.${ext}`);
    }
});
const isImage = (req, file, callback) => {
    if (file.mimetype.startsWith("image")) {
        callback(null, true);
    } else {
        callback(new Error("only image is Allowed.."));
    }
}
const upload = multer({
    storage: multerConfig,
    fileFilter:isImage,
});
exports.uploadImage = upload.single('photo');
exports.upload = (req, res) => {
    // console.log(req.file);
    res.status(200).send(req.file);
}