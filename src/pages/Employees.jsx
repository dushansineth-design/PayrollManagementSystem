function Employees() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Employee Management</h1>

      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Add Employee</h2>

        <div className="grid grid-cols-2 gap-4">
          <input className="border p-2 rounded" placeholder="Name" />
          <input className="border p-2 rounded" placeholder="Email" />
          <input className="border p-2 rounded" placeholder="Phone" />
          <input className="border p-2 rounded" placeholder="Position" />
          <input className="border p-2 rounded" placeholder="Basic Salary" />
        </div>

        <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded">
          Add Employee
        </button>
      </div>

      <div className="bg-white p-6 rounded shadow mt-8">
        <h2 className="text-xl font-semibold mb-4">Employee List</h2>

        <table className="w-full border">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2">Name</th>
              <th className="p-2">Email</th>
              <th className="p-2">Phone</th>
              <th className="p-2">Position</th>
              <th className="p-2">Salary</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr className="text-center border-t">
              <td className="p-2">John</td>
              <td className="p-2">john@gmail.com</td>
              <td className="p-2">0771234567</td>
              <td className="p-2">Cashier</td>
              <td className="p-2">50000</td>
              <td className="p-2">
                <button className="bg-yellow-500 text-white px-2 py-1 rounded mr-2">
                  Edit
                </button>
                <button className="bg-red-600 text-white px-2 py-1 rounded">
                  Delete
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Employees;
