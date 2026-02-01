import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, Calculator, LogOut } from 'lucide-react';

const Navbar = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('isAuthenticated');
        navigate('/');
    };

    const navItems = [
        { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
        { name: 'Payroll', path: '/payroll', icon: Calculator },
        { name: 'Employees', path: '/employees', icon: Users },
    ];

    return (
        <nav className="bg-gray-900 text-white w-64 min-h-screen flex flex-col p-4">
            <div className="mb-8 p-2">
                <h1 className="text-xl font-bold">Karunaratna Stores</h1>
                <p className="text-xs text-gray-400">Payroll System</p>
            </div>

            <div className="flex-1 space-y-2">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                            }`
                        }
                    >
                        <item.icon size={20} />
                        <span>{item.name}</span>
                    </NavLink>
                ))}
            </div>

            <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-gray-800 hover:text-red-300 rounded-lg transition-colors mt-auto"
            >
                <LogOut size={20} />
                <span>Logout</span>
            </button>
        </nav>
    );
};

export default Navbar;
