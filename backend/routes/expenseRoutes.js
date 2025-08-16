const express = require('express');
const {
    addExpense,
    getAllExpense,
deleteExpense,
downloadExpenseExcel} = require('../controllers/expenseController');
// console.log('Imported downloadIncomeExcel:', downloadIncomeExcel); // Add this
const {protect} = require('../middlewares/authMiddleware');  
const router = express.Router();

router.post('/add', protect, addExpense); // Add income
router.get('/get', protect, getAllExpense); // Get income  
router.delete('/:id', protect, deleteExpense); // Delete income
router.get('/downloadexcel', protect, downloadExpenseExcel); // Download income as Excel
module.exports = router;


