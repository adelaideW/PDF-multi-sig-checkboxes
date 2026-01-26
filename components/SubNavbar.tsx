
import React from 'react';

interface SubNavbarProps {
  title: string;
}

const SubNavbar: React.FC<SubNavbarProps> = ({ title }) => {
  return (
    <div className="h-14 bg-white border-b flex items-center justify-between px-6 shrink-0 shadow-sm z-40">
      <h1 className="text-lg font-bold text-gray-800">{title}</h1>
      <button className="bg-[#42003c] hover:bg-[#5d2d58] text-white px-4 py-1.5 rounded-md text-sm font-medium transition-colors">
        Save and exit
      </button>
    </div>
  );
};

export default SubNavbar;
