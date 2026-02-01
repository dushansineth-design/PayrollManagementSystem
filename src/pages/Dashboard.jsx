// import { useNavigate } from "react-router-dom";

// function Dashboard() {
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     navigate("/");
//   };

//   return (
//     <div className="min-h-screen flex bg-gray-100">
//       {/* Sidebar */}
//       <div className="w-64 bg-gray-900 text-white p-5">
//         <h2 className="text-2xl font-bold mb-8">Payroll Admin</h2>
//         <ul className="space-y-4">
//           <li
//             onClick={() => navigate("/dashboard")}
//             className="hover:text-blue-400 cursor-pointer"
//           >
//             Dashboard
//           </li>
//           <li
//             onClick={() => navigate("/employees")}
//             className="hover:text-blue-400 cursor-pointer"
//           >
//             Employees
//           </li>
//           <li className="hover:text-blue-400 cursor-pointer">Attendance</li>
//           <li className="hover:text-blue-400 cursor-pointer">Salary</li>
//           <li className="hover:text-blue-400 cursor-pointer">Reports</li>
//           <li
//             onClick={handleLogout}
//             className="hover:text-red-400 cursor-pointer mt-10"
//           >
//             Logout
//           </li>
//         </ul>
//       </div>

//       {/* Main Content */}
//       <div className="flex-1 p-10">
//         <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
//         <p>Welcome to the Payroll Management System.</p>
//       </div>
//     </div>
//   );
// }

// export default Dashboard;


function Dashboard() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
      <p>Welcome to the Karunaratna Stores Payroll Management System.</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-700">Total Employees</h3>
          <p className="text-3xl font-bold text-blue-600 mt-2">12</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-700">Total Payroll (Nov)</h3>
          <p className="text-3xl font-bold text-green-600 mt-2">LKR 450,000</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-700">Pending Actions</h3>
          <p className="text-3xl font-bold text-orange-500 mt-2">2</p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;

