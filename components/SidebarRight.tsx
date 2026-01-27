
import React, { useState, useRef, useEffect } from 'react';
import { PlacedField, Signer } from '../types';

interface SidebarRightProps {
  selectedFields: PlacedField[];
  onDelete: () => void;
  onUpdate: (id: string, updates: Partial<PlacedField>) => void;
  onUpdateMultiple: (updates: Partial<PlacedField>) => void;
  onGroupFields: () => void;
  signers: Signer[];
}

const SidebarRight: React.FC<SidebarRightProps> = ({ 
  selectedFields, 
  onDelete, 
  onUpdate, 
  onUpdateMultiple, 
  onGroupFields,
  signers 
}) => {
  const [openSections, setOpenSections] = useState({
    recipient: true,
    required: true,
    value: true,
    validation: true,
    location: true
  });

  const [validationType, setValidationType] = useState('Select at least');
  const [isValidationDropdownOpen, setIsValidationDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const validationOptions = [
    'Select at least',
    'Select at most',
    'Select exactly',
    'Select a range'
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsValidationDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (selectedFields.length === 0) {
    return (
      <aside className="w-[320px] bg-white border-l flex flex-col shrink-0 items-center justify-center relative">
        <div className="flex flex-col items-center text-center px-6">
          <div className="mb-6 text-[#d1d5db]">
            <svg className="w-24 h-24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="16" x2="12" y2="12" />
              <line x1="12" y1="8" x2="12.01" y2="8" />
            </svg>
          </div>
          <p className="text-[#9ca3af] text-[18px] font-medium tracking-tight">No fields selected</p>
        </div>
      </aside>
    );
  }

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const firstField = selectedFields[0];
  const allSameType = selectedFields.every(f => f.type === firstField.type);
  const allSameRecipient = selectedFields.every(f => f.recipientId === firstField.recipientId);
  const allSameRequired = selectedFields.every(f => f.required === firstField.required);
  
  const isCheckboxSelection = selectedFields.length > 0 && allSameType && firstField.type === 'checkbox';
  const allInSameGroup = isCheckboxSelection && selectedFields.every(f => !!f.groupId && f.groupId === firstField.groupId);
  const canBeGrouped = isCheckboxSelection && selectedFields.length > 1 && !allInSameGroup;

  const selectedSigner = signers.find(s => s.id === (allSameRecipient ? firstField.recipientId : '')) || null;
  const checkboxFields = selectedFields.filter(f => f.type === 'checkbox');

  // Input styling shared across sections - very compact
  const inputBaseClasses = "w-full bg-white border border-gray-200 rounded-lg px-2.5 py-1.5 text-[13px] outline-none hover:border-gray-300 focus:border-blue-500 transition-all";
  const labelClasses = "text-[14px] font-bold text-gray-800";

  return (
    <aside className="w-[320px] bg-white border-l flex flex-col shrink-0 overflow-y-auto shadow-sm">
      {/* Header */}
      <div className="px-4 py-3 flex items-center justify-between border-b bg-white sticky top-0 z-50">
        <div className="flex items-center space-x-2">
          <span className="font-bold text-gray-800 text-[15px]">{selectedFields.length} selected</span>
        </div>
        <div className="flex items-center space-x-2">
          {canBeGrouped && (
            <button 
              onClick={onGroupFields}
              className="px-2.5 py-1 border border-[#42003c] text-[#42003c] rounded text-[12px] font-bold hover:bg-[#42003c] hover:text-white transition-all mr-2"
            >
              Group
            </button>
          )}
          <button className="text-gray-400 hover:text-black p-1">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2"/></svg>
          </button>
          <button onClick={onDelete} className="text-red-400 hover:text-red-600 p-1">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
          </button>
        </div>
      </div>

      <div className="p-4 space-y-5">
        {/* Recipient Section */}
        <section>
          <button onClick={() => toggleSection('recipient')} className="w-full flex items-center justify-between mb-3">
            <span className={labelClasses}>Recipient</span>
            <svg className={`w-3 h-3 transition-transform ${openSections.recipient ? '' : '-rotate-180'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7"/></svg>
          </button>
          
          {openSections.recipient && (
            <div className="relative group flex items-center bg-white border border-gray-200 rounded-xl p-2 shadow-sm hover:border-gray-300 cursor-pointer">
              <div className="relative mr-3 shrink-0">
                <img 
                  src={`https://picsum.photos/seed/${selectedSigner?.id || 'mixed'}/64/64`} 
                  className="w-8 h-8 rounded-full object-cover grayscale"
                  alt="signer"
                />
                <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border border-white bg-yellow-400"></div>
              </div>
              <div className="flex-1 overflow-hidden">
                <span className="text-[13px] font-medium text-gray-900 truncate block">
                  {selectedSigner ? selectedSigner.name : 'Mixed Recipients'}
                </span>
              </div>
              <svg className="w-3.5 h-3.5 text-gray-400 ml-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/></svg>
              <select 
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                value={allSameRecipient ? firstField.recipientId : ''}
                onChange={(e) => onUpdateMultiple({ recipientId: e.target.value })}
              >
                {!allSameRecipient && <option value="" disabled>Mixed Recipients</option>}
                {signers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
          )}
        </section>

        {/* Required Toggle */}
        <section className="flex items-center space-x-2 pt-0.5">
          <input 
            type="checkbox" 
            id="required-toggle"
            checked={allSameRequired ? firstField.required : false} 
            ref={el => { if (el) el.indeterminate = !allSameRequired; }}
            onChange={(e) => onUpdateMultiple({ required: e.target.checked })}
            className="w-4 h-4 rounded border-gray-300 text-purple-700 focus:ring-purple-500 cursor-pointer"
          />
          <label htmlFor="required-toggle" className="text-[14px] font-bold text-gray-800 cursor-pointer">Required</label>
        </section>

        {/* Checkbox settings - Show if grouped or multiple checkboxes are selected */}
        {isCheckboxSelection && (allInSameGroup || selectedFields.length > 1) && (
          <>
            <section className="pt-0.5">
              <button onClick={() => toggleSection('value')} className="w-full flex items-center justify-between mb-3">
                <span className={labelClasses}>Checkbox value</span>
                <svg className={`w-3 h-3 transition-transform ${openSections.value ? '' : '-rotate-180'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7"/></svg>
              </button>
              {openSections.value && (
                <div className="space-y-2">
                  {checkboxFields.map((field, idx) => (
                    <div key={field.id} className="flex items-center space-x-2">
                      <input type="checkbox" className="w-4 h-4 rounded border-gray-200" />
                      <input 
                        type="text" 
                        placeholder="Placeholder text" 
                        className={inputBaseClasses}
                      />
                    </div>
                  ))}
                </div>
              )}
            </section>

            <section className="pt-0.5">
              <button onClick={() => toggleSection('validation')} className="w-full flex items-center justify-between mb-3">
                <span className={labelClasses}>Validation</span>
                <svg className={`w-3 h-3 transition-transform ${openSections.validation ? '' : '-rotate-180'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7"/></svg>
              </button>
              {openSections.validation && (
                <div className="space-y-2">
                  <div className="relative" ref={dropdownRef}>
                    <button 
                      onClick={() => setIsValidationDropdownOpen(!isValidationDropdownOpen)}
                      className={`${inputBaseClasses} flex items-center justify-between text-left`}
                    >
                      <span className="text-gray-900">{validationType}</span>
                      <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/></svg>
                    </button>
                    {isValidationDropdownOpen && (
                      <div className="absolute top-full left-0 mt-1 w-full bg-white border border-gray-100 rounded-lg shadow-xl z-[100] py-1 overflow-hidden">
                        {validationOptions.map((option) => (
                          <div key={option} className="px-3 py-1.5 hover:bg-gray-50 cursor-pointer text-[12px]" onClick={() => { setValidationType(option); setIsValidationDropdownOpen(false); }}>
                            {option}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="relative">
                    <select className={`${inputBaseClasses} appearance-none pr-10`}>
                      <option>0</option>
                    </select>
                    <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-gray-400">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/></svg>
                    </div>
                  </div>
                </div>
              )}
            </section>
          </>
        )}

        {/* Location Section */}
        <section className="pt-0.5">
          <button onClick={() => toggleSection('location')} className="w-full flex items-center justify-between mb-3">
            <span className={labelClasses}>Location</span>
            <svg className={`w-3 h-3 transition-transform ${openSections.location ? '' : '-rotate-180'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7"/></svg>
          </button>
          
          {openSections.location && (
            <div className="space-y-2">
              <div className="flex items-center justify-between bg-white border border-gray-200 rounded-lg px-2.5 py-2 shadow-sm">
                <span className="text-[13px] text-gray-400">Page number</span>
                <span className="text-[13px] font-bold text-gray-900">1</span>
              </div>
              
              <div className="relative group">
                <input 
                  type="text" 
                  value={selectedFields.length === 1 ? `${Math.round(firstField.x)} px` : '-- px'} 
                  readOnly={selectedFields.length > 1}
                  className={`${inputBaseClasses} font-medium pr-24 py-1.5`}
                />
                <span className="absolute inset-y-0 right-2.5 flex items-center text-gray-400 pointer-events-none text-[11px]">px from left</span>
              </div>

              <div className="relative group">
                <input 
                  type="text" 
                  value={selectedFields.length === 1 ? `${Math.round(800 - firstField.x - firstField.width)} px` : '-- px'} 
                  readOnly={selectedFields.length > 1}
                  className={`${inputBaseClasses} font-medium pr-24 py-1.5`}
                />
                <span className="absolute inset-y-0 right-2.5 flex items-center text-gray-400 pointer-events-none text-[11px]">px from right</span>
              </div>

              <div className="relative group">
                <input 
                  type="text" 
                  value={selectedFields.length === 1 ? `${Math.round(firstField.width)} px` : '-- px'} 
                  readOnly={selectedFields.length > 1}
                  className={`${inputBaseClasses} font-medium pr-24 py-1.5`}
                />
                <span className="absolute inset-y-0 right-2.5 flex items-center text-gray-400 pointer-events-none text-[11px]">px wide</span>
              </div>

              <div className="relative group">
                <input 
                  type="text" 
                  value={selectedFields.length === 1 ? `${Math.round(firstField.height)} px` : '-- px'} 
                  readOnly={selectedFields.length > 1}
                  className={`${inputBaseClasses} font-medium pr-24 py-1.5`}
                />
                <span className="absolute inset-y-0 right-2.5 flex items-center text-gray-400 pointer-events-none text-[11px]">px tall</span>
              </div>
            </div>
          )}
        </section>
      </div>
    </aside>
  );
};

export default SidebarRight;
