// import React from 'react'

// const Home = () => {
//   return (
//     <div>Home</div>
//   )
// }

// export default Home
import React from "react";
import { Link } from "react-router-dom"; // ✅ Import Link

const Home = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-96 text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Home</h1>
        <ul className="space-y-2 text-gray-600">
          
          <li className="p-2 bg-gray-50 rounded-md hover:bg-gray-100">
            <Link to="/expense">💸 Expense</Link>
          </li>
          <li className="p-2 bg-gray-50 rounded-md hover:bg-gray-100">
            <Link to="/income">💰 Income</Link>
          </li>
          <li className="p-2 bg-gray-50 rounded-md hover:bg-gray-100">
            <Link to="/dashboard">📊 Dashboard</Link>
          </li>
        </ul>
        <p className="mt-6 text-sm text-gray-500 italic">Coming soon...</p>
      </div>
    </div>
  );
};

export default Home;
