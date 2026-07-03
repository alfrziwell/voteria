import React, { useState } from 'react';
import { adminService } from '../../api/services/adminService';
import { FaUserPlus, FaUser, FaEnvelope, FaIdCard, FaGraduationCap } from 'react-icons/fa';

export default function AddVoterForm({ onVoterAdded }) {
  const [nim, setNim] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [faculty, setFaculty] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const response = await adminService.addVoter({
        nim,
        name,
        email,
        faculty
      });

      setSuccessMsg(`Mahasiswa ${name} (${nim}) berhasil didaftarkan! Kredensial masuk telah dikirim ke email.`);
      
      // Clear form
      setNim('');
      setName('');
      setEmail('');
      setFaculty('');

      if (onVoterAdded) {
        onVoterAdded(response.data || response);
      }
    } catch (err) {
      console.error(err);
      setErrorMsg(
        err.response?.data?.message || 
        err.response?.data?.errors?.nim?.[0] || 
        err.response?.data?.errors?.email?.[0] || 
        'Gagal mendaftarkan mahasiswa. Coba periksa kembali data input.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border border-slate-100 p-8 rounded-3xl shadow-sm">
      <div className="flex items-center gap-3 border-b border-slate-100 pb-4 mb-6">
        <div className="bg-indigo-50 text-indigo-600 p-2.5 rounded-xl border border-indigo-100/50">
          <FaUserPlus className="text-lg" />
        </div>
        <div>
          <h3 className="text-base font-bold text-[#080627] uppercase tracking-wide font-poppins">
            Pendaftaran Pemilih Baru
          </h3>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">
            Sistem otomatis mengirim password rahasia ke email pemilih
          </p>
        </div>
      </div>

      {errorMsg && (
        <div className="bg-rose-50 text-rose-600 p-4 mb-6 border-l-4 border-rose-500 rounded-r-xl text-xs font-semibold">
          {errorMsg}
        </div>
      )}

      {successMsg && (
        <div className="bg-green-50 text-green-700 p-4 mb-6 border-l-4 border-green-500 rounded-r-xl text-xs font-semibold">
          {successMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* NIM */}
          <div>
            <label htmlFor="nim" className="block text-xs font-extrabold text-slate-500 uppercase tracking-widest mb-1.5">
              Nomor Induk Mahasiswa (NIM)
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                <FaIdCard className="text-xs" />
              </span>
              <input
                id="nim"
                type="text"
                required
                value={nim}
                onChange={(e) => setNim(e.target.value)}
                placeholder="Contoh: 105240003"
                className="w-full pl-9 pr-4 py-3 bg-[#F8FAFC] border border-slate-200 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 rounded-xl text-slate-800 text-xs font-semibold transition-all"
              />
            </div>
          </div>

          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-xs font-extrabold text-slate-500 uppercase tracking-widest mb-1.5">
              Nama Lengkap Mahasiswa
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                <FaUser className="text-xs" />
              </span>
              <input
                id="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Contoh: Alif Alfarizi"
                className="w-full pl-9 pr-4 py-3 bg-[#F8FAFC] border border-slate-200 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 rounded-xl text-slate-800 text-xs font-semibold transition-all"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-xs font-extrabold text-slate-500 uppercase tracking-widest mb-1.5">
              Surat Elektronik (Email)
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                <FaEnvelope className="text-xs" />
              </span>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Contoh: mahasiswa@student.univ.ac.id"
                className="w-full pl-9 pr-4 py-3 bg-[#F8FAFC] border border-slate-200 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 rounded-xl text-slate-800 text-xs font-semibold transition-all"
              />
            </div>
          </div>

          {/* Faculty */}
          <div>
            <label htmlFor="faculty" className="block text-xs font-extrabold text-slate-500 uppercase tracking-widest mb-1.5">
              Fakultas Mahasiswa
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                <FaGraduationCap className="text-xs" />
              </span>
              <select
                id="faculty"
                required
                value={faculty}
                onChange={(e) => setFaculty(e.target.value)}
                className="w-full pl-9 pr-8 py-3 bg-[#F8FAFC] border border-slate-200 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 rounded-xl text-slate-800 text-xs font-semibold transition-all"
              >
                <option value="">-- Pilih Fakultas --</option>
                <option value="Fakultas Ilmu Sosial dan Bisnis">Fakultas Ilmu Sosial dan Bisnis</option>
                <option value="Fakultas Sains dan Teknologi">Fakultas Sains dan Teknologi</option>
              </select>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl tracking-wider uppercase transition-all duration-200 cursor-pointer shadow-md shadow-indigo-600/10 hover:shadow-lg active:scale-95"
        >
          {loading ? 'Menyimpan dan Mengirim Email...' : 'Daftarkan Mahasiswa'}
        </button>
      </form>
    </div>
  );
}
