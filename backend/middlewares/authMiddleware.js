const jwt = require ('jsonwebtoken');
const User = require('../models/User');

exports.protect = async (req, res, next) => {
    let token = req.headers.authorization?.split(' ')[1];

    // Check if token is in headers
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    // If no token, return unauthorized
    if (!token) 
        return res.status(401).json({ message: 'Not authorized, no token' });
    

    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select('-password'); // Exclude password from user data
        next();
    } catch (error) {
        res.status(401).json({ message: 'Not authorized, token failed' });
    }
};