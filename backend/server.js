require("dotenv").config();
const express = require("express"); 
const cors = require("cors");
const path = require("path");

const app = express();
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const incomeRoutes = require("./routes/incomeRoutes");
const expenseRoutes = require("./routes/expenseRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");

app.use(express.json()); // ✅ This parses incoming JSON requests

// middleware to handle CORS
app.use(cors({
    origin: process.env.CLIENT_URL || "*",
    // origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));


const PORT = process.env.PORT || 5500;
// Connect to MongoDB
connectDB();

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/income", incomeRoutes); // this the API path basic path methods also need to be set in the frontend
app.use("/api/v1/expense", expenseRoutes);
app.use("/api/v1/dashboard", dashboardRoutes);

app.use("/uploads", express.static(path.join(__dirname, "uploads"))); // Serve static files from the uploads directory

app.post('/test', (req, res) => {
    console.log(req.body); // Log the request body to the console
    res.json({ message: 'Received', body: req.body });
});

// app.listen(PORT, () =>  console.log(`Server is running on port ${PORT}`) 
// );
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
});



