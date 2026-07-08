import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { candidateService } from '../../api/services/candidateService';
import { electionService } from '../../api/services/electionService';
import { voterService } from '../../api/services/voterService';
import Navbar from '../../components/user/Navbar';
import Footer from '../../components/user/Footer';
import CandidateCard from '../../components/user/CandidateCard';
import { FaCalendarAlt, FaFingerprint, FaPoll, FaSearch, FaSync } from 'react-icons/fa';

export default function UserDashboard() {
  const [candidates, setCandidates] = useState([]);
  const [filteredCandidates, setFilteredCandidates] = useState([]);
  const [election, setElection] = useState(null);
  const [voterProfile, setVoterProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Interactive search state
  const [searchQuery, setSearchQuery] = useState('');

  const navigate = useNavigate();

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');
      const [candidatesData, electionData, profileData] = await Promise.all([
        candidateService.getCandidates(),
        electionService.getElectionStatus(),
        voterService.getVoterProfile()
      ]);

      const items = candidatesData.data || candidatesData;
      setCandidates(items);
      setFilteredCandidates(items);
      setElection(electionData.data || electionData);
      setVoterProfile(profileData);
    } catch (err) {
      console.error('Error loading dashboard data:', err);
      setError('Gagal memuat data pemilihan. Silakan coba beberapa saat lagi.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Handle live search
  useEffect(() => {
    let result = candidates;

    // Filter by name or candidate number
    if (searchQuery.trim() !== '') {
      result = result.filter(c =>
        (c.chairman_name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (c.vice_chairman_name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        String(c.candidate_number || c.id).includes(searchQuery)
      );
    }

    setFilteredCandidates(result);
  }, [searchQuery, candidates]);

  const handleVoteClick = (candidate) => {
    navigate('/user/vote', { state: { candidate } });
  };

  const isElectionClosed = election && !election.is_active;
  const hasVoted = voterProfile && voterProfile.has_voted;

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans text-slate-850">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-12">
        {/* Header Section */}
        <div className="border-b border-slate-200 pb-6 mb-8 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold font-poppins text-slate-900 uppercase tracking-wide flex items-center gap-2">
              <FaPoll className="text-indigo-600 text-2xl" />Pemilihan Suara Umum BEM
            </h1>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mt-2 flex items-center gap-1.5">
              <FaCalendarAlt /> Masa Aktif: {election?.start_time ? new Date(election.start_time).toLocaleDateString('id-ID') : '-'} s/d {election?.end_time ? new Date(election.end_time).toLocaleDateString('id-ID') : '-'}
            </p>
          </div>

          <div className="flex flex-wrap gap-3 items-center">
            {/* Status Pemilu */}
            <div className="flex items-center gap-2 bg-white border border-slate-100 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider text-slate-500 shadow-sm">
              <span>Status Pemilu:</span>
              {isElectionClosed ? (
                <span className="bg-rose-50 border border-rose-100 text-rose-600 px-2.5 py-0.5 rounded-full font-extrabold text-[10px]">Ditutup</span>
              ) : (
                <span className="bg-emerald-50 border border-emerald-100 text-emerald-600 px-2.5 py-0.5 rounded-full font-extrabold text-[10px]">Terbuka</span>
              )}
            </div>

            {/* Status Pemilih */}
            <div className="flex items-center gap-2 bg-white border border-slate-100 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider text-slate-500 shadow-sm">
              <span>Status Anda:</span>
              {hasVoted ? (
                <span className="bg-rose-50 border border-rose-100 text-rose-600 px-2.5 py-0.5 rounded-full font-extrabold text-[10px]">Sudah Memilih</span>
              ) : (
                <span className="bg-emerald-50 border border-emerald-100 text-emerald-600 px-2.5 py-0.5 rounded-full font-extrabold text-[10px]">Belum Memilih</span>
              )}
            </div>

            <button
              onClick={loadData}
              title="Refresh Data"
              className="bg-white hover:bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-slate-600 cursor-pointer flex items-center justify-center transition-all duration-150 active:scale-95 shadow-sm"
            >
              <FaSync className={`text-xs ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-rose-50 text-rose-600 p-4 mb-8 border-l-4 border-rose-500 rounded-r-xl text-xs font-semibold">
            {error}
          </div>
        )}

        {/* Info Box / Notification */}
        {hasVoted && (
          <div className="bg-slate-900 text-white p-8 rounded-3xl border border-slate-800 mb-8 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none"></div>
            <h3 className="font-extrabold text-lg mb-2 uppercase tracking-wide flex items-center gap-2.5 font-poppins text-indigo-300">
              <FaFingerprint className="text-xl" /> Partisipasi Sukses
            </h3>
            <p className="text-xs md:text-sm text-slate-300 leading-relaxed max-w-2xl font-medium">
              Anda telah berhasil menyalurkan hak suara secara aman. Bukti Zero-Knowledge Proof (ZKP) Anda telah tercatat permanen di ledger blockchain. Identitas Anda terjamin tersembunyi sepenuhnya.
            </p>
          </div>
        )}

        {/* Interactive Search Bar */}
        <div className="bg-white border border-slate-100 p-6 mb-8 rounded-2xl shadow-sm">
          <div className="relative w-full">
            <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
              <FaSearch className="text-sm" />
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama kandidat atau nomor urut..."
              className="w-full pl-11 pr-4 py-3.5 bg-[#F8FAFC] border border-slate-200 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 rounded-xl text-slate-800 text-sm font-medium transition-all"
            />
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white border border-slate-100 rounded-3xl p-6 space-y-5 animate-pulse">
                <div className="flex justify-between items-center">
                  <div className="h-10 w-10 bg-slate-100 rounded-xl"></div>
                  <div className="h-6 bg-slate-100 w-24 rounded-full"></div>
                </div>
                <div className="h-52 bg-slate-100 w-full rounded-2xl"></div>
                <div className="h-6 bg-slate-100 w-3/4 rounded-md"></div>
                <div className="space-y-2">
                  <div className="h-3.5 bg-slate-100 w-full rounded-md"></div>
                  <div className="h-3.5 bg-slate-100 w-5/6 rounded-md"></div>
                </div>
                <div className="h-12 bg-slate-100 w-full rounded-xl pt-4"></div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {filteredCandidates.length === 0 ? (
              <div className="bg-white border border-dashed border-slate-200 p-16 rounded-3xl text-center text-slate-400 font-medium text-xs md:text-sm">
                Kandidat yang Anda cari tidak ditemukan. Coba bersihkan kata kunci pencarian Anda.
              </div>
            ) : (
              /* Candidates Grid */
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredCandidates.map((candidate) => (
                  <CandidateCard
                    key={candidate.id}
                    candidate={candidate}
                    onVoteClick={handleVoteClick}
                    disabled={hasVoted || isElectionClosed}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
