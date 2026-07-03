import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../api/services/authService';
import { adminService } from '../../api/services/adminService';
import Navbar from '../../components/user/Navbar';
import Footer from '../../components/user/Footer';
import { FaUser, FaLock, FaSignInAlt, FaUserShield, FaEye, FaEyeSlash } from 'react-icons/fa';

export default function LoginPage() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [identifier, setIdentifier] = useState(''); // nim or username
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isAdmin) {
        const response = await adminService.adminLogin(identifier, password);
        if (response.token) {
          navigate('/admin/dashboard');
        } else {
          setError('Login admin gagal.');
        }
      } else {
        const response = await authService.login(identifier, password);
        if (response.token) {
          navigate('/user/dashboard');
        } else {
          setError('Login pemilih gagal.');
        }
      }
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message || 
        err.response?.data?.errors?.nim?.[0] || 
        err.response?.data?.errors?.username?.[0] || 
        'Kredensial yang Anda masukkan salah.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans text-slate-800">
      <Navbar />

      <main className="flex-1 flex items-center justify-center py-20 px-4">
        <div className="w-full max-w-md bg-white border border-slate-100 p-10 rounded-3xl shadow-xl shadow-slate-900/5">
          
          {/* Modern Pill Tab Selection */}
          <div className="flex bg-[#F1F5F9] p-1 rounded-2xl border border-slate-100 mb-8">
            <button
              onClick={() => {
                setIsAdmin(false);
                setIdentifier('');
                setPassword('');
                setError('');
              }}
              className={`flex-1 py-3 text-center rounded-xl font-bold tracking-wider uppercase text-xs flex items-center justify-center gap-2 cursor-pointer transition-all duration-200 ${
                !isAdmin
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/10'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <FaUser className="text-xs" /> Pemilih
            </button>
            <button
              onClick={() => {
                setIsAdmin(true);
                setIdentifier('');
                setPassword('');
                setError('');
              }}
              className={`flex-1 py-3 text-center rounded-xl font-bold tracking-wider uppercase text-xs flex items-center justify-center gap-2 cursor-pointer transition-all duration-200 ${
                isAdmin
                  ? 'bg-slate-900 text-white shadow-md shadow-slate-900/10'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <FaUserShield className="text-xs" /> Administrator
            </button>
          </div>

          <div className="text-center mb-8 space-y-2">
            <h2 className="text-2xl font-black font-poppins text-[#080627] tracking-tight uppercase flex items-center justify-center gap-2.5">
              <FaSignInAlt className={isAdmin ? 'text-slate-800' : 'text-indigo-600'} />
              {isAdmin ? 'Masuk Admin' : 'Masuk Pemilih'}
            </h2>
            <p className="text-xs text-slate-400 uppercase font-extrabold tracking-wider">
              {isAdmin ? 'Akses Panel Kontrol Pemilihan BEM' : 'Gunakan NIM Anda untuk memilih'}
            </p>
          </div>

          {error && (
            <div className="bg-rose-50 text-rose-600 p-4 mb-6 border-l-4 border-rose-500 rounded-r-xl text-xs font-semibold">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="identifier" className="block text-xs font-extrabold text-slate-500 uppercase tracking-widest mb-2">
                {isAdmin ? 'Username Admin' : 'Nomor Induk Mahasiswa (NIM)'}
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
                  <FaUser className="text-xs" />
                </span>
                <input
                  id="identifier"
                  type="text"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder={isAdmin ? 'Masukkan username admin' : 'Contoh: 105240003'}
                  className="w-full pl-10 pr-4 py-3.5 bg-[#F8FAFC] border border-slate-200 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 rounded-xl text-slate-800 text-xs font-semibold transition-all"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-extrabold text-slate-500 uppercase tracking-widest mb-2">
                Kata Sandi (Password)
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
                  <FaLock className="text-xs" />
                </span>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-12 py-3.5 bg-[#F8FAFC] border border-slate-200 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 rounded-xl text-slate-800 text-xs font-semibold transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showPassword ? <FaEyeSlash className="text-xs" /> : <FaEye className="text-xs" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-4 rounded-xl font-bold text-white uppercase tracking-widest text-xs transition-all duration-200 cursor-pointer shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 active:scale-95 ${
                isAdmin 
                  ? 'bg-slate-900 hover:bg-slate-800 shadow-slate-900/10 hover:shadow-slate-900/20' 
                  : 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-600/10 hover:shadow-indigo-600/20'
              } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {loading ? 'Memproses Verifikasi...' : 'Masuk Ke Akun'}
            </button>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}
