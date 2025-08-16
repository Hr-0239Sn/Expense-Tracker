const express = require('express');
const {
    addIncome,
    getAllIncome,
deleteIncome,
downloadIncomeExcel} = require('../controllers/incomeController');
// console.log('Imported downloadIncomeExcel:', downloadIncomeExcel); // Add this
const {protect} = require('../middlewares/authMiddleware');  
const router = express.Router();

router.post('/add', protect, addIncome); // Add income
router.get('/get', protect, getAllIncome); // Get income  
router.delete('/:id', protect, deleteIncome); // Delete income
router.get('/downloadexcel', protect, downloadIncomeExcel); // Download income as Excel
module.exports = router;


