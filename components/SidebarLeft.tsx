
import React from 'react';
import { DraggableField, Signer } from '../types';

const FIELDS: DraggableField[] = [
  { id: 'textbox', type: 'textbox', label: 'Textbox', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M4 6h16M4 12h16m-7 6h7"/></svg> },
  { id: 'checkbox', type: 'checkbox', label: 'Checkbox', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg> },
  { id: 'signature', type: 'signature', label: 'Signature', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg> },
  { id: 'initials', type: 'initials', label: 'Initials', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg> },
  { id: 'name', type: 'name', label: 'Name', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg> },
  { id: 'title', type: 'title', label: 'Title', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg> },
  { id: 'company', type: 'company', label: 'Company', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg> },
  { id: 'datesigned', type: 'datesigned', label: 'Date signed', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg> },
];

interface SidebarLeftProps {
  activeSigner: Signer;
  signers: Signer[];
  onSignerChange: (id: string) => void;
}

const SidebarLeft: React.FC<SidebarLeftProps> = ({ activeSigner, signers, onSignerChange }) => {
  const handleDragStart = (e: React.DragEvent, field: DraggableField) => {
    e.dataTransfer.setData('fieldType', field.type);
    e.dataTransfer.setData('fieldLabel', field.label);
  };

  return (
    <aside className="w-[260px] bg-white border-r flex flex-col shrink-0 overflow-hidden">
      <div className="p-4 border-b">
        <button className="w-full text-center py-2.5 px-4 border border-gray-200 rounded-md text-[13px] font-semibold text-gray-800 hover:bg-gray-50 transition-colors shadow-sm">
          Import fillable fields
        </button>
      </div>

      <div className="p-4 border-b">
        <div className="relative group">
          <select 
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            value={activeSigner.id}
            onChange={(e) => onSignerChange(e.target.value)}
          >
            {signers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
          <div className="flex items-center justify-between p-2.5 border border-gray-100 rounded-md bg-white hover:bg-gray-50 transition-colors">
            <div className="flex items-center space-x-3">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${activeSigner.color}`}>
                {activeSigner.initials}
              </div>
              <span className="text-sm font-medium text-gray-800">{activeSigner.name}</span>
            </div>
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/></svg>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        <div className="space-y-1">
          {FIELDS.map((field) => (
            <div 
              key={field.id}
              draggable
              onDragStart={(e) => handleDragStart(e, field)}
              className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 cursor-grab active:cursor-grabbing border border-transparent hover:border-gray-100 transition-all group"
            >
              <div className="flex items-center space-x-3.5 text-gray-600">
                <span className="text-gray-400 group-hover:text-gray-600 transition-colors">
                  {field.icon}
                </span>
                <span className="text-sm font-medium text-gray-700">{field.label}</span>
              </div>
              <div className="text-gray-300 group-hover:text-gray-400 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M4 8h16M4 16h16"/></svg>
              </div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default SidebarLeft;
