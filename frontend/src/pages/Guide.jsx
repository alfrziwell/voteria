import React, { useState } from 'react';
import Navbar from '../components/user/Navbar';
import Footer from '../components/user/Footer';
import { 
  FaSignInAlt, FaUserCheck, FaVoteYea, FaLock, 
  FaCloudUploadAlt, FaShieldAlt, FaQuestionCircle, 
  FaChevronDown, FaChevronUp, FaCheckCircle 
} from 'react-icons/fa';

export default function Guide() {
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const steps = [
    {
      num: "01",
      icon: <FaSignInAlt className="text-xl text-indigo-600" />,
      title: "1. Masuk ke Akun Anda (Login)",
      desc: "Masukkan Nomor Induk Mahasiswa (NIM) dan password Anda yang dikirim otomatis ke email. Langkah ini mirip seperti saat Anda menunjukkan Kartu Mahasiswa (KTM) kepada panitia di pintu masuk TPS untuk memverifikasi bahwa Anda terdaftar sebagai pemilih sah."
    },
    {
      num: "02",
      icon: <FaUserCheck className="text-xl text-purple-600" />,
      title: "2. Dapatkan Tiket Suara Anonim",
      desc: "Sistem secara otomatis menyamarkan identitas asli Anda menjadi kode acak rahasia. Langkah ini menjamin nama Anda terlepas dari surat suara, sehingga siapapun (termasuk panitia pemilu) tidak dapat melacak siapa yang Anda pilih."
    },
    {
      num: "03",
      icon: <FaVoteYea className="text-xl text-pink-600" />,
      title: "3. Tentukan Pilihan Anda",
      desc: "Buka halaman Dashboard, pelajari visi dan misi dari para kandidat ketua BEM yang tersedia, lalu klik tombol 'Pilih Kandidat'. Pilihan Anda saat ini masih tersimpan aman secara lokal di perangkat Anda."
    },
    {
      num: "04",
      icon: <FaLock className="text-xl text-rose-600" />,
      title: "4. Kunci Suara dengan Gembok Kriptografi",
      desc: "Sistem di HP atau komputer Anda akan membuat gembok pelindung matematika (Zero-Knowledge Proof). Pilihan Anda dimasukkan ke dalam kotak suara digital yang terkunci rapat. Hanya Anda yang memegang kuncinya secara rahasia."
    },
    {
      num: "05",
      icon: <FaCloudUploadAlt className="text-xl text-emerald-600" />,
      title: "5. Kirim Suara Secara Gratis",
      desc: "Kotak suara yang terkunci dikirim ke jaringan Blockchain secara otomatis. Server kami bertindak sebagai pengantar (Relayer) yang membayar seluruh biaya pengiriman transaksi. Suara Anda sah terdaftar selamanya tanpa dipungut biaya sepeser pun."
    }
  ];

  const faqs = [
    {
      q: "Apakah pilihan kandidat saya bisa dilihat oleh panitia pemilu?",
      a: "Sama sekali tidak bisa. Sebelum suara dikirimkan dari perangkat Anda, pilihan asli Anda sudah diacak dan dilindungi dengan gembok matematika (ZKP). Server database pusat maupun panitia BEM hanya menerima kotak terkunci yang terbukti sah secara matematika tanpa pernah tahu siapa kandidat pilihan Anda di dalamnya."
    },
    {
      q: "Mengapa saya tidak perlu membayar biaya apa pun atau memasang dompet crypto?",
      a: "Kami menggunakan teknologi Relayer terpusat. Biaya pengiriman data ke jaringan blockchain (Gas Fee) sepenuhnya ditanggung dan dibayarkan oleh server backend kami. Anda cukup memilih seperti menggunakan aplikasi web biasa."
    },
    {
      q: "Bagaimana saya tahu jika suara saya benar-benar sudah masuk?",
      a: "Setelah memilih, Anda akan mendapatkan tanda terima digital berupa kode transaksi unik (Transaction Hash). Kode ini adalah bukti otentik yang membuktikan bahwa suara Anda telah tercatat abadi di jaringan Blockchain dan tidak dapat dimanipulasi oleh siapa pun."
    }
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans text-slate-800">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto w-full px-6 py-20">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-20 space-y-4">
          <span className="bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 text-xs font-bold uppercase tracking-widest px-3.5 py-1.5 rounded-full inline-block">
            Panduan Sederhana
          </span>
          <h1 className="text-4xl font-black font-poppins text-[#080627] tracking-tight uppercase leading-tight">
            Cara Memilih di Voteria
          </h1>
          <div className="w-12 h-1 bg-indigo-600 mx-auto rounded-full mt-3"></div>
          <p className="text-slate-500 text-xs md:text-sm leading-relaxed font-medium pt-2">
            Ikuti 5 langkah mudah berikut untuk menyalurkan hak suara Anda secara rahasia, aman, dan 100% gratis menggunakan teknologi Blockchain.
          </p>
        </div>

        {/* Steps List */}
        <div className="space-y-6 mb-20">
          {steps.map((step, idx) => (
            <div 
              key={idx} 
              className="bg-white border border-slate-100 rounded-2xl p-8 shadow-sm hover:shadow-xl hover:shadow-indigo-500/5 hover:-translate-y-0.5 transition-all duration-300 flex flex-col md:flex-row gap-6 items-start"
            >
              <div className="flex items-center gap-4 md:flex-col md:items-center shrink-0">
                <span className="text-5xl font-black font-mono text-slate-100 select-none">
                  {step.num}
                </span>
                <div className="bg-[#F8FAFC] border border-slate-150 p-3.5 rounded-xl shadow-inner">
                  {step.icon}
                </div>
              </div>
              
              <div className="space-y-2 pt-1.5">
                <h3 className="text-lg font-bold text-[#080627] uppercase tracking-wide font-poppins">
                  {step.title}
                </h3>
                <p className="text-slate-500 text-xs md:text-sm leading-relaxed font-medium">
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Info Banner */}
        <div className="bg-slate-900 text-white p-8 rounded-2xl border border-slate-800 shadow-xl shadow-slate-900/5 flex flex-col md:flex-row items-center gap-6 mb-20">
          <FaShieldAlt className="text-5xl text-indigo-400 shrink-0" />
          <div className="space-y-1">
            <h4 className="font-extrabold text-sm md:text-base uppercase tracking-wider font-poppins">Jaminan Kerahasiaan Pemilih</h4>
            <p className="text-xs text-slate-300 leading-relaxed font-medium">
              Voteria menjamin bahwa data pemilihan Anda tidak disimpan dalam database server kami dan tidak terikat dengan identitas NIM Anda. Sistem kami murni bertindak sebagai jembatan pengiriman enkripsi menuju blockchain. Pilihan Anda tetap menjadi rahasia Anda sendiri.
            </p>
          </div>
        </div>

        {/* FAQ Section */}
        <section className="bg-white border border-slate-100 rounded-2xl p-8 shadow-sm">
          <h2 className="text-2xl font-black font-poppins text-[#080627] uppercase tracking-wide mb-8 border-b border-slate-100 pb-4 flex items-center gap-2">
            <FaQuestionCircle className="text-indigo-500" /> Pertanyaan yang Sering Diajukan
          </h2>
          
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div 
                key={index} 
                className="border border-slate-200 bg-[#F8FAFC] rounded-xl overflow-hidden shadow-2xs hover:shadow-xs transition-all duration-300"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full flex justify-between items-center p-5 text-left font-bold text-[#080627] uppercase tracking-wide text-xs md:text-sm focus:outline-none cursor-pointer hover:bg-slate-100/50 transition-colors"
                >
                  <span className="flex items-center gap-3">
                    <FaCheckCircle className="text-indigo-500 shrink-0 text-sm" />
                    {faq.q}
                  </span>
                  {openFaq === index ? <FaChevronUp className="shrink-0 text-slate-400" /> : <FaChevronDown className="shrink-0 text-slate-400" />}
                </button>
                
                {openFaq === index && (
                  <div className="p-5 bg-white border-t border-slate-100 text-slate-600 text-xs md:text-sm leading-relaxed font-sans font-medium">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
