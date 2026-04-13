
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="h-14 bg-white border-t border-gray-100 flex items-center justify-between px-6 shrink-0 z-50 shadow-[0_-2px_10px_rgba(0,0,0,0.03)]">
      <button className="flex items-center space-x-2 text-[14px] font-semibold text-gray-500 hover:text-gray-900 transition-colors">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7"/></svg>
        <span>Back</span>
      </button>
      
      <button className="bg-[#42003c] hover:bg-[#5d2d58] text-white px-10 py-2.5 rounded-lg text-[14px] font-bold shadow-md transition-all active:scale-[0.98] active:shadow-inner">
        Send
      </button>
    </footer>
  );
};

export default Footer;
