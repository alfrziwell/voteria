import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { authService } from '../../api/services/authService';
import { FaUser, FaSignOutAlt, FaInfoCircle, FaBookOpen, FaHome, FaBars, FaTimes, FaTachometerAlt } from 'react-icons/fa';
import logo from '../../assets/logo.png';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const voter = authService.getCurrentVoter();
  const isAuthenticated = authService.isAuthenticated();
  const [isOpen, setIsOpen] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch (err) {
      console.error('Logout failed:', err);
    } finally {
      setIsOpen(false);
      setShowConfirm(false);
      navigate('/');
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <nav className="bg-[#080627]/90 backdrop-blur-md text-white py-3.5 px-6 sticky top-0 z-50 border-b border-white/5 shadow-lg shadow-[#080627]/10 transition-all duration-300">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          
          {/* Logo */}
          <Link to="/" className="text-xl font-extrabold tracking-wider font-poppins flex items-center gap-2.5 hover:opacity-90 transition-opacity">
            <img src={logo} alt="Voteria Logo" className="w-9 h-9 object-contain" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-purple-200">VOTERIA</span>
          </Link>
          
          {/* Desktop Links (hidden on mobile, visible on md and up) */}
          <div className="hidden lg:flex items-center gap-8 text-xs font-semibold uppercase tracking-wider">
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
                  className={`transition-colors flex items-center gap-2 py-1.5 px-1 border-b-2 ${
                    isActive('/user/dashboard') ? 'border-indigo-500 text-white font-black' : 'border-transparent text-indigo-400 hover:text-indigo-300'
                  }`}
                >
                  <FaTachometerAlt className="text-xs" /> Dashboard
                </Link>
                
                <div className="flex items-center gap-5 border-l border-white/10 pl-6">
                  <span className="bg-white/5 border border-white/10 rounded-full px-4 py-1.5 text-xs font-mono text-gray-300 flex items-center gap-1.5">
                    <FaUser className="text-xs" /> NIM: {voter?.nim}
                  </span>
                  <button
                    onClick={() => setShowConfirm(true)}
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

          {/* Mobile Menu Button (visible on mobile, hidden on md and up) */}
          <div className="lg:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white hover:text-indigo-400 focus:outline-none transition-colors p-2 cursor-pointer"
              aria-label="Toggle menu"
            >
              {isOpen ? <FaTimes className="text-xl" /> : <FaBars className="text-xl" />}
            </button>
          </div>

        </div>

        {/* Mobile Links Drawer (visible on mobile when open, hidden on md and up) */}
        <div 
          className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            isOpen ? 'max-h-[450px] opacity-100 mt-4' : 'max-h-0 opacity-0 pointer-events-none'
          }`}
        >
          <div className="flex flex-col gap-4 py-4 px-2 border-t border-white/5 text-sm font-semibold uppercase tracking-wider">
            <Link 
              to="/" 
              onClick={() => setIsOpen(false)}
              className={`transition-colors flex items-center gap-3 py-2 px-3 rounded-lg ${
                isActive('/') ? 'bg-indigo-600/20 text-white border-l-4 border-indigo-500' : 'text-white/70 hover:text-white hover:bg-white/5'
              }`}
            >
              <FaHome className="text-sm" /> Beranda
            </Link>
            <Link 
              to="/about" 
              onClick={() => setIsOpen(false)}
              className={`transition-colors flex items-center gap-3 py-2 px-3 rounded-lg ${
                isActive('/about') ? 'bg-indigo-600/20 text-white border-l-4 border-indigo-500' : 'text-white/70 hover:text-white hover:bg-white/5'
              }`}
            >
              <FaInfoCircle className="text-sm" /> Tentang
            </Link>
            <Link 
              to="/guide" 
              onClick={() => setIsOpen(false)}
              className={`transition-colors flex items-center gap-3 py-2 px-3 rounded-lg ${
                isActive('/guide') ? 'bg-indigo-600/20 text-white border-l-4 border-indigo-500' : 'text-white/70 hover:text-white hover:bg-white/5'
              }`}
            >
              <FaBookOpen className="text-sm" /> Panduan
            </Link>

            {isAuthenticated ? (
              <>
                <Link 
                  to="/user/dashboard" 
                  onClick={() => setIsOpen(false)}
                  className={`transition-colors flex items-center gap-3 py-2 px-3 rounded-lg ${
                    isActive('/user/dashboard') ? 'bg-indigo-600/20 text-white border-l-4 border-indigo-500' : 'text-indigo-400 hover:text-indigo-300 hover:bg-white/5'
                  }`}
                >
                  <FaTachometerAlt className="text-sm" /> Dashboard
                </Link>
                
                <div className="flex flex-col gap-4 border-t border-white/5 pt-4 mt-2">
                  <span className="bg-white/5 border border-white/10 rounded-full px-4 py-2 text-xs font-mono text-gray-300 flex items-center justify-center gap-2">
                    <FaUser className="text-xs" /> NIM: {voter?.nim}
                  </span>
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      setShowConfirm(true);
                    }}
                    className="w-full bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-300 hover:text-white font-bold text-xs py-3 px-4 rounded-xl tracking-wider uppercase flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95"
                  >
                    <FaSignOutAlt className="text-xs" /> Keluar
                  </button>
                </div>
              </>
            ) : (
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs py-3 px-6 rounded-xl tracking-wider uppercase transition-all duration-200 cursor-pointer shadow-md shadow-indigo-600/10 hover:shadow-lg text-center mt-2"
              >
                Mulai Memilih
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Logout Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-[#02020d]/80 backdrop-blur-sm flex items-center justify-center z-[100] p-6">
          <div className="bg-white border border-slate-100 rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl">
            <div className="w-12 h-12 bg-red-50 text-red-500 rounded-full flex items-center justify-center text-lg font-bold mx-auto mb-5 shadow-sm border border-red-100/50">
              <FaSignOutAlt className="text-sm" />
            </div>
            <h3 className="text-base font-extrabold text-[#080627] font-poppins uppercase tracking-wider mb-2">Konfirmasi Keluar</h3>
            <p className="text-slate-500 text-xs leading-relaxed mb-6 font-medium">Apakah Anda yakin ingin keluar dari panel pemilihan suara Voteria?</p>
            <div className="flex gap-4">
              <button 
                onClick={() => setShowConfirm(false)}
                className="flex-1 py-3 bg-slate-50 border border-slate-200 text-slate-500 hover:bg-slate-100 hover:text-slate-700 font-bold text-xs tracking-wider uppercase rounded-xl transition-all active:scale-95 cursor-pointer"
              >
                Batal
              </button>
              <button 
                onClick={handleLogout}
                className="flex-1 py-3 bg-red-600 hover:bg-red-500 text-white font-bold text-xs tracking-wider uppercase rounded-xl transition-all shadow-md shadow-red-600/15 hover:shadow-lg active:scale-95 cursor-pointer"
              >
                Keluar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
