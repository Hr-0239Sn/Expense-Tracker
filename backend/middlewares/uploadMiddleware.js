const multer = require('multer');

//configure storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // specify the directory to save uploaded files
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`); // append timestamp to the original file name
    },
});

// file filter
const fileFilter = (req, file, cb) => {
    // Accept images only
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true); // accept the file
    } else {
        cb(new Error('Only .png, .jpg and .jpeg format allowed!'), false); // reject the file
    }
};

const upload = multer({storage, fileFilter});

module.exports = upload;