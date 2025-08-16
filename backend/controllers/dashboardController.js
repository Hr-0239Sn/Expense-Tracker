
// const Income = require('../models/Income');
// const Expense = require('../models/Expense');
// const { isValidObjectId, Types } = require('mongoose');

// exports.getDashboardData = async (req, res) => {
    

//     try {
//         // Validate userId
//         // if (!isValidObjectId(userId)) {
//         //     return res.status(400).json({ message: 'Invalid user ID' });
//         // }
// const userId = req.user._id;
//         const userObjectId = new Types.ObjectId(String(userId));

//      const totalIncome = await Income.aggregate([
//             { $match: { userId: userObjectId } },
//             { $group: { _id: null, total: { $sum: '$amount' } } }
//         ]);
//         console.log('totalIncome:', { totalIncome, userId: isValidObjectId(userId) });
//         const totalExpense = await Expense.aggregate([
//             { $match: { userId: userObjectId } },
//             { $group: { _id: null, total: { $sum: '$amount' } } }
//         ]);

//         // get income transactions last 60 days
//         const last60DaysIncomeTransactions = await Income.find({
//             userId,
//             date: { $gte: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000) } // 60 days ago
//         }).sort({ date: -1 });
//         // get total income for last 60 days
//         const totalLast60DaysIncome = last60DaysIncomeTransactions.reduce((sum, transaction) =>
//             sum + transaction.amount, 0
//         );
//         // get expense transactions last 30 days
//         const last30DaysExpenseTransactions = await Expense.find({
//             userId,
//             date: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } // 30 days ago
//         }).sort({ date: -1 });
//         // get total expense for last 30 days
//         const totalLast30DaysExpense = last30DaysExpenseTransactions.reduce((sum, transaction) => sum + transaction.amount, 0
//         );
//         // Calculate balance
//         const balance = (totalIncome[0]?.total || 0) - (totalExpense
// [0]?.total || 0);
//         // final response
//         res.status(200).json({
//             totalBalance:
//             (totalIncome[0]?.total || 0) - (totalExpense[0]?.total || 0),
//             totalIncome: totalIncome[0]?.total || 0,
//             totalExpense: totalExpense[0]?.total || 0,
//             last30DaysExpenses:{
//                 total: totalLast30DaysExpense,
//                 transactions: last30DaysExpenseTransactions
//             },
//             last60DaysIncome: {
//                 total: totalLast60DaysIncome,
//                 transactions: last60DaysIncomeTransactions
//             },
//             balance: balance




//         });
//     }
//     catch (error) {
//         console.error('Error fetching dashboard data:', error);
//         res.status(500).json({ message: 'Server error', error: error.message });
//     }
// };

const Income = require('../models/Income');
const Expense = require('../models/Expense');
const { isValidObjectId, Types } = require('mongoose');

// Helper function to calculate date X days ago
const getDateDaysAgo = (days) => new Date(Date.now() - days * 24 * 60 * 60 * 1000);

exports.getDashboardData = async (req, res) => {
    try {
        const userId = req.user._id;
        
        // Validate userId
        if (!isValidObjectId(userId)) {
            return res.status(400).json({ 
                success: false,
                message: 'Invalid user ID format' 
            });
        }

        const userObjectId = new Types.ObjectId(userId);

        // Execute all queries in parallel for better performance
        const [
            totalIncomeResult,
            totalExpenseResult,
            last60DaysIncomeTransactions,
            last30DaysExpenseTransactions
        ] = await Promise.all([
            // Total income aggregation
            Income.aggregate([
                { $match: { userId: userObjectId } },
                { $group: { _id: null, total: { $sum: '$amount' } } }
            ]),
            
            // Total expense aggregation
            Expense.aggregate([
                { $match: { userId: userObjectId } },
                { $group: { _id: null, total: { $sum: '$amount' } } }
            ]),
            
            // Last 60 days income with sorting and projection
            Income.find({
                userId: userObjectId,
                date: { $gte: getDateDaysAgo(60) }
            })
            .sort({ date: -1 })
            .select('amount description date category')
            .lean(),
            
            // Last 30 days expenses with sorting and projection
            Expense.find({
                userId: userObjectId,
                date: { $gte: getDateDaysAgo(30) }
            })
            .sort({ date: -1 })
            .select('amount description date category')
            .lean()
        ]);

        // Extract totals from aggregation results
        const totalIncome = totalIncomeResult[0]?.total || 0;
        const totalExpense = totalExpenseResult[0]?.total || 0;
        const totalBalance = totalIncome - totalExpense;

        // Calculate period totals
        const totalLast60DaysIncome = last60DaysIncomeTransactions.reduce(
            (sum, t) => sum + t.amount, 0
        );
        const totalLast30DaysExpense = last30DaysExpenseTransactions.reduce(
            (sum, t) => sum + t.amount, 0
        );

        // Format response
        const response = {
            success: true,
            data: {
                summary: {
                    totalBalance,
                    totalIncome,
                    totalExpense
                },
                recentTransactions: {
                    income: {
                        total: totalLast60DaysIncome,
                        count: last60DaysIncomeTransactions.length,
                        transactions: last60DaysIncomeTransactions.slice(0, 10) // Limit to 10 most recent
                    },
                    expense: {
                        total: totalLast30DaysExpense,
                        count: last30DaysExpenseTransactions.length,
                        transactions: last30DaysExpenseTransactions.slice(0, 10) // Limit to 10 most recent
                    }
                }
            }
        };

        res.status(200).json(response);
    } catch (error) {
        console.error('Error fetching dashboard data:', error);
        res.status(500).json({ 
            success: false,
            message: 'Failed to fetch dashboard data',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};



