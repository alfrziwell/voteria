import React, { useState, useEffect } from 'react';
import { adminService } from '../../api/services/adminService';
import AdminNavbar from '../../components/admin/AdminNavbar';
import AddVoterForm from '../../components/admin/AddVoterForm';
import { FaUsers, FaVoteYea, FaPercentage, FaLink, FaSync, FaSlidersH, FaPause, FaPlay } from 'react-icons/fa';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toggleLoading, setToggleLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const fetchStats = async () => {
    try {
      setLoading(true);
      const data = await adminService.getDashboardStats();
      setStats(data);
    } catch (err) {
      console.error('Failed to fetch admin stats:', err);
      setError('Gagal memuat statistik dashboard.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleToggleElection = async () => {
    if (!stats || toggleLoading) return;
    
    setToggleLoading(true);
    setError('');
    setSuccessMsg('');

    const electionSettings = stats?.election_settings?.data || stats?.election_settings;
    const currentStatus = electionSettings?.is_active ?? false;
    const nextStatus = !currentStatus;

    try {
      const updatedSettings = await adminService.toggleElectionStatus(nextStatus);
      
      setStats(prev => {
        const prevSettings = prev?.election_settings?.data || prev?.election_settings || {};
        const updatedIsActive = (updatedSettings?.is_active !== undefined) 
          ? updatedSettings.is_active 
          : (updatedSettings?.data?.is_active !== undefined ? updatedSettings.data.is_active : nextStatus);
        
        return {
          ...prev,
          election_settings: prev?.election_settings?.data
            ? { data: { ...prevSettings, is_active: updatedIsActive } }
            : { ...prevSettings, is_active: updatedIsActive }
        };
      });

      setSuccessMsg(`Status pemilihan berhasil diubah menjadi: ${nextStatus ? 'TERBUKA' : 'DITUTUP'}`);
      await fetchStats();
    } catch (err) {
      console.error('Failed to toggle status:', err);
      setError('Gagal mengubah status pemilihan.');
    } finally {
      setToggleLoading(false);
    }
  };

  const electionSettings = stats?.election_settings?.data || stats?.election_settings;
  const isActive = electionSettings?.is_active ?? false;

  const adminData = localStorage.getItem('admin_data');
  const loggedInAdmin = adminData ? JSON.parse(adminData) : null;
  const isAdminRole = loggedInAdmin?.role === 'admin';

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans text-slate-800">
      <AdminNavbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-12">
        {/* Title */}
        <div className="border-b border-slate-200 pb-6 mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-black font-poppins text-[#080627] uppercase tracking-wide">
              Panel Administrator Voteria
            </h1>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mt-1.5 flex items-center gap-1.5 font-sans">
              <FaSlidersH className="text-indigo-600" /> Monitoring Real-time & Konfigurasi Smart Contract
            </p>
          </div>
          <button
            onClick={fetchStats}
            title="Refresh Data"
            className="bg-white hover:bg-slate-50 border border-slate-200 p-3 rounded-xl text-slate-600 cursor-pointer flex items-center justify-center transition-all duration-150 active:scale-95 shadow-sm"
          >
            <FaSync className={`text-xs ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {error && (
          <div className="bg-rose-50 text-rose-600 p-4 mb-6 border-l-4 border-rose-500 rounded-r-xl text-xs font-semibold">
            {error}
          </div>
        )}

        {successMsg && (
          <div className="bg-green-50 text-green-700 p-4 mb-6 border-l-4 border-green-500 rounded-r-xl text-xs font-semibold">
            {successMsg}
          </div>
        )}

        {loading && !stats ? (
          /* Pulse loading */
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white border border-slate-100 rounded-3xl p-6 h-28 animate-pulse"></div>
            ))}
          </div>
        ) : (
          stats && (
            <div className="space-y-8">
              {/* Stats Cards Section */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Total Registered Voters */}
                <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm flex items-center justify-between hover:shadow-md transition-all duration-300">
                  <div className="space-y-1">
                    <span className="text-xs font-extrabold text-slate-400 uppercase tracking-widest block">Pemilih Terdaftar</span>
                    <h3 className="text-3xl font-black font-poppins text-[#080627]">{stats.total_registered_voters}</h3>
                    <p className="text-xs text-slate-400 font-medium font-sans">Total data dalam database</p>
                  </div>
                  <div className="bg-indigo-50 text-indigo-600 rounded-2xl p-4 text-xl">
                    <FaUsers />
                  </div>
                </div>

                {/* Voted Count */}
                <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm flex items-center justify-between hover:shadow-md transition-all duration-300">
                  <div className="space-y-1">
                    <span className="text-xs font-extrabold text-slate-400 uppercase tracking-widest block">Suara Masuk</span>
                    <h3 className="text-3xl font-black font-poppins text-[#080627]">{stats.voted_count}</h3>
                    <p className="text-xs text-slate-400 font-medium font-sans">Sudah terekam di blockchain</p>
                  </div>
                  <div className="bg-purple-50 text-purple-600 rounded-2xl p-4 text-xl">
                    <FaVoteYea />
                  </div>
                </div>

                {/* Participation Percentage */}
                <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm flex items-center justify-between hover:shadow-md transition-all duration-300">
                  <div className="space-y-1">
                    <span className="text-xs font-extrabold text-slate-400 uppercase tracking-widest block">Tingkat Partisipasi</span>
                    <h3 className="text-3xl font-black font-poppins text-[#080627]">{stats.participation_percentage}%</h3>
                    <p className="text-xs text-slate-400 font-medium font-sans">Persentase kehadiran digital</p>
                  </div>
                  <div className="bg-rose-50 text-rose-600 rounded-2xl p-4 text-xl">
                    <FaPercentage />
                  </div>
                </div>

              </div>

              {/* Control Panel Section */}
              <div className="bg-white border border-slate-100 p-8 rounded-3xl shadow-sm">
                <h3 className="text-base font-bold text-[#080627] uppercase tracking-wide mb-6 border-b border-slate-100 pb-3 flex items-center gap-2 font-poppins">
                  <FaSlidersH className="text-indigo-600 text-sm" /> Konfigurasi Masa Pemilihan
                </h3>
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                  <div className="max-w-xl">
                    <p className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2 mb-2">
                      Status Pemilu Saat Ini:{' '}
                      {isActive ? (
                        <span className="bg-emerald-50 border border-emerald-100 text-emerald-600 px-2.5 py-0.5 rounded-full font-extrabold text-xs">Terbuka / Aktif</span>
                      ) : (
                        <span className="bg-rose-50 border border-rose-100 text-rose-600 px-2.5 py-0.5 rounded-full font-extrabold text-xs">Ditutup / Tidak Aktif</span>
                      )}
                    </p>
                    <p className="text-xs text-slate-400 leading-relaxed font-medium">
                      Mengubah status ini akan berdampak langsung secara real-time pada interface pemilih di frontend. Jika ditutup, seluruh tombol "Pilih Kandidat" pada halaman pemilih akan dinonaktifkan otomatis.
                    </p>
                  </div>
                  
                  <button
                    onClick={handleToggleElection}
                    disabled={toggleLoading}
                    className={`px-8 py-3.5 rounded-xl font-bold text-white uppercase tracking-widest text-xs transition-all duration-200 cursor-pointer flex items-center gap-2 shadow-md hover:shadow-lg active:scale-95 hover:-translate-y-0.5 active:translate-y-0 ${
                      isActive 
                        ? 'bg-rose-600 hover:bg-rose-500 shadow-rose-600/10' 
                        : 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/10'
                    } ${toggleLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {toggleLoading ? (
                      'Memproses...'
                    ) : isActive ? (
                      <>
                        <FaPause className="text-xs" /> Hentikan Pemilihan
                      </>
                    ) : (
                      <>
                        <FaPlay className="text-xs" /> Jalankan Pemilihan
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Add Voter Form */}
              {isAdminRole && <AddVoterForm onVoterAdded={fetchStats} />}

              {/* Extra Details */}
              <div className="bg-slate-900 border border-slate-800 text-white p-8 rounded-3xl shadow-xl shadow-slate-900/5 font-mono text-xs">
                <span className="font-extrabold text-slate-400 uppercase tracking-widest block mb-5 flex items-center gap-2 border-b border-slate-850 pb-3">
                  <FaLink className="text-indigo-400" /> Ledger Blockchain Configuration
                </span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <span className="block text-slate-400 font-bold uppercase tracking-wider mb-2">Alamat Smart Contract (ZKP Verifier):</span>
                    <span className="text-indigo-350 font-semibold break-all block bg-slate-950 p-3.5 border border-slate-800 rounded-xl">{electionSettings?.smart_contract_address || 'Tidak Terhubung'}</span>
                  </div>
                  <div>
                    <span className="block text-slate-400 font-bold uppercase tracking-wider mb-2">Nama Pemilihan (Event Title):</span>
                    <span className="text-indigo-350 font-semibold block bg-slate-950 p-3.5 border border-slate-800 rounded-xl">{electionSettings?.election_name || '-'}</span>
                  </div>
                </div>
              </div>
            </div>
          )
        )}
      </main>
    </div>
  );
}
