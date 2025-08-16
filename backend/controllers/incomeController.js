// const User = require('../models/User');
// const Income = require('../models/Income');
 
// // add income source
// const addIncome = async (req, res) => {
//     const userId = req.user._id; // Get user ID from the request

//     try {
//         const { icon, source, date, amount } = req.body;

// // validation: check for the missing fields
//         if (!source || !date || !amount) {
//             return res.status(400).json({ message: 'All fields are required' });
//         }

//         // Create a new income document
//         const newIncome = new Income({
//             userId,
//             icon,
//             source,
//             date: new Date(date), // Ensure date is a Date object
//             amount
//         });

//         // Save the income document to the database
//         await newIncome.save();

//         res.status(200).json(newIncome);
//     }catch (error) {
//         res.status(500).json({ message: 'Server error', error: error.message });
// }}


const xlsx = require('xlsx');
// const User = require('../models/User');
const Income = require('../models/Income');

// Helper function to validate date
const isValidDate = (dateString) => {
  const date = new Date(dateString);
  return !isNaN(date.getTime());
};

// add income source
const addIncome = async (req, res) => {
    const userId = req.user._id;

    try {
        const { icon, source, date, amount } = req.body;

        // validation: check for the missing fields
        if (!source || !date || !amount) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Additional date validation
        if (!isValidDate(date)) {
            return res.status(400).json({ 
              message: 'Invalid date format. Please use YYYY-MM-DD format' 
            });
        }

        // Create a new income document
        const newIncome = new Income({
            userId,
            icon,
            source,
            date: new Date(date),
            amount: Number(amount) // Ensure amount is a number
        });

        // Validate the document before saving
        await newIncome.validate();

        // Save the income document to the database
        await newIncome.save();

        res.status(200).json(newIncome);
    } catch (error) {
        console.error('Error adding income:', error);
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
// get all income sources
const getAllIncome = async (req, res) => {
    const userId = req.user._id; // Get user ID from the request

    try {
        // Fetch all income documents for the user
        const incomes = await Income.find({ userId }).sort({ date: -1 });

        res.status(200).json(incomes);
    } catch (error) {
        console.error('Error fetching incomes:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}

    // delete income source
const deleteIncome = async (req, res) => {
    const userId = req.user._id; // Get user ID from the request
    // const incomeId = req.params.id; // Get income ID from the request parameters

    try {
        // Find and delete the income document
        await Income.findByIdAndDelete(req.params.id);
          res.status(200).json({ message: 'Income deleted successfully' });
        if (!deletedIncome) {
            return res.status(404).json({ message: 'Income not found' });
        }

        res.status(200).json({ message: 'Income deleted successfully' });
    } catch (error) {
        console.error('Error deleting income:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}

  // download income as Excel
// exports.downloadIncomeExcel = async (req, res) => {}
    const downloadIncomeExcel = async (req, res) => {
        const userId = req.user._id; // Get user ID from the request
        try{
            const income = await Income.find({ userId }).sort({date: -1 });
            //prepare data for Excel
            const data = income.map((item) => ({
                
                Source: item.source,
                Date: item.date, // Format date as YYYY-MM-DD
                Amount: item.amount
            }));
            const wb = xlsx.utils.book_new();
            const ws = xlsx.utils.json_to_sheet(data);
            xlsx.utils.book_append_sheet(wb, ws, 'Income');
            xlsx.writeFile(wb, 'income_details.xlsx');
            res.download('income_details.xlsx');
        } catch (error) {
            res.status(500).json({ message: 'Server error', error: error.message });

        }
    }

    module.exports = {
    addIncome,
    getAllIncome,   
    deleteIncome,
    downloadIncomeExcel
};