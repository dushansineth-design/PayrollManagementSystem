import React, { useState, useEffect } from 'react';
import { Pencil, Trash2, X, Save } from 'lucide-react';

function Employees() {
  const [employees, setEmployees] = useState([]);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Load Data
  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = () => {
    const masterList = JSON.parse(localStorage.getItem('master_employee_list') || '[]');
    setEmployees(masterList);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      const updatedList = employees.filter(emp => emp.id !== id);
      setEmployees(updatedList);
      localStorage.setItem('master_employee_list', JSON.stringify(updatedList));
    }
  };

  const handleEditClick = (emp) => {
    setEditingEmployee({ ...emp });
    setIsModalOpen(true);
  };

  const handleSaveEdit = () => {
    if (!editingEmployee) return;

    const masterList = JSON.parse(localStorage.getItem('master_employee_list') || '[]');
    const empIndex = masterList.findIndex(emp => emp.id === editingEmployee.id);

    if (empIndex > -1) {
      // Update fields
      masterList[empIndex].employeeId = editingEmployee.employeeId;
      masterList[empIndex].name = editingEmployee.name;
      masterList[empIndex].email = editingEmployee.email;
      masterList[empIndex].phone = editingEmployee.phone;
      masterList[empIndex].position = editingEmployee.position;
      masterList[empIndex].nic = editingEmployee.nic;
      masterList[empIndex].dob = editingEmployee.dob;
      masterList[empIndex].gender = editingEmployee.gender;
      masterList[empIndex].maritalStatus = editingEmployee.maritalStatus;
      masterList[empIndex].address = editingEmployee.address;

      // Don't save netSalary to master list
      localStorage.setItem('master_employee_list', JSON.stringify(masterList));
      setEmployees(masterList); // Update local state after saving to storage
    }

    setIsModalOpen(false);
    setEditingEmployee(null);
  };

  return (
    <div className="p-6 h-full overflow-y-auto w-full">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Employee Management</h1>

      <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-700">All Employees</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-max">
            <thead className="bg-gray-100 text-gray-600 uppercase text-xs font-bold">
              <tr>
                <th className="p-4 border-b whitespace-nowrap">Employee ID</th>
                <th className="p-4 border-b whitespace-nowrap">Position</th>
                <th className="p-4 border-b whitespace-nowrap">Full Name</th>
                <th className="p-4 border-b whitespace-nowrap">NIC / Passport</th>
                <th className="p-4 border-b whitespace-nowrap">Gender</th>
                <th className="p-4 border-b whitespace-nowrap">Marital Status</th>
                <th className="p-4 border-b whitespace-nowrap">Contact Number</th>
                <th className="p-4 border-b whitespace-nowrap">Email Address</th>
                <th className="p-4 border-b whitespace-nowrap">Address</th>
                <th className="p-4 border-b text-center whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm text-gray-700">
              {employees.length === 0 ? (
                <tr>
                  <td colSpan="10" className="p-8 text-center text-gray-500 italic">
                    No employees found. Add employees in the Payroll section first.
                  </td>
                </tr>
              ) : (
                employees.map((emp) => (
                  <tr key={emp.id} className="border-b hover:bg-gray-50 transition-all">
                    <td className="p-4 font-mono font-medium text-blue-900 bg-blue-50 text-center">{emp.employeeId || '-'}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${emp.position ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-500'
                        }`}>
                        {emp.position || 'N/A'}
                      </span>
                    </td>
                    <td className="p-4 font-medium">{emp.name || '-'}</td>
                    <td className="p-4">{emp.nic || '-'}</td>
                    <td className="p-4 capitalize">{emp.gender || '-'}</td>
                    <td className="p-4 capitalize">{emp.maritalStatus || '-'}</td>
                    <td className="p-4">{emp.phone || '-'}</td>
                    <td className="p-4">{emp.email || '-'}</td>
                    <td className="p-4 max-w-xs truncate" title={emp.address}>{emp.address || '-'}</td>
                    <td className="p-4 flex justify-center gap-3">
                      <button
                        onClick={() => handleEditClick(emp)}
                        className="bg-green-100 text-green-700 p-2 rounded-lg hover:bg-green-200 transition-colors"
                        title="Edit Details"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(emp.id)}
                        className="bg-red-100 text-red-700 p-2 rounded-lg hover:bg-red-200 transition-colors"
                        title="Delete Employee"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      {isModalOpen && editingEmployee && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 animate-fadeIn p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl p-6 transform transition-all scale-100 h-auto max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-800">Edit Employee Details</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Employee ID</label>
                <input
                  type="text"
                  value={editingEmployee.employeeId}
                  onChange={(e) => setEditingEmployee({ ...editingEmployee, employeeId: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={editingEmployee.name}
                  onChange={(e) => setEditingEmployee({ ...editingEmployee, name: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
                <input
                  type="text"
                  value={editingEmployee.position}
                  onChange={(e) => setEditingEmployee({ ...editingEmployee, position: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">NIC / Passport No</label>
                <input
                  type="text"
                  value={editingEmployee.nic}
                  onChange={(e) => setEditingEmployee({ ...editingEmployee, nic: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                <input
                  type="date"
                  value={editingEmployee.dob}
                  onChange={(e) => setEditingEmployee({ ...editingEmployee, dob: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                <select
                  value={editingEmployee.gender}
                  onChange={(e) => setEditingEmployee({ ...editingEmployee, gender: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Marital Status</label>
                <select
                  value={editingEmployee.maritalStatus}
                  onChange={(e) => setEditingEmployee({ ...editingEmployee, maritalStatus: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
                >
                  <option value="">Select Status</option>
                  <option value="single">Single</option>
                  <option value="married">Married</option>
                  <option value="divorced">Divorced</option>
                  <option value="widowed">Widowed</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number</label>
                <input
                  type="tel"
                  value={editingEmployee.phone}
                  onChange={(e) => setEditingEmployee({ ...editingEmployee, phone: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input
                  type="email"
                  value={editingEmployee.email}
                  onChange={(e) => setEditingEmployee({ ...editingEmployee, email: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <textarea
                  value={editingEmployee.address}
                  onChange={(e) => setEditingEmployee({ ...editingEmployee, address: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  rows="3"
                />
              </div>
            </div>

            <div className="pt-6 flex gap-3 border-t mt-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex justify-center items-center gap-2"
              >
                <Save size={18} /> Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Employees;
