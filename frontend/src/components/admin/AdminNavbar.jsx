import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { adminService } from '../../api/services/adminService';
import logo from '../../assets/logo.png';
import { FaSignOutAlt } from 'react-icons/fa';

export default function AdminNavbar() {
  const navigate = useNavigate();
  const adminData = localStorage.getItem('admin_data');
  const loggedInAdmin = adminData ? JSON.parse(adminData) : null;

  const handleLogout = async () => {
    try {
      await adminService.adminLogout();
      navigate('/login');
    } catch (err) {
      console.error('Admin logout failed:', err);
    }
  };

  return (
    <nav className="bg-[#080627]/95 backdrop-blur-md text-white py-4 px-6 sticky top-0 z-50 border-b border-white/5 shadow-lg shadow-[#080627]/5">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Link to="/admin/dashboard" className="text-xl font-extrabold font-poppins tracking-wider flex items-center gap-2.5 hover:opacity-90 transition-opacity">
            <img src={logo} alt="Voteria Logo" className="w-9 h-9 object-contain" />
            <div className="flex items-center gap-2">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-purple-200">VOTERIA</span>
              <span className="text-[10px] px-2.5 py-0.5 bg-red-500/10 border border-red-500/20 text-red-400 rounded-full font-mono font-bold tracking-wider uppercase">
                ADMIN: {loggedInAdmin?.role || 'PANITIA'}
              </span>
            </div>
          </Link>
        </div>
        <button
          onClick={handleLogout}
          className="bg-red-500/10 hover:bg-red-500/25 border border-red-500/20 text-red-300 hover:text-white font-bold text-xs py-2 px-4 rounded-xl tracking-wider uppercase flex items-center gap-1.5 transition-all duration-200 cursor-pointer active:scale-95 hover:-translate-y-0.5 active:translate-y-0"
        >
          <FaSignOutAlt className="text-xs" /> Keluar Panel
        </button>
      </div>
    </nav>
  );
}
