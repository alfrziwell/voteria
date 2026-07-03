import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { authService } from '../../api/services/authService';
import { FaUser, FaSignOutAlt, FaInfoCircle, FaBookOpen, FaHome } from 'react-icons/fa';
import logo from '../../assets/logo.png';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const voter = authService.getCurrentVoter();
  const isAuthenticated = authService.isAuthenticated();

  const handleLogout = async () => {
    try {
      await authService.logout();
      navigate('/');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-[#080627]/95 backdrop-blur-md text-white py-4 px-6 sticky top-0 z-50 border-b border-white/5 shadow-lg shadow-[#080627]/5">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
        
        {/* Logo */}
        <Link to="/" className="text-xl font-extrabold tracking-wider font-poppins flex items-center gap-2.5 hover:opacity-90 transition-opacity">
          <img src={logo} alt="Voteria Logo" className="w-9 h-9 object-contain" />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-purple-200">VOTERIA</span>
        </Link>
        
        {/* Links */}
        <div className="flex flex-wrap items-center justify-center gap-8 text-xs font-semibold uppercase tracking-wider">
          <Link 
            to="/" 
            className={`transition-colors flex items-center gap-2 py-1.5 px-1 border-b-2 ${
              isActive('/') ? 'border-indigo-500 text-white font-black' : 'border-transparent text-white/70 hover:text-white'
            }`}
          >
            <FaHome className="text-xs" /> Beranda
          </Link>
          <Link 
            to="/about" 
            className={`transition-colors flex items-center gap-2 py-1.5 px-1 border-b-2 ${
              isActive('/about') ? 'border-indigo-500 text-white font-black' : 'border-transparent text-white/70 hover:text-white'
            }`}
          >
            <FaInfoCircle className="text-xs" /> Tentang
          </Link>
          <Link 
            to="/guide" 
            className={`transition-colors flex items-center gap-2 py-1.5 px-1 border-b-2 ${
              isActive('/guide') ? 'border-indigo-500 text-white font-black' : 'border-transparent text-white/70 hover:text-white'
            }`}
          >
            <FaBookOpen className="text-xs" /> Panduan
          </Link>

          {isAuthenticated ? (
            <>
              <Link 
                to="/user/dashboard" 
                className={`transition-colors py-1.5 px-1 border-b-2 ${
                  isActive('/user/dashboard') ? 'border-indigo-500 text-white font-black' : 'border-transparent text-indigo-400 hover:text-indigo-300'
                }`}
              >
                Dashboard
              </Link>
              
              <div className="flex items-center gap-5 border-t sm:border-t-0 sm:border-l border-white/10 pt-3 sm:pt-0 sm:pl-6">
                <span className="bg-white/5 border border-white/10 rounded-full px-4 py-1.5 text-xs font-mono text-gray-300 flex items-center gap-1.5">
                  <FaUser className="text-xs" /> NIM: {voter?.nim}
                </span>
                <button
                  onClick={handleLogout}
                  className="bg-red-500/10 hover:bg-red-500/25 border border-red-500/20 text-red-300 hover:text-white font-bold text-xs py-2 px-4 rounded-xl tracking-wider uppercase flex items-center gap-1.5 transition-all cursor-pointer active:scale-95"
                >
                  <FaSignOutAlt className="text-xs" /> Keluar
                </button>
              </div>
            </>
          ) : (
            <Link
              to="/login"
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs py-2.5 px-6 rounded-xl tracking-wider uppercase transition-all duration-200 cursor-pointer shadow-md shadow-indigo-600/10 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 active:scale-95"
            >
              Mulai Memilih
            </Link>
          )}
        </div>

      </div>
    </nav>
  );
}
