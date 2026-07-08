import React from 'react';
import { FaUser, FaBullhorn, FaFlag, FaCheckCircle } from 'react-icons/fa';

export default function CandidateCard({ candidate, onVoteClick, disabled, showResults, totalVotes }) {
  const voteCount = candidate.votes || 0;
  const percentage = totalVotes > 0 ? ((voteCount / totalVotes) * 100).toFixed(1) : '0.0';

  return (
    <div className="bg-white border border-slate-100 rounded-3xl p-6 flex flex-col justify-between shadow-sm hover:shadow-xl hover:shadow-indigo-500/5 hover:-translate-y-1 transition-all duration-300 relative overflow-hidden">
      <div>
        <div className="flex justify-between items-center mb-6">
          <div className="bg-indigo-600 text-white text-base font-extrabold w-10 h-10 flex items-center justify-center rounded-xl font-poppins shadow-md shadow-indigo-600/20">
            {candidate.candidate_number || candidate.id}
          </div>
          <span className="text-[10px] uppercase bg-indigo-50 border border-indigo-100 text-indigo-700 px-3 py-1.5 rounded-full font-bold tracking-wider">
            Kandidat Resmi
          </span>
        </div>

        {candidate.photo_url ? (
          <img
            src={candidate.photo_url}
            alt={`${candidate.chairman_name} & ${candidate.vice_chairman_name}`}
            className="w-full h-52 object-cover mb-6 rounded-2xl shadow-inner border border-slate-100"
          />
        ) : (
          <div className="w-full h-52 bg-slate-50 flex items-center justify-center text-slate-450 mb-6 border border-dashed border-slate-200 rounded-2xl">
            <span className="text-xs uppercase font-extrabold tracking-widest text-slate-400">Foto Belum Diunggah</span>
          </div>
        )}

        <h3 className="text-lg font-bold text-[#080627] font-poppins mb-5 uppercase tracking-wide border-b border-slate-100 pb-2 flex items-center gap-2.5">
          <FaUser className="text-sm text-indigo-600" /> {candidate.chairman_name} & {candidate.vice_chairman_name}
        </h3>
        
        <div className="mb-4">
          <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
            <FaFlag className="text-xs text-indigo-500" /> Visi
          </h4>
          <p className="text-xs text-slate-500 leading-relaxed font-medium">
            {candidate.vision || "Mewujudkan organisasi yang transparan, inklusif, dan progresif bagi seluruh mahasiswa."}
          </p>
        </div>

        {candidate.mission && (
          <div className="mb-6">
            <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
              <FaBullhorn className="text-xs text-indigo-500" /> Misi
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed font-medium whitespace-pre-line text-justify">
              {candidate.mission}
            </p>
          </div>
        )}
      </div>

      {showResults && (
        <div className="mb-6 bg-slate-50 border border-slate-100 rounded-2xl p-4 space-y-2.5">
          <div className="flex justify-between items-center text-xs font-bold text-slate-500 uppercase tracking-wider">
            <span>Perolehan Suara</span>
            <span className="text-indigo-600 font-black">{percentage}% ({voteCount} Suara)</span>
          </div>
          <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
            <div 
              className="bg-indigo-600 h-full rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${percentage}%` }}
            ></div>
          </div>
        </div>
      )}

      <button
        onClick={() => onVoteClick(candidate)}
        disabled={disabled}
        className={`w-full py-3.5 text-center font-bold tracking-widest transition-all duration-200 uppercase text-xs flex items-center justify-center gap-2 rounded-xl cursor-pointer ${
          disabled
            ? 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
            : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/10 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 active:scale-95'
        }`}
      >
        {disabled ? (
          <>
            <FaCheckCircle className="text-xs text-slate-400" /> Sudah Memilih
          </>
        ) : (
          'Pilih Kandidat'
        )}
      </button>
    </div>
  );
}
