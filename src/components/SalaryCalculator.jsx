import React, { useState, useEffect } from 'react';
import { Download, Plus, Trash2, Calculator } from 'lucide-react';
import { generatePayslip } from '../utils/pdfGenerator';

import { calculateSalary } from '../utils/salaryLogic';

const SalaryCalculator = () => {
    // 1. Month State (YYYY-MM format for input type="month")
    const [monthYear, setMonthYear] = useState(() => {
        const now = new Date();
        return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    });

    const [employees, setEmployees] = useState([]);

    // 2. Load data when month changes
    useEffect(() => {
        const savedData = localStorage.getItem(`payroll_data_${monthYear}`);
        if (savedData) {
            setEmployees(JSON.parse(savedData));
        } else {
            setEmployees([]); // Reset for new month
        }
    }, [monthYear]);

    // 3. Save data when employees change
    useEffect(() => {
        // Avoid overwriting with empty array on initial render if month hasn't loaded 
        // But here we want to save whatever is in state to the CURRENT month key.
        if (monthYear) {
            localStorage.setItem(`payroll_data_${monthYear}`, JSON.stringify(employees));
        }
    }, [employees, monthYear]);

    const addEmployee = () => {
        const newEmp = {
            id: Date.now(),
            employeeId: '', // Manual ID
            name: '',
            workingDays: 0,
            basicSalary: 0,
            perfScore: 0,
            instance: 0,
            noPayDays: 0,
            workedWeekendDays: 0,
            workedPoyaDays: 0,
            workedMercDays: 0,
            otHours: 0,
            deductionAdvance: 0,
            deductionLoan: 0,
            deductionWelfare: 0
        };

        setEmployees([...employees, newEmp]);

        // Sync to Master Employee List
        const masterList = JSON.parse(localStorage.getItem('master_employee_list') || '[]');
        // Check if ID exists (should be unique due to Date.now(), but strictly: new employee)
        // actually we just push it. Profile details will be empty initially.
        masterList.push({
            id: newEmp.id,
            employeeId: '',
            name: '',
            position: '',
            nic: '',
            dob: '',
            gender: '',
            maritalStatus: '',
            phone: '', // Contact Number
            email: '',
            address: ''
        });
        localStorage.setItem('master_employee_list', JSON.stringify(masterList));
    };

    const removeEmployee = (id) => {
        setEmployees(employees.filter(emp => emp.id !== id));
    };

    const updateEmployee = (id, field, value) => {
        setEmployees(employees.map(emp =>
            emp.id === id ? { ...emp, [field]: value } : emp
        ));

        // Sync Name or EmployeeID to Master List
        if (field === 'name' || field === 'employeeId') {
            const masterList = JSON.parse(localStorage.getItem('master_employee_list') || '[]');
            const empIndex = masterList.findIndex(e => e.id === id);
            if (empIndex > -1) {
                masterList[empIndex][field] = value;
                localStorage.setItem('master_employee_list', JSON.stringify(masterList));
            }
        }
    };


    // Logout moved to Navbar

    return (
        <div className="p-4 overflow-x-auto min-h-full">
            <div className="mb-6 flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-bold text-gray-800">Salary Calculator</h2>
                    <input
                        type="month"
                        value={monthYear}
                        onChange={(e) => setMonthYear(e.target.value)}
                        className="mt-2 border rounded p-1 text-sm block"
                    />
                </div>
                <button
                    onClick={addEmployee}
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    <Plus size={16} /> Add Employee
                </button>
            </div>

            <div className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-100 text-gray-700 font-semibold uppercase text-xs">
                            <tr>
                                <th rowSpan="2" className="p-3 border-r border-b min-w-[50px]">ID</th>
                                <th rowSpan="2" className="p-3 border-r border-b min-w-[200px]">Name</th>
                                <th rowSpan="2" className="p-3 border-r border-b min-w-[80px]">Work Days</th>
                                <th rowSpan="2" className="p-3 border-r border-b min-w-[120px]">Basic Salary</th>

                                <th rowSpan="2" className="p-3 border-r border-b min-w-[100px] bg-blue-50">Att Allow</th>

                                {/* Perf Allowances */}
                                <th rowSpan="2" className="p-3 border-r border-b min-w-[150px] bg-indigo-50">Perf Score %</th>
                                <th rowSpan="2" className="p-3 border-r border-b min-w-[100px] bg-indigo-50">Perf Allow</th>

                                <th rowSpan="2" className="p-3 border-r border-b min-w-[80px]">Inst</th>

                                <th rowSpan="2" className="p-3 border-r border-b min-w-[80px]">No Pay Days</th>
                                {/* Calculated */}
                                <th rowSpan="2" className="p-3 border-r border-b min-w-[100px] bg-yellow-50">No Pay Amt</th>
                                <th rowSpan="2" className="p-3 border-r border-b min-w-[100px] bg-yellow-50">Adj. Basic</th>

                                <th rowSpan="2" className="p-3 border-r border-b min-w-[80px]">Wk Day Worked</th>
                                <th rowSpan="2" className="p-3 border-r border-b min-w-[100px] bg-yellow-50">Wk Holi Pay</th>

                                <th rowSpan="2" className="p-3 border-r border-b min-w-[80px]">Poya Days</th>
                                <th rowSpan="2" className="p-3 border-r border-b min-w-[100px] bg-yellow-50">Poya Amt</th>

                                <th rowSpan="2" className="p-3 border-r border-b min-w-[80px]">Merc Days</th>
                                <th rowSpan="2" className="p-3 border-r border-b min-w-[100px] bg-yellow-50">Merc Amt</th>

                                {/* Deductions Main Header */}
                                <th colSpan="4" className="p-3 border-r border-b min-w-[400px] text-center bg-red-50">Deduction</th>

                                <th rowSpan="2" className="p-3 border-r border-b min-w-[100px] bg-green-50">Total Earnings</th>

                                <th rowSpan="2" className="p-3 border-r border-b min-w-[80px]">OT Hours</th>
                                <th rowSpan="2" className="p-3 border-r border-b min-w-[100px] bg-yellow-50">OT Amount</th>

                                <th rowSpan="2" className="p-3 border-r border-b min-w-[100px] bg-red-50">EPF 8%</th>
                                <th rowSpan="2" className="p-3 border-r border-b min-w-[100px] bg-blue-50">Net Salary</th>
                                <th rowSpan="2" className="p-3 border-r border-b min-w-[100px] bg-gray-50">EPF 12%</th>
                                <th rowSpan="2" className="p-3 border-r border-b min-w-[100px] bg-gray-50">ETF 3%</th>
                                <th rowSpan="2" className="p-3 min-w-[100px] border-b">Actions</th>
                            </tr>
                            <tr>
                                {/* Deductions Sub Headers */}
                                <th className="p-3 border-r border-b min-w-[100px] bg-red-50">Advance</th>
                                <th className="p-3 border-r border-b min-w-[100px] bg-red-50">Loan</th>
                                <th className="p-3 border-r border-b min-w-[100px] bg-red-50">Welfare</th>
                                <th className="p-3 border-r border-b min-w-[100px] bg-red-100">Total Deduction</th>
                            </tr>
                        </thead>
                        <tbody>
                            {employees.map((emp) => {
                                const results = calculateSalary(emp);
                                return (
                                    <tr key={emp.id} className="border-b hover:bg-gray-50 transition-colors">
                                        <td className="p-2 border-r text-center">
                                            <input
                                                type="text"
                                                value={emp.employeeId}
                                                onChange={(e) => updateEmployee(emp.id, 'employeeId', e.target.value)}
                                                className="w-full border rounded p-1 text-center font-mono text-xs"
                                                placeholder="ID"
                                            />
                                        </td>
                                        <td className="p-2 border-r">
                                            <input
                                                type="text"
                                                value={emp.name}
                                                onChange={(e) => updateEmployee(emp.id, 'name', e.target.value)}
                                                className="w-full border rounded p-1"
                                                placeholder="Name"
                                            />
                                        </td>
                                        <td className="p-2 border-r">
                                            <input
                                                type="number"
                                                value={emp.workingDays}
                                                onChange={(e) => updateEmployee(emp.id, 'workingDays', e.target.value)}
                                                className="w-full border rounded p-1 text-center"
                                            />
                                        </td>
                                        <td className="p-2 border-r">
                                            <input
                                                type="number"
                                                value={emp.basicSalary}
                                                onChange={(e) => updateEmployee(emp.id, 'basicSalary', e.target.value)}
                                                className="w-full border rounded p-1 text-right"
                                            />
                                        </td>

                                        {/* Att Allow */}
                                        <td className="p-2 border-r text-right bg-blue-50 font-mono font-medium">
                                            {results.attAllowance}
                                        </td>

                                        {/* Perf Score & Allow */}
                                        <td className="p-2 border-r bg-indigo-50">
                                            <div className="flex flex-col gap-1">
                                                <input
                                                    type="range"
                                                    min="0"
                                                    max="100"
                                                    value={emp.perfScore}
                                                    onChange={(e) => updateEmployee(emp.id, 'perfScore', e.target.value)}
                                                    className="w-full h-2 bg-indigo-200 rounded-lg appearance-none cursor-pointer"
                                                />
                                                <div className="text-right text-xs font-semibold">{emp.perfScore}%</div>
                                            </div>
                                        </td>
                                        <td className="p-2 border-r text-right bg-indigo-50 font-mono font-medium">
                                            {results.perfAllowance}
                                        </td>

                                        {/* Instance */}
                                        <td className="p-2 border-r">
                                            <input
                                                type="text"
                                                value={emp.instance}
                                                onChange={(e) => updateEmployee(emp.id, 'instance', e.target.value)}
                                                className="w-full border rounded p-1 text-center"
                                            />
                                        </td>

                                        <td className="p-2 border-r">
                                            <input
                                                type="number"
                                                value={emp.noPayDays}
                                                onChange={(e) => updateEmployee(emp.id, 'noPayDays', e.target.value)}
                                                className="w-full border rounded p-1 text-right"
                                            />
                                        </td>

                                        {/* Read Only Calculated Columns */}
                                        <td className="p-2 border-r text-right bg-yellow-50 font-mono text-gray-600">{results.noPayAmount}</td>
                                        <td className="p-2 border-r text-right bg-yellow-50 font-mono font-medium">{results.adjustedBasic}</td>

                                        <td className="p-2 border-r">
                                            <input
                                                type="number"
                                                value={emp.workedWeekendDays}
                                                onChange={(e) => updateEmployee(emp.id, 'workedWeekendDays', e.target.value)}
                                                className="w-full border rounded p-1 text-right"
                                            />
                                        </td>
                                        <td className="p-2 border-r text-right bg-yellow-50 font-mono text-gray-600">{results.weekHolidayPay}</td>

                                        <td className="p-2 border-r">
                                            <input
                                                type="number"
                                                value={emp.workedPoyaDays}
                                                onChange={(e) => updateEmployee(emp.id, 'workedPoyaDays', e.target.value)}
                                                className="w-full border rounded p-1 text-right"
                                            />
                                        </td>
                                        <td className="p-2 border-r text-right bg-yellow-50 font-mono text-gray-600">{results.poyaAmount}</td>

                                        <td className="p-2 border-r">
                                            <input
                                                type="number"
                                                value={emp.workedMercDays}
                                                onChange={(e) => updateEmployee(emp.id, 'workedMercDays', e.target.value)}
                                                className="w-full border rounded p-1 text-right"
                                            />
                                        </td>
                                        <td className="p-2 border-r text-right bg-yellow-50 font-mono text-gray-600">{results.mercAmount}</td>

                                        {/* Deductions Inputs */}
                                        <td className="p-2 border-r bg-red-50">
                                            <input
                                                type="number"
                                                value={emp.deductionAdvance}
                                                onChange={(e) => updateEmployee(emp.id, 'deductionAdvance', e.target.value)}
                                                className="w-full border rounded p-1 text-right text-xs"
                                                placeholder="Adv"
                                            />
                                        </td>
                                        <td className="p-2 border-r bg-red-50">
                                            <input
                                                type="number"
                                                value={emp.deductionLoan}
                                                onChange={(e) => updateEmployee(emp.id, 'deductionLoan', e.target.value)}
                                                className="w-full border rounded p-1 text-right text-xs"
                                                placeholder="Loan"
                                            />
                                        </td>
                                        <td className="p-2 border-r bg-red-50">
                                            <input
                                                type="number"
                                                value={emp.deductionWelfare}
                                                onChange={(e) => updateEmployee(emp.id, 'deductionWelfare', e.target.value)}
                                                className="w-full border rounded p-1 text-right text-xs"
                                                placeholder="Welf"
                                            />
                                        </td>
                                        <td className="p-2 border-r text-right bg-red-100 font-mono font-medium text-red-800">
                                            {results.totalDeduction}
                                        </td>

                                        <td className="p-2 border-r text-right bg-green-50 font-bold font-mono text-green-700">{results.totalEarnings}</td>

                                        <td className="p-2 border-r">
                                            <input
                                                type="number"
                                                value={emp.otHours}
                                                onChange={(e) => updateEmployee(emp.id, 'otHours', e.target.value)}
                                                className="w-full border rounded p-1 text-right"
                                            />
                                        </td>
                                        <td className="p-2 border-r text-right bg-yellow-50 font-mono text-gray-600">{results.otAmount}</td>

                                        <td className="p-2 border-r text-right bg-red-50 font-mono text-red-600">{results.epf8}</td>
                                        <td className="p-2 border-r text-right bg-blue-50 font-bold font-mono text-blue-700">{results.netSalary}</td>
                                        <td className="p-2 border-r text-right bg-gray-50 font-mono text-gray-500">{results.epf12}</td>
                                        <td className="p-2 border-r text-right bg-gray-50 font-mono text-gray-500">{results.etf3}</td>

                                        <td className="p-2 flex gap-2 justify-center">
                                            <button
                                                onClick={() => generatePayslip({ ...emp, ...results }, monthYear)}
                                                className="text-blue-600 hover:text-blue-800 p-1"
                                                title="Download PDF"
                                            >
                                                <Download size={18} />
                                            </button>
                                            <button
                                                onClick={() => removeEmployee(emp.id)}
                                                className="text-red-600 hover:text-red-800 p-1"
                                                title="Delete"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
                <div className="p-4 bg-gray-50 text-xs text-gray-500">
                    <p>@copyright</p>
                </div>
            </div>
        </div>
    );
};

export default SalaryCalculator;
