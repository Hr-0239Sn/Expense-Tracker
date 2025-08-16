const User = require('../models/User');
const jwt = require('jsonwebtoken');
require('dotenv').config();// Load environment variables
//generate JWT token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d' // token expiration date

    });
}

// //register user
// exports.registerUser = async (req, res) => {
//     const { fullName, email, password, profileImageUrl } = req.body;

//     // validate input
//     if (!fullName || !email || !password) {
//         return res.status(400).json({ message: 'Please fill all fields' });
//     }
//     try {
//         // check if user already exists
//         const existingUser = await User.findOne({ email });
//         if (existingUser) {
//             return res.status(400).json({ message: 'User already exists' });
//         }
//         // create new user
//         const user = await User.create({
//             fullName,
//             email,
//             password,
//             profileImageUrl,
//         });
//         res.status(201).json({
//             _id: user._id,
//             user,
//             token: generateToken(user._id),
//         });
//     } catch (error) {
//         res.status(500).json({ message: 'Server error' });

//         // generate token
// }};

exports.registerUser = async (req, res) => {
    // Check if req.body is defined
    if (!req.body) {
        return res.status(400).json({ message: 'Request body is missing.' });
    }

    const { fullName, email, password, profileImageUrl } = req.body;

    // Validate input
    if (!fullName || !email || !password) {
        return res.status(400).json({ message: 'Please fill all fields' });
    }

    try {
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Create new user
        const user = await User.create({
            fullName,
            email,
            password,
            profileImageUrl,
        });

        res.status(201).json({
            _id: user._id,
            user,
            token: generateToken(user._id),
        });
    } catch (error) {
        console.error(error); // Log the error for debugging
        res.status(500).json({ message: 'Server error' });
    }
};


//login user
exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    // validate input
    if (!email || !password) {
        return res.status(400).json({ message: 'Please fill all fields' });
    }
    try {
        // check if user exists
        const user = await User.findOne({ email });
        if (!user || !(await user.comparePassword(password))){
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // generate token and send response
        res.status(200).json({
            _id: user._id,
            user,
            token: generateToken(user._id),
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
}; 
//getuserinfo user
exports.getUserInfo = async (req, res) => {
    try{
        const user = await User.findById(req.user._id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// // Example usage in login/register
// const token = generateToken(user._id);