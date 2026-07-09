import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminService } from '../../api/services/adminService';
import { voterService } from '../../api/services/voterService';
import { candidateService } from '../../api/services/candidateService';
import logo from '../../assets/logo.png';
import { 
  FaUsers, 
  FaVoteYea, 
  FaPercentage, 
  FaLink, 
  FaSync, 
  FaSlidersH, 
  FaPause, 
  FaPlay, 
  FaSignOutAlt, 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaCheck, 
  FaTimes, 
  FaSearch, 
  FaTachometerAlt, 
  FaUserPlus, 
  FaGraduationCap, 
  FaEnvelope, 
  FaIdCard, 
  FaUser,
  FaArrowRight,
  FaCogs,
  FaDatabase,
  FaCube
} from 'react-icons/fa';

export default function AdminDashboard() {
  const navigate = useNavigate();

  // Helper: resolve photo URL - adds backend base URL for local /storage/ paths
  const BACKEND_URL = 'http://localhost:8000';
  const getPhotoUrl = (photoUrl) => {
    if (!photoUrl) return null;
    if (photoUrl.startsWith('/storage/')) return `${BACKEND_URL}${photoUrl}`;
    return photoUrl;
  };

  // Mobile sidebar state
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Navigation state
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showConfirm, setShowConfirm] = useState(false);

  // Stats state
  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [toggleLoading, setToggleLoading] = useState(false);
  const [statsError, setStatsError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Voters state
  const [voters, setVoters] = useState([]);
  const [votersLoading, setVotersLoading] = useState(false);
  const [votersError, setVotersError] = useState('');
  const [votersSearch, setVotersSearch] = useState('');
  const [votersCurrentPage, setVotersCurrentPage] = useState(1);
  const votersPerPage = 5;
  const [showVoterForm, setShowVoterForm] = useState(false);
  const [voterForm, setVoterForm] = useState({
    nim: '',
    name: '',
    email: '',
    faculty: ''
  });
  const [addVoterLoading, setAddVoterLoading] = useState(false);
  const [voterSuccessMsg, setVoterSuccessMsg] = useState('');
  const [voterErrorMsg, setVoterErrorMsg] = useState('');

  // Candidates state
  const [candidates, setCandidates] = useState([]);
  const [candidatesLoading, setCandidatesLoading] = useState(false);
  const [candidatesError, setCandidatesError] = useState('');
  const [showCandidateForm, setShowCandidateForm] = useState(false);
  const [editingCandidate, setEditingCandidate] = useState(null);
  const [candidateForm, setCandidateForm] = useState({
    candidate_number: '',
    chairman_name: '',
    vice_chairman_name: '',
    vision: '',
    mission: '',
    photo_url: ''
  });
  const [candidateFormLoading, setCandidateFormLoading] = useState(false);
  const [candidatePhotoFile, setCandidatePhotoFile] = useState(null);
  const [candidateSuccessMsg, setCandidateSuccessMsg] = useState('');
  const [candidateErrorMsg, setCandidateErrorMsg] = useState('');

  // Admin Data
  const adminData = localStorage.getItem('admin_data');
  const loggedInAdmin = adminData ? JSON.parse(adminData) : null;
  const adminRole = loggedInAdmin?.role;
  const isAdminRole = adminRole === 'admin';
  const isKpumRole = adminRole === 'kpum';
  const isValidatorRole = ['rektor', 'dekan_1', 'dekan_2', 'kpum'].includes(adminRole);

  const roleToNodeKey = {
    rektor: 'voteria_node_rektor_active',
    dekan_1: 'voteria_node_dekan_1_active',
    dekan_2: 'voteria_node_dekan_2_active',
    kpum: 'voteria_node_kpum_active'
  };

  const nodeNameMap = {
    rektor: 'Node Rektor Universitas',
    dekan_1: 'Node Dekan Fakultas 1',
    dekan_2: 'Node Dekan Fakultas 2',
    kpum: 'Node Ketua KPUM'
  };

  const nodeKey = roleToNodeKey[adminRole];
  const [nodeActive, setNodeActive] = useState(() => {
    if (!nodeKey) return false;
    const val = localStorage.getItem(nodeKey);
    return val !== 'false';
  });

  const [nodeLogs, setNodeLogs] = useState([]);
  const [allNodesState, setAllNodesState] = useState({
    rektor: localStorage.getItem('voteria_node_rektor_active') !== 'false',
    dekan_1: localStorage.getItem('voteria_node_dekan_1_active') !== 'false',
    dekan_2: localStorage.getItem('voteria_node_dekan_2_active') !== 'false',
    kpum: localStorage.getItem('voteria_node_kpum_active') !== 'false'
  });

  const handleToggleNode = () => {
    const nextState = !nodeActive;
    setNodeActive(nextState);
    if (nodeKey) {
      localStorage.setItem(nodeKey, String(nextState));
    }
  };


  // Fetch Dashboard statistics
  const fetchStats = async () => {
    try {
      setStatsLoading(true);
      const data = await adminService.getDashboardStats();
      setStats(data);
    } catch (err) {
      console.error('Failed to fetch admin stats:', err);
      setStatsError('Gagal memuat statistik dashboard.');
    } finally {
      setStatsLoading(false);
    }
  };

  // Fetch Voters list
  const fetchVoters = async () => {
    try {
      setVotersLoading(true);
      setVotersError('');
      const data = await voterService.getVoters();
      setVoters(data || []);
    } catch (err) {
      console.error('Failed to fetch voters:', err);
      setVotersError('Gagal memuat daftar pemilih.');
    } finally {
      setVotersLoading(false);
    }
  };

  // Fetch Candidates list
  const fetchCandidates = async () => {
    try {
      setCandidatesLoading(true);
      setCandidatesError('');
      const data = await candidateService.getCandidates();
      setCandidates(data || []);
    } catch (err) {
      console.error('Failed to fetch candidates:', err);
      setCandidatesError('Gagal memuat daftar kandidat.');
    } finally {
      setCandidatesLoading(false);
    }
  };

  // Handle Logout
  const handleLogout = async () => {
    try {
      await adminService.adminLogout();
    } catch (err) {
      console.error('Admin logout failed:', err);
    } finally {
      setShowConfirm(false);
      navigate('/login');
    }
  };

  // Handle Toggle Election Status
  const handleToggleElection = async () => {
    if (!stats || toggleLoading) return;
    
    setToggleLoading(true);
    setStatsError('');
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

      setSuccessMsg(`Status pemilihan berhasil diubah menjadi: ${nextStatus ? 'TERBUKA / AKTIF' : 'DITUTUP / TIDAK AKTIF'}`);
      await fetchStats();
      await fetchCandidates();
    } catch (err) {
      console.error('Failed to toggle status:', err);
      setStatsError('Gagal mengubah status pemilihan.');
    } finally {
      setToggleLoading(false);
    }
  };

  // Handle Add Voter Submit
  const handleAddVoter = async (e) => {
    e.preventDefault();
    setAddVoterLoading(true);
    setVoterErrorMsg('');
    setVoterSuccessMsg('');

    try {
      await voterService.addVoter(voterForm);
      setVoterSuccessMsg(`Mahasiswa ${voterForm.name} (${voterForm.nim}) berhasil didaftarkan! Kredensial telah terkirim.`);
      setVoterForm({ nim: '', name: '', email: '', faculty: '' });
      setShowVoterForm(false);
      await fetchVoters();
      await fetchStats();
    } catch (err) {
      console.error('Add voter error:', err);
      setVoterErrorMsg(
        err.response?.data?.message || 
        err.response?.data?.errors?.nim?.[0] || 
        err.response?.data?.errors?.email?.[0] || 
        'Gagal mendaftarkan mahasiswa. Coba periksa kembali data input.'
      );
    } finally {
      setAddVoterLoading(false);
    }
  };

  // Handle Candidate Form Submit (Add/Edit)
  const handleCandidateSubmit = async (e) => {
    e.preventDefault();
    setCandidateFormLoading(true);
    setCandidateErrorMsg('');
    setCandidateSuccessMsg('');

    try {
      const formData = new FormData();
      formData.append('candidate_number', candidateForm.candidate_number);
      formData.append('chairman_name', candidateForm.chairman_name);
      formData.append('vice_chairman_name', candidateForm.vice_chairman_name);
      formData.append('vision', candidateForm.vision);
      formData.append('mission', candidateForm.mission);
      if (candidatePhotoFile) {
        formData.append('photo', candidatePhotoFile);
      } else if (candidateForm.photo_url) {
        formData.append('photo_url', candidateForm.photo_url);
      }

      if (editingCandidate) {
        await candidateService.updateCandidate(editingCandidate.id, formData);
        setCandidateSuccessMsg('Data kandidat berhasil diperbarui!');
      } else {
        await candidateService.addCandidate(formData);
        setCandidateSuccessMsg('Kandidat baru berhasil ditambahkan!');
      }

      setCandidateForm({
        candidate_number: '',
        chairman_name: '',
        vice_chairman_name: '',
        vision: '',
        mission: '',
        photo_url: ''
      });
      setCandidatePhotoFile(null);
      setEditingCandidate(null);
      setShowCandidateForm(false);
      
      await fetchCandidates();
      await fetchStats();
    } catch (err) {
      console.error('Candidate save error:', err);
      setCandidateErrorMsg(
        err.response?.data?.errors?.photo?.[0] ||
        err.response?.data?.errors?.candidate_number?.[0] ||
        err.response?.data?.message || 
        'Gagal menyimpan data kandidat.'
      );
    } finally {
      setCandidateFormLoading(false);
    }
  };

  // Handle Edit Candidate Button click
  const startEditCandidate = (cand) => {
    setEditingCandidate(cand);
    setCandidateForm({
      candidate_number: cand.candidate_number,
      chairman_name: cand.chairman_name,
      vice_chairman_name: cand.vice_chairman_name,
      vision: cand.vision,
      mission: cand.mission,
      photo_url: cand.photo_url
    });
    setCandidatePhotoFile(null);
    setCandidateErrorMsg('');
    setCandidateSuccessMsg('');
    setShowCandidateForm(true);
  };

  // Handle Cancel Edit
  const cancelCandidateForm = () => {
    setEditingCandidate(null);
    setCandidateForm({
      candidate_number: '',
      chairman_name: '',
      vice_chairman_name: '',
      vision: '',
      mission: '',
      photo_url: ''
    });
    setCandidatePhotoFile(null);
    setShowCandidateForm(false);
  };

  // Handle Delete Candidate
  const handleDeleteCandidate = async (id) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus kandidat ini secara permanen?')) return;

    try {
      await candidateService.deleteCandidate(id);
      await fetchCandidates();
      await fetchStats();
    } catch (err) {
      console.error('Delete candidate error:', err);
      alert('Gagal menghapus kandidat.');
    }
  };

  // Initial load
  useEffect(() => {
    fetchStats();
    fetchVoters();
    fetchCandidates();
  }, []);

  // Simulating node log generation for validator roles
  useEffect(() => {
    if (!isValidatorRole) return;
    
    if (!nodeActive) {
      setNodeLogs([
        `[${new Date().toLocaleTimeString()}] Node ${nodeNameMap[adminRole] || 'Validator'} is OFFLINE.`,
        `[${new Date().toLocaleTimeString()}] Klik 'Nyalakan Server Node' untuk mengaktifkan validasi konsensus PBFT.`
      ]);
      return;
    }

    const initialLogs = [
      `[${new Date().toLocaleTimeString()}] Menginisialisasi Validator Node...`,
      `[${new Date().toLocaleTimeString()}] Private key diturunkan dari akun role: ${adminRole}`,
      `[${new Date().toLocaleTimeString()}] Menghubungkan ke Jaringan PBFT Permissioned (ChainID: 9988)...`,
      `[${new Date().toLocaleTimeString()}] Handshake berhasil. Terhubung dengan peer lainnya.`,
      `[${new Date().toLocaleTimeString()}] Status Node: ONLINE / AKTIF (Sinkron pada block height #142)`,
      `[${new Date().toLocaleTimeString()}] Mendengarkan transaksi masuk...`
    ];
    setNodeLogs(initialLogs);

    const simulationLogs = [
      "Mendengarkan transaksi dari pemilih...",
      "Transaksi masuk terdeteksi: castVote() dengan bukti ZK-SNARK.",
      "Memulai verifikasi ZK-SNARK Proof via kontrak Verifier.sol...",
      "✓ Bukti ZK-SNARK keanggotaan terverifikasi sukses (Proof Valid).",
      "Memeriksa status Nullifier Hash pada ledger untuk mencegah double-voting...",
      "PBFT Konsensus: Menyiarkan pesan PRE-PREPARE block proposal...",
      "PBFT Konsensus: Menerima 3 pesan PREPARE dari peer validator.",
      "PBFT Konsensus: Menerima 3 pesan COMMIT dari peer validator (Kuorum tercapai).",
      "Blok berhasil ditulis ke ledger! Menambahkan 1 suara ke kandidat...",
      "Menyinkronkan root database lokal dengan Merkle Root on-chain."
    ];

    const interval = setInterval(() => {
      const randomMsg = simulationLogs[Math.floor(Math.random() * simulationLogs.length)];
      setNodeLogs(prev => {
        const next = [...prev, `[${new Date().toLocaleTimeString()}] ${randomMsg}`];
        if (next.length > 30) next.shift(); // Keep only last 30 lines
        return next;
      });
    }, 4500);

    return () => clearInterval(interval);
  }, [nodeActive, adminRole, isValidatorRole]);

  // Refresh node states for admin monitor
  useEffect(() => {
    if (isAdminRole) {
      const interval = setInterval(() => {
        setAllNodesState({
          rektor: localStorage.getItem('voteria_node_rektor_active') !== 'false',
          dekan_1: localStorage.getItem('voteria_node_dekan_1_active') !== 'false',
          dekan_2: localStorage.getItem('voteria_node_dekan_2_active') !== 'false',
          kpum: localStorage.getItem('voteria_node_kpum_active') !== 'false'
        });
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [isAdminRole]);

  // Reset page when search term changes
  useEffect(() => {
    setVotersCurrentPage(1);
  }, [votersSearch]);

  // Filter voters list by search query
  const filteredVoters = voters.filter(voter => {
    const searchLower = votersSearch.toLowerCase();
    return (
      voter.name.toLowerCase().includes(searchLower) ||
      voter.nim.toLowerCase().includes(searchLower) ||
      voter.faculty.toLowerCase().includes(searchLower) ||
      voter.email.toLowerCase().includes(searchLower)
    );
  });

  // Pagination calculations
  const indexOfLastVoter = votersCurrentPage * votersPerPage;
  const indexOfFirstVoter = indexOfLastVoter - votersPerPage;
  const currentVoters = filteredVoters.slice(indexOfFirstVoter, indexOfLastVoter);
  const totalVoterPages = Math.ceil(filteredVoters.length / votersPerPage);

  const electionSettings = stats?.election_settings?.data || stats?.election_settings;
  const isActive = electionSettings?.is_active ?? false;

  // Calculate candidate statistics for dashboard
  const totalVotesCast = candidates.reduce((sum, cand) => sum + (cand.votes || 0), 0);

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans text-slate-800 overflow-hidden relative">
      
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Custom CSS Style Injection for Table scrollbars & transitions */}
      <style>{`
        .custom-scroll::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        .custom-scroll::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scroll::-webkit-scrollbar-thumb {
          background: rgba(0, 0, 0, 0.08);
          border-radius: 10px;
        }
        .custom-scroll::-webkit-scrollbar-thumb:hover {
          background: rgba(0, 0, 0, 0.15);
        }
        .animate-tab {
          animation: fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* Sidebar Navigation */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-40 lg:z-20
        w-72 lg:w-80 bg-[#080627] text-white flex flex-col justify-between p-5 lg:p-6 shrink-0 shadow-2xl
        transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="space-y-8">
          {/* Logo & Brand Header */}
          <div className="flex items-center gap-3.5 pb-6 border-b border-white/10">
            <img src={logo} alt="Voteria Logo" className="w-12 h-12 object-contain bg-white/5 p-1.5 rounded-2xl border border-white/10" />
            <div>
              <h1 className="text-xl font-black tracking-widest text-white font-poppins">
                VOTERIA
              </h1>
              <span className="inline-flex items-center gap-1.5 text-[9px] px-2.5 py-0.5 bg-red-500/10 border border-red-500/20 text-red-400 rounded-full font-mono font-bold tracking-wider uppercase mt-1">
                ADMIN PANEL
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-2">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center gap-4 px-4.5 py-4 rounded-2xl text-xs font-bold tracking-wider uppercase transition-all duration-200 cursor-pointer border ${
                activeTab === 'dashboard'
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-650/20 border-indigo-500'
                  : 'text-slate-400 hover:text-white hover:bg-white/5 border-transparent'
              }`}
            >
              <FaTachometerAlt className="text-sm" />
              <span>Overview</span>
            </button>

            {isAdminRole && (
              <>
                <button
                  onClick={() => setActiveTab('voters')}
                  className={`w-full flex items-center gap-4 px-4.5 py-4 rounded-2xl text-xs font-bold tracking-wider uppercase transition-all duration-200 cursor-pointer border ${
                    activeTab === 'voters'
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-650/20 border-indigo-500'
                      : 'text-slate-400 hover:text-white hover:bg-white/5 border-transparent'
                  }`}
                >
                  <FaUsers className="text-sm" />
                  <span>Daftar Pemilih</span>
                </button>

                <button
                  onClick={() => setActiveTab('candidates')}
                  className={`w-full flex items-center gap-4 px-4.5 py-4 rounded-2xl text-xs font-bold tracking-wider uppercase transition-all duration-200 cursor-pointer border ${
                    activeTab === 'candidates'
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-650/20 border-indigo-500'
                      : 'text-slate-400 hover:text-white hover:bg-white/5 border-transparent'
                  }`}
                >
                  <FaGraduationCap className="text-sm" />
                  <span>Kandidat BEM</span>
                </button>
              </>
            )}
          </nav>
        </div>

        {/* Sidebar Footer (Admin details & logout) */}
        <div className="space-y-4.5 pt-6 border-t border-white/10">
          <div className="flex items-center gap-3 bg-white/5 p-3.5 rounded-2xl border border-white/5">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center font-bold text-xs text-white shadow-md">
              {loggedInAdmin?.username?.substring(0, 2).toUpperCase() || 'AD'}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-extrabold truncate text-white">{loggedInAdmin?.name || 'Administrator'}</p>
              <p className="text-[10px] text-slate-400 font-extrabold tracking-wider uppercase">Role: {loggedInAdmin?.role || 'Panitia'}</p>
            </div>
          </div>

          <button
            onClick={() => setShowConfirm(true)}
            className="w-full bg-red-500/10 hover:bg-red-655 text-red-300 hover:text-white border border-red-500/20 font-extrabold text-[10px] py-4 rounded-2xl tracking-widest uppercase flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer active:scale-98"
          >
            <FaSignOutAlt className="text-xs" /> Keluar Panel
          </button>
        </div>
      </aside>

      {/* Main Content Scroll Container */}
      <main className="flex-1 flex flex-col h-screen overflow-y-auto z-10 custom-scroll bg-[#F8FAFC] relative min-w-0">
        
        {/* Header Top Bar */}
        <header className="sticky top-0 bg-white px-4 sm:px-6 lg:px-8 py-4 border-b border-slate-200 z-30 flex justify-between items-center shadow-sm">
          <div className="flex items-center gap-3">
            {/* Hamburger for mobile */}
            <button
              className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open sidebar"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div>
              <span className="text-[11px] font-extrabold text-indigo-600 uppercase tracking-wider block">
                Voteria Panel
              </span>
              <h2 className="text-base sm:text-xl font-extrabold text-[#080627] font-poppins tracking-wide mt-0.5">
                {activeTab === 'dashboard' && 'Dashboard Overview'}
                {activeTab === 'voters' && 'Daftar Pemilih Terverifikasi'}
                {activeTab === 'candidates' && 'Manajemen Pasangan Calon'}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                fetchStats();
                fetchVoters();
                fetchCandidates();
              }}
              title="Segarkan Data"
              className="bg-white hover:bg-slate-50 border border-slate-200 p-3 rounded-2xl text-slate-650 cursor-pointer transition-all duration-150 active:scale-95 flex items-center justify-center shadow-sm"
            >
              <FaSync className={`text-sm ${(statsLoading || votersLoading || candidatesLoading) ? 'animate-spin text-indigo-600' : ''}`} />
            </button>
          </div>
        </header>

        {/* Content Wrapper */}
        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6 lg:space-y-8 flex-1">
          
          {/* TAB 1: DASHBOARD OVERVIEW */}
          {activeTab === 'dashboard' && (
            <div className="space-y-8 animate-tab">
              
              {/* Alert Notification Bar */}
              {statsError && (
                <div className="bg-rose-50 border border-rose-200 text-rose-700 p-4.5 rounded-2xl text-xs font-semibold flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-505 animate-ping"></span>
                  {statsError}
                </div>
              )}
              {successMsg && (
                <div className="bg-green-50 border border-green-200 text-green-700 p-4.5 rounded-2xl text-xs font-semibold">
                  {successMsg}
                </div>
              )}

              {/* Stats Cards Section */}
              {statsLoading && !stats ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-white border border-slate-200 rounded-3xl p-6 h-32 animate-pulse shadow-sm"></div>
                  ))}
                </div>
              ) : (
                stats && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                    {/* Total Registered Voters */}
                    <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex items-center justify-between hover:shadow-md transition-all duration-300">
                      <div className="space-y-1.5">
                        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Pemilih Terdaftar</span>
                        <h3 className="text-3xl font-black font-poppins text-[#080627]">{stats.total_registered_voters}</h3>
                        <p className="text-[11px] text-slate-400 font-semibold tracking-wider">Tervalidasi di Database</p>
                      </div>
                      <div className="bg-indigo-50 text-indigo-600 rounded-2xl p-4.5 text-xl border border-indigo-100/50 shadow-inner">
                        <FaUsers />
                      </div>
                    </div>

                    {/* Voted Count */}
                    <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex items-center justify-between hover:shadow-md transition-all duration-300">
                      <div className="space-y-1.5">
                        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Suara Terverifikasi</span>
                        <h3 className="text-3xl font-black font-poppins text-[#080627]">{stats.voted_count}</h3>
                        <p className="text-[11px] text-slate-400 font-semibold tracking-wider">Telah Dicatat di Ledger</p>
                      </div>
                      <div className="bg-green-50 text-green-600 rounded-2xl p-4.5 text-xl border border-green-100/50 shadow-inner">
                        <FaVoteYea />
                      </div>
                    </div>

                    {/* Participation Percentage */}
                    <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex items-center justify-between hover:shadow-md transition-all duration-300">
                      <div className="space-y-1.5">
                        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Tingkat Partisipasi</span>
                        <h3 className="text-3xl font-black font-poppins text-[#080627]">{stats.participation_percentage}%</h3>
                        <p className="text-[11px] text-slate-400 font-semibold tracking-wider">Kehadiran Digital Pemilih</p>
                      </div>
                      <div className="bg-rose-50 text-rose-600 rounded-2xl p-4.5 text-xl border border-rose-100/50 shadow-inner">
                        <FaPercentage />
                      </div>
                    </div>
                  </div>
                )
              )}

              {/* Real-time Voting Results and Candidate Distribution */}
              <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-8 shadow-sm overflow-hidden">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center border-b border-slate-100 pb-5 mb-6 gap-4">
                  <div>
                    <h3 className="text-base font-bold text-[#080627] font-poppins uppercase tracking-wider">
                      Hasil Perolehan Suara Paslon
                    </h3>
                    <p className="text-xs text-slate-400 font-medium font-sans">
                      Konsensus real-time yang terenkripsi dan diverifikasi oleh Zero-Knowledge Proofs
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-2 text-xs font-black bg-indigo-50 border border-indigo-100 text-indigo-600 px-4 py-1.5 rounded-full uppercase tracking-widest self-start">
                    <FaCube className="text-[10px] text-indigo-600" /> Total Suara: {totalVotesCast}
                  </span>
                </div>

                {candidatesLoading ? (
                  <div className="space-y-4">
                    {[1, 2].map(i => (
                      <div key={i} className="h-16 bg-slate-50 border border-slate-100 rounded-2xl animate-pulse"></div>
                    ))}
                  </div>
                ) : candidates.length === 0 ? (
                  <div className="text-center py-8 text-slate-400 text-xs font-bold uppercase tracking-wider">
                    Belum ada kandidat yang terdaftar.
                  </div>
                ) : (
                  <div className="space-y-6">
                    {candidates.map((cand) => {
                      const voteCount = cand.votes || 0;
                      const votePercent = totalVotesCast > 0 ? ((voteCount / totalVotesCast) * 100).toFixed(1) : '0.0';
                      
                      return (
                        <div key={cand.id} className="group flex items-center gap-4 bg-slate-50/70 hover:bg-slate-50 p-4 border border-slate-150 rounded-2xl transition-all duration-300 overflow-hidden">
                          {/* Photo avatar */}
                          <div className="w-14 h-14 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                            <img 
                              src={getPhotoUrl(cand.photo_url) || 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="150" height="150" viewBox="0 0 150 150"><rect width="100%" height="100%" fill="%23f1f5f9"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="12" fill="%2394a3b8">No Photo</text></svg>'} 
                              alt={cand.chairman_name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="150" height="150" viewBox="0 0 150 150"><rect width="100%" height="100%" fill="%23f1f5f9"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="12" fill="%2394a3b8">No Photo</text></svg>';
                              }}
                            />
                          </div>
                          
                          {/* Candidate info & Progress bar */}
                          <div className="flex-1 min-w-0 space-y-2">
                            <div className="flex flex-wrap justify-between items-start gap-x-3 gap-y-1">
                              <h4 className="font-extrabold text-sm text-[#080627] font-poppins min-w-0 break-words leading-snug" style={{wordBreak:'break-word', overflowWrap:'anywhere'}}>
                                Paslon {cand.candidate_number} — {cand.chairman_name} & {cand.vice_chairman_name}
                              </h4>
                              <span className="text-xs font-black font-poppins text-indigo-600 bg-indigo-50 border border-indigo-100 px-3 py-1 rounded-full shrink-0 whitespace-nowrap">
                                {voteCount} Suara ({votePercent}%)
                              </span>
                            </div>
                            
                            {/* Graphical Progress Bar */}
                            <div className="w-full bg-slate-200 rounded-full h-3.5 overflow-hidden p-0.5">
                              <div 
                                className="bg-indigo-600 h-full rounded-full transition-all duration-1000 ease-out shadow-sm"
                                style={{ width: `${votePercent}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Control Panel Section (Run / Pause Election) - ONLY visible for KPUM role */}
              {isKpumRole && (
                <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
                  <h3 className="text-base font-bold text-[#080627] uppercase tracking-wider mb-6 border-b border-slate-100 pb-3 flex items-center gap-2.5 font-poppins">
                    <FaCogs className="text-indigo-600 text-sm" /> Manajemen Status Pemilihan
                  </h3>
                  <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                    <div className="max-w-xl">
                      <p className="text-xs font-black text-slate-500 uppercase flex items-center gap-2 mb-2 tracking-wider">
                        Status Konsensus Pemilihan:{' '}
                        {isActive ? (
                          <span className="bg-green-50 border border-green-200 text-green-600 px-3 py-0.5 rounded-full font-bold text-xs">Aktif / Berjalan</span>
                        ) : (
                          <span className="bg-rose-50 border border-rose-200 text-rose-600 px-3 py-0.5 rounded-full font-bold text-xs">Nonaktif / Ditutup</span>
                        )}
                      </p>
                      <p className="text-xs text-slate-400 leading-relaxed font-medium">
                        Mengubah status ini memblokir atau membuka akses tombol voting pemilih secara real-time. Aksi ini sinkron dengan otorisasi tanda tangan relayer pada backend.
                      </p>
                    </div>
                    
                    <button
                      onClick={handleToggleElection}
                      disabled={toggleLoading}
                      className={`px-8 py-4 rounded-2xl font-black text-white uppercase tracking-widest text-[10px] transition-all duration-300 cursor-pointer flex items-center gap-2.5 shadow-md active:scale-95 hover:-translate-y-0.5 ${
                        isActive 
                          ? 'bg-rose-600 hover:bg-rose-500 border border-rose-500' 
                          : 'bg-green-600 hover:bg-green-500 border border-green-500'
                      } ${toggleLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {toggleLoading ? (
                        'Memproses Konsensus...'
                      ) : isActive ? (
                        <>
                          <FaPause className="text-[10px]" /> Hentikan Pemilihan
                        </>
                      ) : (
                        <>
                          <FaPlay className="text-[10px]" /> Mulai Pemilihan
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Validator Node Control Panel (For Validator Roles: rektor, dekan_1, dekan_2, kpum) */}
              {isValidatorRole && (
                <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
                  <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 border-b border-slate-100 pb-5">
                    <div>
                      <span className="text-[11px] font-black text-indigo-600 uppercase tracking-wider block">
                        PBFT Consensus Node Control
                      </span>
                      <h3 className="text-xl font-bold text-[#080627] font-poppins mt-1">
                        {nodeNameMap[adminRole]}
                      </h3>
                      <p className="text-xs text-slate-400 font-medium font-sans mt-0.5">
                        Validator Node status dalam jaringan blockchain Voteria (ChainID: 9988)
                      </p>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-black text-[9px] uppercase tracking-wider ${
                        nodeActive 
                          ? 'bg-green-50 border border-green-200 text-green-600' 
                          : 'bg-rose-50 border border-rose-200 text-rose-600'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${nodeActive ? 'bg-green-500 animate-pulse' : 'bg-rose-500'}`}></span>
                        {nodeActive ? 'Online / Validating' : 'Offline / Suspended'}
                      </span>

                      <button
                        onClick={handleToggleNode}
                        className={`px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-wider text-white shadow-sm transition-all active:scale-95 cursor-pointer ${
                          nodeActive 
                            ? 'bg-rose-600 hover:bg-rose-500' 
                            : 'bg-indigo-600 hover:bg-indigo-500'
                        }`}
                      >
                        {nodeActive ? 'Matikan Server Node' : 'Nyalakan Server Node'}
                      </button>
                    </div>
                  </div>

                  {/* Terminal Log Console */}
                  <div className="bg-[#090916] border border-slate-800 p-5 font-mono text-xs text-green-400 h-64 overflow-y-auto rounded-2xl shadow-2xl flex flex-col space-y-1.5 text-left relative">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2 text-slate-450 uppercase tracking-widest font-sans font-bold text-[10px]">
                      <span className="flex items-center gap-1.5">
                        <FaCube className="text-[10px]" /> PBFT Validator Node Terminal CLI
                      </span>
                      <span className={`w-2 h-2 rounded-full ${nodeActive ? 'bg-green-500 animate-pulse' : 'bg-rose-500'}`}></span>
                    </div>
                    {nodeLogs.map((log, idx) => (
                      <p key={idx} className="break-all leading-normal">{log}</p>
                    ))}
                    {nodeActive && (
                      <span className="inline-block w-1.5 h-3.5 bg-green-400 animate-pulse"></span>
                    )}
                  </div>
                </div>
              )}

              {/* Validator Network Monitor (For Admin Role) */}
              {isAdminRole && (
                <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
                  <div className="border-b border-slate-100 pb-4">
                    <h3 className="text-base font-bold text-[#080627] font-poppins uppercase tracking-wider flex items-center gap-2">
                      <FaLink className="text-indigo-600 text-sm" /> Validator Network Monitor (PBFT)
                    </h3>
                    <p className="text-xs text-slate-400 font-medium font-sans mt-0.5">
                      Memantau keaktifan server node validator konsensus secara real-time
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                      { key: 'rektor', name: 'Node Rektor', desc: 'Rektorat Main Server' },
                      { key: 'dekan_1', name: 'Node Dekan 1', desc: 'Fakultas Sosial & Bisnis' },
                      { key: 'dekan_2', name: 'Node Dekan 2', desc: 'Fakultas Sains & Teknologi' },
                      { key: 'kpum', name: 'Node KPUM', desc: 'Komisi Pemilihan Umum Mahasiswa' }
                    ].map((node) => {
                      const active = allNodesState[node.key];
                      return (
                        <div 
                          key={node.key} 
                          className={`p-5 rounded-2xl border transition-all duration-300 flex flex-col justify-between h-32 ${
                            active 
                              ? 'bg-green-50/20 border-green-200 shadow-sm' 
                              : 'bg-rose-50/20 border-rose-200'
                          }`}
                        >
                          <div>
                            <h4 className="font-extrabold text-xs text-[#080627]">{node.name}</h4>
                            <p className="text-[10px] text-slate-400 mt-0.5 font-medium">{node.desc}</p>
                          </div>
                          <div className="flex items-center justify-between mt-4">
                            <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest font-bold">
                              PBFT PEER
                            </span>
                            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-black text-[8px] uppercase tracking-wider ${
                              active 
                                ? 'bg-green-100 text-green-700' 
                                : 'bg-rose-100 text-rose-700'
                            }`}>
                              <span className={`w-1 h-1 rounded-full ${active ? 'bg-green-500 animate-pulse' : 'bg-rose-500'}`}></span>
                              {active ? 'ONLINE' : 'OFFLINE'}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Extra Blockchain Details */}
              <div className="bg-white border border-slate-200 p-8 rounded-3xl shadow-sm font-mono text-xs relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-[0.02] pointer-events-none">
                  <FaCube className="text-9xl" />
                </div>
                <span className="font-extrabold text-slate-400 uppercase tracking-widest block mb-5 flex items-center gap-2 border-b border-slate-100 pb-3">
                  <FaLink className="text-indigo-600" /> Blockchain Ledger Config
                </span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
                  <div>
                    <span className="block text-slate-450 font-bold uppercase tracking-wider mb-2 text-[10px]">Smart Contract Address (ZKP Verifier):</span>
                    <span className="text-indigo-600 font-semibold break-all block bg-slate-50 p-4 border border-slate-100 rounded-2xl">{electionSettings?.smart_contract_address || 'Tidak Terhubung'}</span>
                  </div>
                  <div>
                    <span className="block text-slate-455 font-bold uppercase tracking-wider mb-2 text-[10px]">Election Event Title:</span>
                    <span className="text-indigo-600 font-semibold block bg-slate-50 p-4 border border-slate-100 rounded-2xl">{electionSettings?.election_name || '-'}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: VOTERS LIST & ADD FORM */}
          {activeTab === 'voters' && isAdminRole && (
            <div className="space-y-8 animate-tab">
              
              {/* Messages & Modals */}
              {voterErrorMsg && (
                <div className="bg-rose-50 border border-rose-200 text-rose-700 p-4.5 rounded-2xl text-xs font-semibold">
                  {voterErrorMsg}
                </div>
              )}
              {voterSuccessMsg && (
                <div className="bg-green-50 border border-green-200 text-green-700 p-4.5 rounded-2xl text-xs font-semibold">
                  {voterSuccessMsg}
                </div>
              )}

              {/* Modal Popup Form for Adding Voter */}
              {showVoterForm && (
                <div className="absolute inset-0 bg-[#080627]/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                  <div className="bg-white border border-slate-200 p-8 rounded-3xl shadow-2xl border-t-2 border-indigo-500 w-full max-w-2xl animate-tab text-left">
                    <div className="flex justify-between items-center border-b border-slate-100 pb-4 mb-6">
                      <h3 className="text-sm font-bold text-[#080627] uppercase tracking-wider font-poppins">
                        Registrasi Pemilih Baru
                      </h3>
                      <button 
                        onClick={() => {
                          setShowVoterForm(false);
                          setVoterErrorMsg('');
                          setVoterSuccessMsg('');
                        }}
                        className="text-slate-450 hover:text-slate-655 p-1 cursor-pointer transition-colors"
                      >
                        <FaTimes className="text-sm" />
                      </button>
                    </div>

                    <form onSubmit={handleAddVoter} className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {/* NIM */}
                      <div>
                        <label className="block text-[10px] font-black text-slate-450 uppercase tracking-widest mb-2">
                          Nomor Induk Mahasiswa (NIM)
                        </label>
                        <div className="relative">
                          <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                            <FaIdCard className="text-xs" />
                          </span>
                          <input
                            type="text"
                            required
                            value={voterForm.nim}
                            onChange={(e) => setVoterForm({...voterForm, nim: e.target.value})}
                            placeholder="Contoh: 105240003"
                            className="w-full pl-9 pr-4 py-3 bg-[#F8FAFC] border border-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 rounded-xl text-slate-800 text-xs font-semibold transition-all placeholder-slate-400"
                          />
                        </div>
                      </div>

                      {/* Nama */}
                      <div>
                        <label className="block text-[10px] font-black text-slate-450 uppercase tracking-widest mb-2">
                          Nama Lengkap
                        </label>
                        <div className="relative">
                          <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                            <FaUser className="text-xs" />
                          </span>
                          <input
                            type="text"
                            required
                            value={voterForm.name}
                            onChange={(e) => setVoterForm({...voterForm, name: e.target.value})}
                            placeholder="Nama lengkap pemilih"
                            className="w-full pl-9 pr-4 py-3 bg-[#F8FAFC] border border-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 rounded-xl text-slate-800 text-xs font-semibold transition-all placeholder-slate-400"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {/* Email */}
                      <div>
                        <label className="block text-[10px] font-black text-slate-450 uppercase tracking-widest mb-2">
                          Alamat Email
                        </label>
                        <div className="relative">
                          <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                            <FaEnvelope className="text-xs" />
                          </span>
                          <input
                            type="email"
                            required
                            value={voterForm.email}
                            onChange={(e) => setVoterForm({...voterForm, email: e.target.value})}
                            placeholder="Contoh: user@student.univ.ac.id"
                            className="w-full pl-9 pr-4 py-3 bg-[#F8FAFC] border border-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 rounded-xl text-slate-800 text-xs font-semibold transition-all placeholder-slate-400"
                          />
                        </div>
                      </div>

                      {/* Fakultas */}
                      <div>
                        <label className="block text-[10px] font-black text-slate-450 uppercase tracking-widest mb-2">
                          Asal Fakultas
                        </label>
                        <div className="relative">
                          <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                            <FaGraduationCap className="text-xs" />
                          </span>
                          <select
                            required
                            value={voterForm.faculty}
                            onChange={(e) => setVoterForm({...voterForm, faculty: e.target.value})}
                            className="w-full pl-9 pr-8 py-3 bg-[#F8FAFC] border border-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 rounded-xl text-slate-600 focus:text-slate-800 text-xs font-semibold transition-all appearance-none"
                          >
                            <option value="" className="text-slate-400">-- Pilih Fakultas --</option>
                            <option value="Fakultas Ilmu Sosial dan Bisnis">Fakultas Ilmu Sosial dan Bisnis</option>
                            <option value="Fakultas Sains dan Teknologi">Fakultas Sains dan Teknologi</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-3 justify-end pt-3">
                      <button
                        type="button"
                        onClick={() => {
                          setShowVoterForm(false);
                          setVoterErrorMsg('');
                          setVoterSuccessMsg('');
                        }}
                        className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-650 font-bold text-xs rounded-xl uppercase tracking-wider transition-colors cursor-pointer"
                      >
                        Batal
                      </button>
                      <button
                        type="submit"
                        disabled={addVoterLoading}
                        className="px-7 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs rounded-xl uppercase tracking-wider shadow-md transition-all cursor-pointer active:scale-95"
                      >
                        {addVoterLoading ? 'Mendaftarkan...' : 'Daftarkan Mahasiswa'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

              {/* Voters List Section */}
              <div className="space-y-6">
                
                {/* Header Actions */}
                <div className="flex justify-between items-center">
                  <h3 className="text-base font-bold text-[#080627] font-poppins uppercase tracking-wider">
                    Daftar Pemilih Terdaftar ({filteredVoters.length})
                  </h3>
                  {!showVoterForm && isAdminRole && (
                    <button
                      onClick={() => {
                        setShowVoterForm(true);
                        setVoterForm({ nim: '', name: '', email: '', faculty: '' });
                        setVoterErrorMsg('');
                        setVoterSuccessMsg('');
                      }}
                      className="px-6 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs rounded-2xl uppercase tracking-widest flex items-center gap-2 transition-all cursor-pointer shadow-md active:scale-95"
                    >
                      <FaUserPlus className="text-[10px]" /> Register Pemilih
                    </button>
                  )}
                </div>

                <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
                  
                  {/* Search and Table Filters */}
                  <div className="p-4 sm:p-6 border-b border-slate-100 flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
                    <div className="relative w-full md:max-w-xs">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-450">
                        <FaSearch className="text-xs" />
                      </span>
                      <input
                        type="text"
                        value={votersSearch}
                        onChange={(e) => setVotersSearch(e.target.value)}
                        placeholder="Cari NIM, nama, fakultas..."
                        className="w-full pl-9 pr-4 py-2.5 bg-[#F8FAFC] border border-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 rounded-xl text-slate-800 text-xs font-semibold transition-all placeholder-slate-400"
                      />
                    </div>
                    
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 bg-slate-50 px-3.5 py-1.5 rounded-full border border-slate-100 tracking-wider">
                      <FaDatabase className="text-[10px]" /> Total Pemilih: {voters.length}
                    </span>
                  </div>

                  {/* Table View */}
                  {votersLoading ? (
                    <div className="p-12 space-y-4">
                      {[1, 2, 3, 4].map(i => (
                        <div key={i} className="h-10 bg-slate-50 border border-slate-100 rounded-xl animate-pulse"></div>
                      ))}
                    </div>
                  ) : votersError ? (
                    <div className="p-12 text-center text-rose-500 font-extrabold text-xs uppercase tracking-wider">
                      {votersError}
                    </div>
                  ) : filteredVoters.length === 0 ? (
                    <div className="p-12 text-center text-slate-400 font-extrabold text-xs uppercase tracking-wider">
                      Tidak ada data pemilih.
                    </div>
                  ) : (
                    <>
                      <div className="overflow-x-auto">
                        <table className="w-full text-center border-collapse">
                          <thead>
                            <tr className="bg-slate-55 border-b border-slate-100">
                              <th className="p-4.5 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">NIM</th>
                              <th className="p-4.5 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Nama Pemilih</th>
                              <th className="p-4.5 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Fakultas</th>
                              <th className="p-4.5 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Email</th>
                              <th className="p-4.5 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Status Memilih</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {currentVoters.map((voter) => (
                              <tr key={voter.id} className="hover:bg-slate-50/50 transition-colors duration-200">
                                <td className="p-4.5 text-xs font-black text-slate-900 text-center">{voter.nim}</td>
                                <td className="p-4.5 text-xs font-bold text-slate-700 text-center">{voter.name}</td>
                                <td className="p-4.5 text-xs font-semibold text-slate-500 text-center">{voter.faculty}</td>
                                <td className="p-4.5 text-xs text-slate-500 font-medium text-center">{voter.email}</td>
                                <td className="p-4.5 text-xs text-center">
                                  {voter.has_voted ? (
                                    <span className="inline-flex items-center gap-1.5 bg-green-50 border border-green-200 text-green-600 px-3 py-1 rounded-full font-extrabold text-[9px] uppercase tracking-wider">
                                      <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                                      Sudah Memilih
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center gap-1.5 bg-amber-50 border border-amber-200 text-amber-600 px-3 py-1 rounded-full font-extrabold text-[9px] uppercase tracking-wider">
                                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                                      Belum Memilih
                                    </span>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      {/* Pagination Controls */}
                      {totalVoterPages > 1 && (
                        <div className="p-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50/30">
                          <span className="text-xs text-slate-500 font-semibold">
                            Menampilkan {indexOfFirstVoter + 1} - {Math.min(indexOfLastVoter, filteredVoters.length)} dari {filteredVoters.length} pemilih
                          </span>
                          
                          <div className="flex gap-2">
                            <button
                              onClick={() => setVotersCurrentPage(prev => Math.max(prev - 1, 1))}
                              disabled={votersCurrentPage === 1}
                              className="px-4 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-all shadow-sm active:scale-95 disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                            >
                              Sebelumnya
                            </button>
                            <span className="px-4 py-2 bg-indigo-50 border border-indigo-100 text-indigo-600 font-semibold text-xs rounded-xl flex items-center shadow-inner">
                              Halaman {votersCurrentPage} dari {totalVoterPages}
                            </span>
                            <button
                              onClick={() => setVotersCurrentPage(prev => Math.min(prev + 1, totalVoterPages))}
                              disabled={votersCurrentPage === totalVoterPages}
                              className="px-4 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-all shadow-sm active:scale-95 disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                            >
                              Selanjutnya
                            </button>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>

            </div>
          )}

          {/* TAB 3: CANDIDATES LIST & CRUD FORM */}
          {activeTab === 'candidates' && isAdminRole && (
            <div className="space-y-8 animate-tab">
              
              {/* Messages */}
              {candidateSuccessMsg && (
                <div className="bg-green-50 border border-green-200 text-green-700 p-4.5 rounded-2xl text-xs font-bold">
                  {candidateSuccessMsg}
                </div>
              )}
              {candidateErrorMsg && (
                <div className="bg-rose-50 border border-rose-200 text-rose-700 p-4.5 rounded-2xl text-xs font-bold">
                  {candidateErrorMsg}
                </div>
              )}

              {/* Add/Edit Candidate Form Overlay Card */}
              {showCandidateForm && (
                <div className="absolute inset-0 bg-[#080627]/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                  <div className="bg-white border border-slate-200 p-8 rounded-3xl shadow-2xl border-t-2 border-indigo-500 w-full max-w-3xl animate-tab text-left overflow-y-auto max-h-[90vh] custom-scroll">
                    <div className="flex justify-between items-center border-b border-slate-100 pb-4 mb-6">
                      <h3 className="text-sm font-bold text-[#080627] uppercase tracking-wider font-poppins">
                        {editingCandidate ? 'Sunting Data Kandidat BEM' : 'Daftarkan Kandidat BEM Baru'}
                      </h3>
                      <button 
                        onClick={cancelCandidateForm}
                        className="text-slate-450 hover:text-slate-655 p-1 cursor-pointer transition-colors"
                      >
                        <FaTimes className="text-sm" />
                      </button>
                    </div>

                    <form onSubmit={handleCandidateSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                      
                      {/* Nomor Urut */}
                      <div>
                        <label className="block text-[10px] font-black text-slate-455 uppercase tracking-widest mb-2">
                          Nomor Urut
                        </label>
                        <input
                          type="number"
                          required
                          value={candidateForm.candidate_number}
                          onChange={(e) => setCandidateForm({...candidateForm, candidate_number: e.target.value})}
                          placeholder="Nomor Urut Paslon"
                          disabled={editingCandidate}
                          className="w-full px-4 py-3 bg-[#F8FAFC] border border-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 rounded-xl text-slate-800 text-xs font-semibold transition-all disabled:opacity-40"
                        />
                      </div>

                      {/* Nama Ketua */}
                      <div>
                        <label className="block text-[10px] font-black text-slate-455 uppercase tracking-widest mb-2">
                          Nama Calon Ketua
                        </label>
                        <input
                          type="text"
                          required
                          value={candidateForm.chairman_name}
                          onChange={(e) => setCandidateForm({...candidateForm, chairman_name: e.target.value})}
                          placeholder="Nama Lengkap Ketua BEM"
                          className="w-full px-4 py-3 bg-[#F8FAFC] border border-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 rounded-xl text-slate-800 text-xs font-semibold transition-all"
                        />
                      </div>

                      {/* Nama Wakil */}
                      <div>
                        <label className="block text-[10px] font-black text-slate-455 uppercase tracking-widest mb-2">
                          Nama Calon Wakil Ketua
                        </label>
                        <input
                          type="text"
                          required
                          value={candidateForm.vice_chairman_name}
                          onChange={(e) => setCandidateForm({...candidateForm, vice_chairman_name: e.target.value})}
                          placeholder="Nama Lengkap Wakil Ketua"
                          className="w-full px-4 py-3 bg-[#F8FAFC] border border-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 rounded-xl text-slate-800 text-xs font-semibold transition-all"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {/* Visi */}
                      <div>
                        <label className="block text-[10px] font-black text-slate-455 uppercase tracking-widest mb-2">
                          Visi Pasangan Calon
                        </label>
                        <textarea
                          required
                          rows={4}
                          value={candidateForm.vision}
                          onChange={(e) => setCandidateForm({...candidateForm, vision: e.target.value})}
                          placeholder="Jabarkan visi pasangan calon ketua secara detail..."
                          className="w-full px-4 py-3 bg-[#F8FAFC] border border-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 rounded-xl text-slate-800 text-xs font-semibold transition-all"
                        ></textarea>
                      </div>

                      {/* Misi */}
                      <div>
                        <label className="block text-[10px] font-black text-slate-455 uppercase tracking-widest mb-2">
                          Misi Pasangan Calon
                        </label>
                        <textarea
                          required
                          rows={4}
                          value={candidateForm.mission}
                          onChange={(e) => setCandidateForm({...candidateForm, mission: e.target.value})}
                          placeholder="Jabarkan poin-poin misi pasangan calon ketua (gunakan baris baru)..."
                          className="w-full px-4 py-3 bg-[#F8FAFC] border border-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 rounded-xl text-slate-800 text-xs font-semibold transition-all"
                        ></textarea>
                      </div>
                    </div>

                    {/* Photo File Input */}
                    <div>
                      <label className="block text-[10px] font-black text-slate-455 uppercase tracking-widest mb-2">
                        Unggah Foto Paslon (Format Gambar)
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        required={!editingCandidate}
                        onChange={(e) => setCandidatePhotoFile(e.target.files[0])}
                        className="w-full px-4 py-3 bg-[#F8FAFC] border border-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 rounded-xl text-slate-800 text-xs font-semibold transition-all"
                      />
                      {editingCandidate && candidateForm.photo_url && !candidatePhotoFile && (
                        <p className="text-[10px] text-indigo-600 mt-2 font-semibold">
                          Foto saat ini: {candidateForm.photo_url.split('/').pop()}
                        </p>
                      )}
                    </div>

                    <div className="flex gap-3 justify-end pt-3">
                      <button
                        type="button"
                        onClick={cancelCandidateForm}
                        className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-655 font-bold text-xs rounded-xl uppercase tracking-wider transition-colors cursor-pointer"
                      >
                        Batal
                      </button>
                      <button
                        type="submit"
                        disabled={candidateFormLoading}
                        className="px-7 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs rounded-xl uppercase tracking-wider shadow-md transition-all cursor-pointer active:scale-95"
                      >
                        {candidateFormLoading ? 'Menyimpan...' : 'Simpan Data Paslon'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

              {/* Candidates Grid */}
              <div className="space-y-6">
                
                {/* Header Actions */}
                <div className="flex flex-wrap justify-between items-center gap-3">
                  <h3 className="text-base font-bold text-[#080627] font-poppins uppercase tracking-wider">
                    Kandidat BEM Terdaftar ({candidates.length})
                  </h3>
                  {!showCandidateForm && (
                    <button
                      onClick={() => {
                        setEditingCandidate(null);
                        setCandidateForm({
                          candidate_number: '',
                          chairman_name: '',
                          vice_chairman_name: '',
                          vision: '',
                          mission: '',
                          photo_url: ''
                        });
                        setCandidateErrorMsg('');
                        setCandidateSuccessMsg('');
                        setShowCandidateForm(true);
                      }}
                      className="px-6 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs rounded-2xl uppercase tracking-widest flex items-center gap-2 transition-all cursor-pointer shadow-md active:scale-95"
                    >
                      <FaPlus className="text-[9px]" /> Tambah Kandidat BEM
                    </button>
                  )}
                </div>

                {candidatesLoading ? (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                    {[1, 2].map(i => (
                      <div key={i} className="bg-white border border-slate-200 rounded-3xl p-6 h-96 animate-pulse"></div>
                    ))}
                  </div>
                ) : candidates.length === 0 ? (
                  <div className="bg-white border border-slate-250 p-12 text-center rounded-3xl text-slate-400 text-xs font-black uppercase tracking-widest border-dashed">
                    Belum ada kandidat terdaftar.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                    {candidates.map((cand) => (
                      <div key={cand.id} className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-all duration-300 group">
                        {/* Cover Image & Candidate Number Badge */}
                        <div className="h-64 relative bg-slate-100 overflow-hidden border-b border-slate-200">
                          <img 
                            src={getPhotoUrl(cand.photo_url) || 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400"><rect width="100%" height="100%" fill="%23f1f5f9"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="16" fill="%2394a3b8">No Photo</text></svg>'} 
                            alt={cand.chairman_name} 
                            className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400"><rect width="100%" height="100%" fill="%23f1f5f9"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="16" fill="%2394a3b8">No Photo</text></svg>';
                            }}
                          />
                          <div className="absolute top-4 left-4 bg-indigo-600 text-white font-extrabold font-poppins text-xs px-4 py-2 rounded-2xl shadow-md border border-white/10 tracking-wider">
                            Paslon No. {cand.candidate_number}
                          </div>
                          
                          {/* Top Right Action overlay */}
                          <div className="absolute top-4 right-4 flex gap-2">
                            <button
                              onClick={() => startEditCandidate(cand)}
                              title="Sunting Kandidat"
                              className="bg-white/90 hover:bg-white border border-slate-200 p-3 rounded-xl text-slate-700 hover:text-indigo-600 shadow-md cursor-pointer transition-colors"
                            >
                              <FaEdit className="text-xs" />
                            </button>
                            <button
                              onClick={() => handleDeleteCandidate(cand.id)}
                              title="Hapus Kandidat"
                              className="bg-rose-50 hover:bg-rose-500 border border-rose-200 p-3 rounded-xl text-rose-600 hover:text-white shadow-md cursor-pointer transition-colors"
                            >
                              <FaTrash className="text-xs" />
                            </button>
                          </div>
                        </div>

                        {/* Candidate Names Body */}
                        <div className="p-6 flex-1 space-y-5">
                          <div>
                            <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider block">
                              Pasangan Calon Ketua & Wakil BEM
                            </span>
                            <h4 className="text-base font-extrabold text-[#080627] mt-1 font-poppins tracking-wide">
                              {cand.chairman_name}
                            </h4>
                            <p className="text-xs text-slate-500 font-semibold flex items-center gap-2 mt-1">
                              <FaArrowRight className="text-[10px] text-slate-400" /> {cand.vice_chairman_name}
                            </p>
                          </div>

                          {/* Vision and Mission */}
                          <div className="space-y-4.5 pt-4.5 border-t border-slate-100 text-xs">
                            <div className="space-y-1.5">
                              <span className="font-bold text-[10px] text-slate-400 uppercase tracking-wider block">Visi</span>
                              <p className="text-slate-655 font-medium leading-relaxed bg-[#F8FAFC] p-4 rounded-2xl border border-slate-100">
                                {cand.vision}
                              </p>
                            </div>
                            <div className="space-y-1.5">
                              <span className="font-bold text-[10px] text-slate-400 uppercase tracking-wider block">Misi</span>
                              <p className="text-slate-655 font-medium leading-relaxed bg-[#F8FAFC] p-4 rounded-2xl border border-slate-100 whitespace-pre-line">
                                {cand.mission}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          )}

        </div>
      </main>

      {/* Logout Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-[#02020d]/80 backdrop-blur-sm flex items-center justify-center z-[100] p-6">
          <div className="bg-white border border-slate-100 rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl">
            <div className="w-12 h-12 bg-red-50 text-red-500 rounded-full flex items-center justify-center text-lg font-bold mx-auto mb-5 shadow-sm border border-red-100/50">
              <FaSignOutAlt className="text-sm" />
            </div>
            <h3 className="text-base font-extrabold text-[#080627] font-poppins uppercase tracking-wider mb-2">Konfirmasi Keluar</h3>
            <p className="text-slate-500 text-xs leading-relaxed mb-6 font-medium">Apakah Anda yakin ingin keluar dari panel admin Voteria?</p>
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

    </div>
  );
}
