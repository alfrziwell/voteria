import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-[#080627] text-gray-400 py-8 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <div className="text-white font-bold text-lg flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-[#734CA8] inline-block"></span>
            VOTERIA
          </div>
          <p className="text-sm mt-1">Sistem E-Voting Berbasis Zero-Knowledge Proof & Blockchain.</p>
        </div>
        <div className="text-sm">
          &copy; {new Date().getFullYear()} VOTERIA. Hak Cipta Dilindungi Undang-Undang.
        </div>
      </div>
    </footer>
  );
}
