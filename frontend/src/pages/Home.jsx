import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/user/Navbar';
import Footer from '../components/user/Footer';
import logo from '../assets/logo.png';
import teamAlif from '../assets/team_alif.png';
import teamNazril from '../assets/team_nazril.png';
import teamSaepudin from '../assets/team_saepudin.png';
import teamFajli from '../assets/team_fajli.png';
import {
  FaLock, FaNetworkWired, FaServer, FaUser, FaThList,
  FaFingerprint, FaArrowRight, FaChevronDown,
  FaChevronUp, FaQuestionCircle
} from 'react-icons/fa';

export default function Home() {
  const team = [
    { name: 'Alif Alfarizi', nim: '105240003', role: 'Backend Developer', photo: teamAlif },
    { name: 'Nazril Azzam Saepudin', nim: '105240027', role: 'Frontend Developer', photo: teamNazril },
    { name: 'Fajli Handika', nim: '105240007', role: 'Smart Contract Developer', photo: teamFajli },
  ];

  // Interactive Accordion State
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqs = [
    {
      q: "Apakah data pilihan suara saya bisa dilacak oleh Panitia BEM?",
      a: "Sama sekali tidak. Sebelum suara Anda dikirimkan dari perangkat browser, sistem akan melakukan kalkulasi bukti matematika Zero-Knowledge (ZKP). Pilihan asli Anda diubah menjadi enkripsi satu arah (Groth16 Proof) sehingga siapapun (termasuk panitia, server database, dan validator blockchain) tidak akan pernah bisa merekonstruksi kembali identitas pemilih di balik pilihan tersebut."
    },
    {
      q: "Mengapa e-voting Voteria tidak membutuhkan MetaMask atau Wallet Web3?",
      a: "Kami menggunakan Relayer Architecture. Di Web3 konvensional, setiap interaksi blockchain membutuhkan transaksi berbayar (Gas Fee). Kami mengotomatiskan ini dengan menaruh wallet terpusat di Laravel Backend yang bertindak sebagai Relayer untuk menandatangani dan membayar semua biaya gas pemilih secara gratis."
    },
    {
      q: "Bagaimana cara memastikan suara saya benar-benar dihitung di Blockchain?",
      a: "Setelah berhasil memberikan hak suara, Anda akan mendapatkan Hash Transaksi (TxHash) unik. Anda dapat memasukkan hash tersebut ke block explorer lokal Hardhat untuk mengecek status pencatatannya secara real-time dan transparan."
    }
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans text-slate-800">
      <Navbar />

      {/* Hero Section */}
      <header className="bg-[#080627] text-white py-28 md:py-36 px-6 relative overflow-hidden">
        {/* Subtle grid backdrop */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-16 relative z-10">
          <div className="flex-1 text-center lg:text-left space-y-6">
            <span className="bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-bold uppercase tracking-widest px-3.5 py-1.5 rounded-full inline-block">
              Web3 E-Voting Platform
            </span>
            <h1 className="text-5xl md:text-7xl font-black font-poppins tracking-tight uppercase leading-tight">
              Sistem E-Voting <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-200 to-purple-300">VOTERIA</span>
            </h1>
            <p className="text-base md:text-lg text-slate-400 max-w-xl leading-relaxed font-medium">
              Masa depan demokrasi digital mahasiswa yang transparan, aman, dan 100% anonim menggunakan Zero-Knowledge Proofs di atas jaringan blockchain.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
              <Link
                to="/login"
                className="w-full sm:w-auto text-center bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs py-4 px-10 rounded-xl tracking-wider uppercase transition-all duration-200 shadow-lg shadow-indigo-600/10 hover:shadow-indigo-600/25 hover:-translate-y-0.5 active:translate-y-0 active:scale-95 cursor-pointer"
              >
                Mulai Memilih
              </Link>
              <Link
                to="/guide"
                className="w-full sm:w-auto text-center border border-white/20 hover:border-white hover:bg-white/5 text-white font-bold text-xs py-4 px-8 rounded-xl tracking-wider uppercase transition-colors cursor-pointer"
              >
                Lihat Panduan
              </Link>
            </div>
          </div>
          <div className="flex-1 flex justify-center items-center">
            <div className="bg-white/5 border border-white/10 p-6 rounded-3xl shadow-2xl backdrop-blur-sm transition-transform hover:scale-[1.01] duration-300 max-w-md w-full">
              {logo ? (
                <img
                  src={logo}
                  alt="Voteria Logo"
                  className="w-full h-auto object-contain bg-[#080627] p-8 rounded-2xl border border-white/5 shadow-inner"
                />
              ) : (
                <div className="w-full h-72 bg-gray-800 flex items-center justify-center rounded-2xl font-bold">Voteria Logo</div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Technology Explainer */}
      <section className="py-28 px-6 bg-white relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-20 space-y-2">
            <span className="text-indigo-600 text-xs font-bold uppercase tracking-wider block">INTEGRITAS DATA MUTLAK</span>
            <h2 className="text-3xl md:text-4xl font-black text-[#080627] font-poppins uppercase tracking-wide">
              Pilar Teknologi Voteria
            </h2>
            <div className="w-12 h-1 bg-indigo-600 mx-auto rounded-full mt-3"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Blockchain */}
            <div className="bg-[#F8FAFC] p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-indigo-500/5 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group">
              <div>
                <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center text-2xl mb-8 group-hover:scale-110 transition-transform duration-300">
                  <FaNetworkWired />
                </div>
                <h3 className="text-lg font-bold text-[#080627] mb-3 uppercase tracking-wide font-poppins">Blockchain</h3>
                <p className="text-slate-500 text-sm leading-relaxed font-medium">
                  Ledger terdistribusi yang menyimpan data suara secara permanen, menjamin transparansi penuh tanpa adanya titik kegagalan tunggal (SPOF).
                </p>
              </div>
              <div className="mt-8 pt-6 border-t border-slate-200/50 text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                Data Aman & Immutable
              </div>
            </div>

            {/* ZK-Proofs */}
            <div className="bg-[#F8FAFC] p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-indigo-500/5 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group">
              <div>
                <div className="w-14 h-14 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center text-2xl mb-8 group-hover:scale-110 transition-transform duration-300">
                  <FaLock />
                </div>
                <h3 className="text-lg font-bold text-[#080627] mb-3 uppercase tracking-wide font-poppins">ZK-Proofs</h3>
                <p className="text-slate-500 text-sm leading-relaxed font-medium">
                  Menjamin kerahasiaan pilihan Anda secara kriptografis menggunakan algoritma Groth16. Pilihan Anda tidak pernah terbaca oleh server pusat.
                </p>
              </div>
              <div className="mt-8 pt-6 border-t border-slate-200/50 text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                Privasi 100% Terjaga
              </div>
            </div>

            {/* Relayer */}
            <div className="bg-[#F8FAFC] p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-indigo-500/5 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group">
              <div>
                <div className="w-14 h-14 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center text-2xl mb-8 group-hover:scale-110 transition-transform duration-300">
                  <FaServer />
                </div>
                <h3 className="text-lg font-bold text-[#080627] mb-3 uppercase tracking-wide font-poppins">Relayer</h3>
                <p className="text-slate-500 text-sm leading-relaxed font-medium">
                  Sistem pembiayaan Gas Fee otomatis oleh backend Laravel. Pemilih tidak memerlukan wallet Web3 tersendiri untuk menyalurkan hak suara.
                </p>
              </div>
              <div className="mt-8 pt-6 border-t border-slate-200/50 text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                Bebas Gas Fee
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Guide Section */}
      <section className="py-28 px-6 bg-[#F8FAFC] relative border-y border-slate-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-20 space-y-2">
            <span className="text-indigo-600 text-xs font-bold uppercase tracking-wider block">ALUR KERJA INSTAN</span>
            <h2 className="text-3xl md:text-4xl font-black text-[#080627] font-poppins uppercase tracking-wide">
              Langkah Sederhana Memilih
            </h2>
            <div className="w-12 h-1 bg-indigo-600 mx-auto rounded-full mt-3"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden transition-all hover:shadow-md duration-300">
              <span className="absolute -top-6 -right-2 text-8xl font-black font-mono text-slate-50 select-none">
                01
              </span>
              <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center text-lg mb-6 relative z-10">
                <FaUser />
              </div>
              <h3 className="text-base font-bold text-[#080627] mb-2 uppercase tracking-wide font-poppins relative z-10">Masuk Akun</h3>
              <p className="text-slate-500 text-sm leading-relaxed font-medium relative z-10">
                Autentikasi diri Anda dengan memasukkan NIM dan password terdaftar yang dikirim otomatis ke email kampus.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden transition-all hover:shadow-md duration-300">
              <span className="absolute -top-6 -right-2 text-8xl font-black font-mono text-slate-50 select-none">
                02
              </span>
              <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center text-lg mb-6 relative z-10">
                <FaThList />
              </div>
              <h3 className="text-base font-bold text-[#080627] mb-2 uppercase tracking-wide font-poppins relative z-10">Pilih Kandidat</h3>
              <p className="text-slate-500 text-sm leading-relaxed font-medium relative z-10">
                Lihat visi, misi, dan detail profil kandidat ketua BEM, lalu klik tombol "Pilih Kandidat".
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden transition-all hover:shadow-md duration-300">
              <span className="absolute -top-6 -right-2 text-8xl font-black font-mono text-slate-50 select-none">
                03
              </span>
              <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center text-lg mb-6 relative z-10">
                <FaFingerprint />
              </div>
              <h3 className="text-base font-bold text-[#080627] mb-2 uppercase tracking-wide font-poppins relative z-10">Kalkulasi ZKP</h3>
              <p className="text-slate-500 text-sm leading-relaxed font-medium relative z-10">
                Browser melakukan kalkulasi enkripsi bukti kriptografis (ZKP) secara lokal lalu disubmit aman via relayer.
              </p>
            </div>
          </div>

          <div className="text-center mt-14">
            <Link
              to="/guide"
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-indigo-600 hover:text-indigo-700 transition-colors"
            >
              Lihat Detail Langkah Kerja Lengkap <FaArrowRight className="text-[10px]" />
            </Link>
          </div>
        </div>
      </section>

      {/* Interactive FAQ Accordion Section */}
      <section className="py-28 px-6 bg-white relative">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-20 space-y-2">
            <span className="text-indigo-600 text-xs font-bold uppercase tracking-wider block">TANYA JAWAB</span>
            <h2 className="text-3xl font-black text-[#080627] font-poppins uppercase tracking-wide">
              Pertanyaan yang Sering Diajukan
            </h2>
            <div className="w-12 h-1 bg-indigo-600 mx-auto rounded-full mt-3"></div>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="border border-slate-200 rounded-2xl overflow-hidden transition-all duration-300 shadow-sm hover:shadow-md bg-[#F8FAFC]"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full flex justify-between items-center p-6 text-left font-bold text-[#080627] uppercase tracking-wide text-xs md:text-sm focus:outline-none cursor-pointer hover:bg-slate-100/50 transition-colors"
                >
                  <span className="flex items-center gap-3">
                    <FaQuestionCircle className="text-indigo-500 shrink-0 text-sm" />
                    {faq.q}
                  </span>
                  {openFaq === index ? <FaChevronUp className="shrink-0 text-slate-400" /> : <FaChevronDown className="shrink-0 text-slate-400" />}
                </button>

                {openFaq === index && (
                  <div className="p-6 bg-white border-t border-slate-150 text-slate-600 text-xs md:text-sm leading-relaxed font-sans font-medium">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-28 px-6 bg-[#F8FAFC] border-t border-slate-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-24 space-y-2">
            <span className="text-indigo-600 text-xs font-bold uppercase tracking-wider block">PENGEMBANG UTAMA</span>
            <h2 className="text-3xl md:text-4xl font-black text-[#080627] font-poppins uppercase tracking-wide">
              Tim Di Balik Voteria
            </h2>
            <div className="w-12 h-1 bg-indigo-600 mx-auto rounded-full mt-3"></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {team.map((member, i) => (
              <div
                key={i}
                className="bg-white border border-slate-100 rounded-2xl p-8 flex flex-col items-center text-center shadow-sm hover:shadow-xl hover:shadow-indigo-500/5 hover:-translate-y-1 transition-all duration-300 relative group"
              >
                <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-slate-100 shadow-md mb-5 group-hover:scale-105 transition-transform duration-300">
                  <img src={member.photo} alt={member.name} className="w-full h-full object-cover" />
                </div>
                <h3 className="text-base font-bold text-[#080627] tracking-wide mb-1 font-poppins">{member.name}</h3>
                <p className="text-xs text-slate-400 font-mono mb-5">NIM: {member.nim}</p>
                <div className="bg-indigo-50 text-indigo-700 py-1.5 px-3 text-xs uppercase font-extrabold tracking-widest rounded-lg border border-indigo-100">
                  {member.role}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
