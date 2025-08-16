const mongoose = require("mongoose");
const ExpenseSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        icon: {
            type: String,
        },
        date: {
            type: Date,
            default: Date.now,
        },
        amount: {
            type: Number,
            required: true,
        },
        category: {
            type: String,
            required: true, // e.g., groceries, utilities, etc.
        },
    },
    {
        timestamps: true,
    }
);
module.exports = mongoose.model("Expense", ExpenseSchema);
