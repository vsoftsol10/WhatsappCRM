import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiAlertTriangle, FiArrowLeft } from 'react-icons/fi';

const AccessDenied = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#0B141A] text-slate-100 p-6 font-sans relative overflow-hidden">
      {/* Decorative Glow Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-red-900/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-orange-950/10 blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md bg-[#111C24]/60 backdrop-blur-xl border border-red-950/30 rounded-2xl p-8 shadow-2xl relative z-10 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-950/50 border border-red-500/30 text-red-500 font-bold text-3xl shadow-lg mb-4">
          <FiAlertTriangle className="w-8 h-8" />
        </div>
        
        <h2 className="text-2xl font-semibold text-white tracking-tight">Access Denied</h2>
        <p className="text-sm text-red-400 mt-2">403 - Forbidden Area</p>
        <p className="text-slate-400 mt-4 text-sm leading-relaxed">
          You do not have permission to access this page. This section of the WhatsApp CRM is restricted to administrators only.
        </p>

        <button
          onClick={() => navigate('/dashboard')}
          className="w-full mt-6 py-2.5 bg-[#202C33] hover:bg-[#2A3942] active:scale-[0.98] text-white border border-[#2A3942] hover:border-slate-500 font-semibold rounded-lg shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 text-sm"
        >
          <FiArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default AccessDenied;
