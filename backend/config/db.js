const mongoose = require('mongoose');
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL, {
            // useNewUrlParser: true,
            // useUnifiedTopology: true,
        });
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.err('MongoDB connection failed:', err);
        process.exit(1); // Exit process with failure
    }
};
module.exports = connectDB;
// This file is responsible for connecting to the MongoDB database using Mongoose. 