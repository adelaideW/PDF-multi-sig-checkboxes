
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="h-14 bg-white border-t flex items-center justify-between px-6 shrink-0 z-50 shadow-[0_-1px_3px_rgba(0,0,0,0.05)]">
      <button className="flex items-center space-x-2 text-sm font-semibold text-gray-700 hover:text-black">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/></svg>
        <span>Back</span>
      </button>
      
      <button className="bg-[#42003c] hover:bg-[#5d2d58] text-white px-8 py-2 rounded-md text-sm font-bold shadow-sm transition-all active:scale-95">
        Send
      </button>
    </footer>
  );
};

export default Footer;
