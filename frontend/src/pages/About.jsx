import React from 'react';
import Navbar from '../components/user/Navbar';
import Footer from '../components/user/Footer';
import { FaServer, FaCode, FaDatabase, FaNetworkWired, FaUserShield, FaCogs } from 'react-icons/fa';

export default function About() {
  const techStack = [
    {
      icon: <FaCode className="text-xl text-indigo-600" />,
      title: "Frontend (Vite + React)",
      desc: "Interface modern, cepat, dan reaktif berbasis React. Pembuatan Zero-Knowledge Proof (ZKP) dilakukan secara lokal di browser pemilih demi menjaga kerahasiaan pilihan."
    },
    {
      icon: <FaServer className="text-xl text-purple-600" />,
      title: "Backend (Laravel API)",
      desc: "Menyediakan API terpusat untuk verifikasi identitas, manajemen kandidat, sinkronisasi status pemilih, dan bertindak sebagai Relayer transaksi ke blockchain."
    },
    {
      icon: <FaNetworkWired className="text-xl text-rose-600" />,
      title: "Blockchain (Ethereum/Hardhat)",
      desc: "Smart contract terdesentralisasi yang secara otomatis menghitung suara masuk secara transparan dan melakukan verifikasi bukti ZKP on-chain."
    }
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans text-slate-800">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto w-full px-6 py-20">
        {/* Page Title */}
        <div className="text-center max-w-2xl mx-auto mb-20 space-y-4">
          <span className="bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 text-xs font-bold uppercase tracking-widest px-3.5 py-1.5 rounded-full inline-block">
            Tentang Voteria
          </span>
          <h1 className="text-4xl font-black font-poppins text-[#080627] tracking-tight uppercase leading-tight">
            Sistem E-Voting Berbasis ZKP
          </h1>
          <div className="w-12 h-1 bg-indigo-600 mx-auto rounded-full mt-3"></div>
          <p className="text-slate-500 text-xs md:text-sm leading-relaxed font-medium pt-2">
            Voteria didesain untuk menjembatani kesenjangan antara kerahasiaan pemilih (anonymity) dan keabsahan hasil (integrity) pada pemilihan umum digital mahasiswa.
          </p>
        </div>

        {/* 3-Tier Architecture Explainer */}
        <section className="bg-white border border-slate-100 p-8 md:p-12 mb-12 rounded-3xl shadow-sm">
          <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
            <FaCogs className="text-2xl text-indigo-600" />
            <h2 className="text-xl font-bold font-poppins text-[#080627] uppercase tracking-wide">
              Arsitektur 3-Tier & Relayer
            </h2>
          </div>
          <p className="text-slate-500 text-xs md:text-sm leading-relaxed font-medium mb-10">
            Berbeda dengan aplikasi Web3 tradisional di mana pemilih harus menghubungkan wallet mereka (seperti MetaMask) dan membayar gas fee sendiri, Voteria menggunakan <strong>Relayer Architecture</strong>. Pemilih hanya memproses data bukti kriptografi secara anonim, dan mengirimkannya ke Backend Laravel. Backend kami kemudian membayar biaya transaksi (Gas Fee) menggunakan wallet relayer terpusat.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {techStack.map((tech, i) => (
              <div key={i} className="bg-[#F8FAFC] p-6 rounded-2xl border border-slate-100 flex flex-col items-start shadow-xs">
                <div className="bg-white p-3 rounded-xl shadow-inner border border-slate-100 mb-4">
                  {tech.icon}
                </div>
                <h3 className="text-sm font-bold text-[#080627] uppercase mb-2 font-poppins">
                  {tech.title}
                </h3>
                <p className="text-slate-400 text-3xs leading-relaxed font-medium">
                  {tech.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Core Principles */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-slate-900 text-white p-8 rounded-3xl border border-slate-800 shadow-xl shadow-slate-900/5">
            <div className="flex items-center gap-3 mb-4">
              <FaUserShield className="text-xl text-indigo-400" />
              <h3 className="text-base font-bold uppercase tracking-wider font-poppins">Kerahasiaan (Anonymity)</h3>
            </div>
            <p className="text-slate-300 text-xs md:text-sm leading-relaxed font-medium">
              Dengan mengintegrasikan ZK-SNARKs (Groth16), sistem membuktikan bahwa pemilih adalah anggota mahasiswa yang sah tanpa harus mencatat hubungan antara identitas mahasiswa (NIM) dan nomor kandidat pilihan di blockchain.
            </p>
          </div>

          <div className="bg-white text-slate-800 p-8 rounded-3xl border border-slate-100 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <FaDatabase className="text-xl text-indigo-600" />
              <h3 className="text-base font-bold uppercase tracking-wider font-poppins text-[#080627]">Integritas Data (Integrity)</h3>
            </div>
            <p className="text-slate-500 text-xs md:text-sm leading-relaxed font-medium">
              Semua suara yang sah disimpan di dalam ledger blockchain yang immutable (tidak dapat diubah). Setiap suara masuk direkam dalam bentuk hash transaksi yang dapat diaudit publik kapan saja setelah pemilihan ditutup.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
