
const xlsx = require('xlsx');
// const User = require('../models/User');
const Expense = require('../models/Expense');

// Helper function to validate date
const isValidDate = (dateString) => {
  const date = new Date(dateString);
  return !isNaN(date.getTime());
};

// add Expense category
const addExpense = async (req, res) => {
    const userId = req.user._id;

    try {
        const { icon, category, date, amount } = req.body;

        // validation: check for the missing fields
        if (!category || !date || !amount) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Additional date validation
        if (!isValidDate(date)) {
            return res.status(400).json({ 
              message: 'Invalid date format. Please use YYYY-MM-DD format' 
            });
        }

        // Create a new Expense document
        const newExpense = new Expense({
            userId,
            icon,
            category,
            date: new Date(date),
            amount: Number(amount) // Ensure amount is a number
        });

        // Validate the document before saving
        await newExpense.validate();

        // Save the Expense document to the database
        await newExpense.save();

        res.status(200).json(newExpense);
    } catch (error) {
        console.error('Error adding Expense:', error);
        if (error.name === 'ValidationError') {
            return res.status(400).json({ 
              message: 'Validation error',
              error: error.message 
            });
        }
        res.status(500).json({ 
          message: 'Server error', 
          error: error.message 
        });
    }
};
// get all Expense categorys
const getAllExpense = async (req, res) => {
    const userId = req.user._id; // Get user ID from the request

    try {
        // Fetch all Expense documents for the user
        const expense = await Expense.find({ userId }).sort({ date: -1 });

        res.status(200).json(Expense);
    } catch (error) {
        console.error('Error fetching Expenses:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}

    // delete Expense category
const deleteExpense = async (req, res) => {
    const userId = req.user._id; // Get user ID from the request
    // const ExpenseId = req.params.id; // Get Expense ID from the request parameters

    try {
        // Find and delete the Expense document
        await Expense.findByIdAndDelete(req.params.id);
          res.status(200).json({ message: 'Expense deleted successfully' });
        if (!deleteExpense) {
            return res.status(404).json({ message: 'Expense not found' });
        }

        res.status(200).json({ message: 'Expense deleted successfully' });
    } catch (error) {
        console.error('Error deleting Expense:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}

  // download Expense as Excel
// exports.downloadExpenseExcel = async (req, res) => {}
    const downloadExpenseExcel = async (req, res) => {
        const userId = req.user._id; // Get user ID from the request
        try{
            const expenses = await Expense.find({ userId }).sort({date: -1 });
            //prepare data for Excel
            const data = expense.map((item) => ({
                
                category: item.category,
                Date: item.date, // Format date as YYYY-MM-DD
                Amount: item.amount
            }));
            const wb = xlsx.utils.book_new();
            const ws = xlsx.utils.json_to_sheet(data);
            xlsx.utils.book_append_sheet(wb, ws, 'expense');
            xlsx.writeFile(wb, 'expense_details.xlsx');
            res.download('expense_details.xlsx');
        } catch (error) {
            res.status(500).json({ message: 'Server error', error: error.message });

        }
    }

    module.exports = {
    addExpense,
    getAllExpense,   
    deleteExpense,
    downloadExpenseExcel
};