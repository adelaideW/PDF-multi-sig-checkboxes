
import React from 'react';

const TopNavbar: React.FC = () => {
  return (
    <nav className="h-12 bg-[#3d002f] flex items-center justify-between px-4 text-white shrink-0 z-[60] shadow-md">
      <div className="flex items-center space-x-6">
        <div className="flex items-center space-x-2.5 cursor-pointer group">
           <div className="w-6 h-6 bg-white rounded-md flex items-center justify-center group-hover:bg-gray-100 transition-colors shadow-sm">
             <div className="w-3 h-3 bg-[#3d002f] rounded-[2px]"></div>
           </div>
           <span className="font-bold text-[14px] tracking-tight">Tools</span>
           <svg className="w-3 h-3 text-gray-400 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7"/></svg>
        </div>
      </div>

      <div className="flex-1 max-w-xl px-4">
        <div className="relative group">
          <input 
            type="text" 
            placeholder="Search or jump to..." 
            className="w-full bg-[#521844] border border-transparent rounded-lg py-1.5 px-10 text-[13px] focus:bg-[#5f204d] focus:ring-1 focus:ring-[#7A005D]/35 focus:border-[#7A005D]/40 outline-none placeholder-gray-400 transition-all"
          />
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <svg className="h-3.5 w-3.5 text-gray-400 group-focus-within:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <button className="text-gray-400 hover:text-white transition-colors p-1">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
        </button>
        <button className="text-gray-400 hover:text-white transition-colors p-1">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
        </button>
        <div className="relative">
          <button className="text-gray-400 hover:text-white transition-colors relative p-1">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>
            <span className="absolute top-0 right-0 inline-flex items-center justify-center w-4 h-4 text-[9px] font-bold leading-none text-white bg-red-500 rounded-full border border-[#3d002f]">5</span>
          </button>
        </div>
        <div className="flex items-center space-x-2.5 bg-[#521844] hover:bg-[#5f204d] px-2.5 py-1.5 rounded-lg cursor-pointer transition-all border border-transparent hover:border-white/10">
          <span className="text-xs font-semibold text-gray-100 hidden sm:block">Microserv Global Pte</span>
          <img src="https://picsum.photos/seed/user/32/32" className="w-6 h-6 rounded-full border border-white/20" alt="avatar" />
        </div>
      </div>
    </nav>
  );
};

export default TopNavbar;
