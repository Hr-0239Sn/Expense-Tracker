const express = require('express');
const {protect} = require('../middlewares/authMiddleware');

const multer = require('multer');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // 👈 make sure this folder exists
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  }
});

const upload = multer({ storage: storage }); // 👈 THIS is what defines `upload`


const{
    registerUser,
    loginUser,
    getUserInfo,
} = require('../controllers/authController');

const router = express.Router();
// Route to register a new user
router.post('/register', registerUser);         
// Route to login a user
router.post('/login', loginUser);   
// Route to get user information
router.get('/getUser', protect, getUserInfo);
// Export the router
router.post("/upload-image", upload.single("image"), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }
    const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    res.status(200).json({ imageUrl });});
module.exports = router;