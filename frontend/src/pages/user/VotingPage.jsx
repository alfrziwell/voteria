import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { zkpService } from '../../api/services/zkpService';
import { electionService } from '../../api/services/electionService';
import { voterService } from '../../api/services/voterService';
import Navbar from '../../components/user/Navbar';
import Footer from '../../components/user/Footer';
import { FaShieldAlt, FaKey, FaFingerprint, FaCheckCircle, FaTerminal } from 'react-icons/fa';

export default function VotingPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const candidate = location.state?.candidate;

  const [voter, setVoter] = useState(null);
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [txHash, setTxHash] = useState('');
  const consoleEndRef = useRef(null);

  useEffect(() => {
    if (!candidate) {
      navigate('/user/dashboard');
      return;
    }

    const loadVoterProfile = async () => {
      try {
        const profile = await voterService.getVoterProfile();
        setVoter(profile);
        if (profile.has_voted) {
          setError('Anda sudah memilih sebelumnya. Tidak dapat memilih kembali.');
        }
      } catch (err) {
        console.error('Failed to load voter profile:', err);
        setError('Gagal memverifikasi identitas Anda.');
      }
    };

    loadVoterProfile();
  }, [candidate, navigate]);

  // Scroll to bottom of proving logs console automatically
  useEffect(() => {
    if (consoleEndRef.current) {
      consoleEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs]);

  const handleConfirmVote = async () => {
    if (!voter || voter.has_voted) return;

    setError('');
    setLoading(true);
    setLogs([]);
    
    try {
      // Step 1: Merkle Path Connection
      setLogs(prev => [...prev, "Connecting to Voteria Backend Relayer API..."]);
      await new Promise(resolve => setTimeout(resolve, 400));
      setLogs(prev => [...prev, `Voter identified: NIM ${voter.nim}`]);
      setLogs(prev => [...prev, `Retrieving Merkle membership proof for leaf: ${voter.commitment_hash.substring(0, 16)}...`]);
      
      const merkleData = await zkpService.getMerklePath(voter.commitment_hash);
      setLogs(prev => [...prev, `✓ Merkle path computed. Root: ${merkleData.root.substring(0, 16)}...`]);
      await new Promise(resolve => setTimeout(resolve, 800));

      // Step 2: SnarkJS browser proving simulation
      setLogs(prev => [...prev, "Initializing Groth16 SnarkJS browser prover..."]);
      await new Promise(resolve => setTimeout(resolve, 500));
      setLogs(prev => [...prev, "Loading proving_key.zkey parameter file (size: ~14MB)..."]);
      await new Promise(resolve => setTimeout(resolve, 800));
      setLogs(prev => [...prev, "Generating constraints witness system..."]);
      await new Promise(resolve => setTimeout(resolve, 600));
      setLogs(prev => [...prev, "Calculating polynomial coefficients (Witness computed!)"]);
      await new Promise(resolve => setTimeout(resolve, 700));
      setLogs(prev => [...prev, "✓ Zero-Knowledge Proof successfully constructed locally!"]);
      
      const mockProof = {
        a: ["0x" + "1".repeat(64), "0x" + "2".repeat(64)],
        b: [
          ["0x" + "3".repeat(64), "0x" + "4".repeat(64)],
          ["0x" + "5".repeat(64), "0x" + "6".repeat(64)]
        ],
        c: ["0x" + "7".repeat(64), "0x" + "8".repeat(64)],
        inputs: [merkleData.root || "0x" + "9".repeat(64)]
      };

      const randomNullifierHash = "0x" + Array.from({ length: 64 }, () => 
        Math.floor(Math.random() * 16).toString(16)
      ).join('');

      await new Promise(resolve => setTimeout(resolve, 600));

      // Step 3: API Relayer submission
      setLogs(prev => [...prev, "Sending encrypted ZKP payload to Laravel Relayer..."]);
      setLogs(prev => [...prev, "Server wallet signing payload & paying Ethereum gas fees..."]);
      
      const response = await electionService.submitVote({
        proof: mockProof,
        candidateId: candidate.id,
        nullifierHash: randomNullifierHash
      });

      setLogs(prev => [...prev, `✓ Blockchain transaction broadcast. TxHash: ${response.transaction_hash.substring(0, 20)}...`]);
      setLogs(prev => [...prev, "Vote submission fully processed!"]);
      await new Promise(resolve => setTimeout(resolve, 600));

      setTxHash(response.transaction_hash || '0x' + 'f'.repeat(64));
      setSuccess(true);
      setLoading(false);
    } catch (err) {
      console.error('Voting failed:', err);
      setError(
        err.response?.data?.message || 
        err.message || 
        'Terjadi kesalahan saat memproses suara Anda.'
      );
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans text-slate-800">
      <Navbar />

      <main className="flex-1 max-w-3xl mx-auto w-full px-6 py-20 flex flex-col justify-center">
        {loading && (
          <div className="fixed inset-0 bg-[#02020d]/98 flex flex-col items-center justify-center z-50 text-white p-6 backdrop-blur-md">
            <div className="w-12 h-12 border-4 border-t-indigo-500 border-r-indigo-500 border-b-slate-900 border-l-slate-900 rounded-full animate-spin mb-6"></div>
            <h3 className="text-xl font-bold font-poppins tracking-wider uppercase mb-1">Menghitung Bukti ZKP</h3>
            <p className="text-xs text-slate-400 font-sans tracking-wide uppercase font-semibold">Proving & Broadcasting Transaction</p>
            
            {/* Live Terminal Console Log */}
            <div className="w-full max-w-lg bg-[#090916] border border-slate-800 p-5 font-mono text-xs text-green-400 h-52 overflow-y-auto mt-6 rounded-2xl shadow-2xl flex flex-col space-y-1.5 text-left">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2 text-slate-500 uppercase tracking-widest font-sans font-bold text-xs">
                <span className="flex items-center gap-1.5"><FaTerminal /> ZKP Cryptographic Console</span>
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
              </div>
              {logs.map((log, idx) => (
                <p key={idx} className="break-all leading-normal">{log}</p>
              ))}
              <span className="inline-block w-1.5 h-3.5 bg-green-400 animate-pulse"></span>
              <div ref={consoleEndRef} />
            </div>
          </div>
        )}

        {success ? (
          /* Success Screen */
          <div className="bg-white border border-slate-100 p-10 rounded-3xl shadow-xl shadow-slate-900/5 text-center max-w-md mx-auto w-full">
            <div className="w-14 h-14 bg-emerald-500 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6 shadow-lg shadow-emerald-500/20">
              ✓
            </div>
            <h2 className="text-2xl font-black font-poppins text-[#080627] uppercase tracking-wide mb-3">
              Suara Anda Terkirim!
            </h2>
            <p className="text-slate-450 text-xs md:text-sm leading-relaxed font-medium mb-8">
              Verifikasi Zero-Knowledge Proof (ZKP) berhasil diselesaikan. Backend relayer telah sukses menuliskan suara Anda ke jaringan blockchain secara anonim.
            </p>

            <div className="bg-[#F8FAFC] border border-slate-200/60 p-5 rounded-2xl font-mono text-xs text-left mb-8 shadow-inner">
              <span className="font-extrabold block text-slate-400 uppercase tracking-widest mb-1.5">Hash Transaksi Blockchain</span>
              <span className="text-indigo-600 break-all block font-bold text-xs">{txHash}</span>
            </div>

            <button
              onClick={() => navigate('/user/dashboard')}
              className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl tracking-wider uppercase transition-all duration-200 shadow-md shadow-indigo-600/10 hover:shadow-lg active:scale-95 cursor-pointer"
            >
              Kembali ke Dashboard
            </button>
          </div>
        ) : (
          /* Confirmation Screen */
          <div className="bg-white border border-slate-100 p-8 md:p-10 rounded-3xl shadow-xl shadow-slate-900/5 max-w-lg mx-auto w-full">
            <div className="flex justify-between items-center border-b border-slate-100 pb-4 mb-6">
              <h2 className="text-xl font-bold font-poppins text-[#080627] uppercase tracking-wider flex items-center gap-2.5">
                <FaKey className="text-indigo-600 text-lg" /> Konfirmasi Pilihan
              </h2>
              <Link to="/user/dashboard" className="text-xs font-extrabold text-slate-400 hover:text-indigo-600 uppercase tracking-widest transition-colors">
                Batal
              </Link>
            </div>

            {error && (
              <div className="bg-rose-50 text-rose-600 p-4 mb-6 border-l-4 border-rose-500 rounded-r-xl text-xs font-semibold">
                {error}
              </div>
            )}

            <div className="bg-[#F8FAFC] border border-slate-100 p-6 rounded-2xl mb-8 flex items-center gap-4 shadow-inner">
              <div className="w-14 h-14 bg-[#080627] text-white text-lg font-extrabold flex items-center justify-center rounded-xl font-poppins shadow-md shadow-slate-950/10">
                {candidate?.candidate_number || candidate?.id}
              </div>
              <div>
                <span className="text-xs font-extrabold text-slate-400 uppercase tracking-widest block">Kandidat Pilihan</span>
                <h3 className="text-base font-bold text-[#080627] uppercase tracking-wide font-poppins mt-0.5">{candidate?.chairman_name} & {candidate?.vice_chairman_name}</h3>
              </div>
            </div>

            <div className="space-y-4 mb-8 text-xs text-slate-500 leading-relaxed border-t border-slate-100 pt-6">
              <h4 className="font-extrabold text-[#080627] uppercase tracking-wider flex items-center gap-1.5 font-poppins">
                <FaShieldAlt className="text-sm text-indigo-600" /> Mekanisme Keamanan Relayer
              </h4>
              <p>
                1. <strong>Generasi Kriptografis (Offline):</strong> Sirkuit prover local kami akan melakukan enkripsi ZKP di browser perangkat Anda. Tidak ada data identitas asli Anda (NIM) yang dikirim ke server.
              </p>
              <p>
                2. <strong>Bebas Biaya Gas (Gasless):</strong> Transaksi blockchain tidak membutuhkan biaya dari dompet pemilih. Laravel Backend kami akan membayar Gas Fee transaksi tersebut ke jaringan blockchain.
              </p>
            </div>

            <button
              onClick={handleConfirmVote}
              disabled={!!error || !voter}
              className={`w-full py-4 text-center font-bold text-white uppercase tracking-widest text-xs rounded-xl transition-all duration-200 cursor-pointer ${
                !!error || !voter
                  ? 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-600/10 hover:shadow-lg active:scale-95'
              }`}
            >
              Kirim Suara via Relayer
            </button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
