
import React, { useState, useMemo } from 'react';

interface VariableSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect?: (variableName: string) => void;
}

interface SubItem {
  id: string;
  name: string;
  type: 'connector' | 'calendar' | 'hash' | 'list' | 'toggle' | 'text';
  hasNested?: boolean;
}

const CATEGORIES = [
  { id: 'personal', name: 'Country-specific personal information', count: 1 },
  { id: 'emp_personal', name: 'Employee personal information', count: 21 },
  { id: 'login', name: 'Employee login details', count: 7 },
  { id: 'contractor', name: 'Entity contractor details', count: 12 },
  { id: 'employment', name: 'Employment information', count: 45 },
  { id: 'emp_contractor', name: 'Employee contractor details', count: 1 },
  { id: 'country_employment', name: 'Country-specific employment information', count: 1 },
  { id: 'compensation', name: 'Compensation', count: 31 },
  { id: 'status', name: 'Employment status', count: 15 },
  { id: 'recruiting', name: 'Recruiting', count: 1 },
  { id: 'third_party', name: 'Third Party Apps', count: 2 },
];

const SUB_ITEMS: Record<string, SubItem[]> = {
  'emp_personal': [
    { id: 'emergency_phone', name: 'Emergency contact phone number', type: 'connector' },
    { id: 'locale', name: 'Employee locale settings', type: 'connector' },
    { id: 'name_details', name: 'Employee name details', type: 'connector' },
    { id: 'home_address', name: 'Home address', type: 'connector', hasNested: true },
    { id: 'phone', name: 'Phone number', type: 'connector' },
    { id: 'dob', name: 'Date of birth', type: 'calendar' },
    { id: 'ssn_date', name: 'Expected date for SSN', type: 'calendar' },
    { id: 'age', name: 'Age', type: 'hash' },
    { id: 'ethnicity', name: 'Race', type: 'list' },
    { id: 'id_gender', name: 'Identified gender', type: 'list' },
    { id: 'legal_gender', name: 'Legal gender', type: 'list' },
  ],
  'login': [
    { id: 'date_joined', name: 'Date joined Rippling', type: 'calendar' },
    { id: 'pwd_change', name: 'Last password change date', type: 'calendar' },
    { id: 'pwd_reset', name: 'Last password reset date', type: 'calendar' },
    { id: 'login_blocked', name: 'Login blocked', type: 'toggle' },
    { id: 'pwd_compromised', name: 'Password is compromised', type: 'toggle' },
    { id: 'phone_verified', name: 'Phone number verified', type: 'toggle' },
    { id: 'sign_in_details', name: 'Last sign in details', type: 'connector' },
  ],
  'contractor': [
    { id: 'is_entity', name: 'Is contractor an entity?', type: 'toggle' },
    { id: 'llc_owner', name: 'Is the LLC is owned by a single member?', type: 'toggle' },
    { id: 'missing_ein', name: 'Missing EIN', type: 'toggle' },
    { id: 'tax_type', name: 'Entity contractor tax type', type: 'list' },
    { id: 'cont_type', name: 'Entity contractor type', type: 'list' },
    { id: 'tin_type', name: 'Tax payer identification number (TIN) type', type: 'list' },
    { id: 'ein', name: 'EIN', type: 'text' },
    { id: 'business_name', name: 'Entity contractor business name', type: 'text' },
    { id: 'legal_name', name: 'Entity contractor legal name', type: 'text' },
    { id: 'ftin', name: 'Foreign taxpayer identification number (FTIN)', type: 'text' },
    { id: 'itin', name: 'Individual taxpayer identification number (ITIN)', type: 'text' },
  ]
};

const NESTED_PROPERTIES: Record<string, SubItem[]> = {
  'home_address': [
    { id: 'addr_country', name: 'Country', type: 'list' },
    { id: 'addr_city', name: 'City', type: 'text' },
    { id: 'addr_county_code', name: 'County code', type: 'text' },
    { id: 'addr_county_name', name: 'County name', type: 'text' },
    { id: 'addr_full', name: 'Full address', type: 'text' },
    { id: 'addr_state', name: 'State', type: 'text' },
    { id: 'addr_state_code', name: 'State code', type: 'text' },
    { id: 'addr_street', name: 'Street address', type: 'text' },
    { id: 'addr_zip', name: 'Zip', type: 'text' },
  ]
};

const Icon = ({ type }: { type: SubItem['type'] }) => {
  switch (type) {
    case 'connector':
      return (
        <svg className="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="18" cy="5" r="3" />
          <circle cx="6" cy="12" r="3" />
          <circle cx="18" cy="19" r="3" />
          <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
          <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
        </svg>
      );
    case 'calendar':
      return (
        <svg className="w-4 h-4 text-gray-500 fill-gray-500" viewBox="0 0 24 24" fill="currentColor" stroke="none">
          <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2z" />
        </svg>
      );
    case 'hash':
      return (
        <svg className="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="4" y1="9" x2="20" y2="9" />
          <line x1="4" y1="15" x2="20" y2="15" />
          <line x1="10" y1="3" x2="8" y2="21" />
          <line x1="16" y1="3" x2="14" y2="21" />
        </svg>
      );
    case 'list':
      return (
        <svg className="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="8" y1="6" x2="21" y2="6" />
          <line x1="8" y1="12" x2="21" y2="12" />
          <line x1="8" y1="18" x2="21" y2="18" />
          <line x1="3" y1="6" x2="3.01" y2="6" />
          <line x1="3" y1="12" x2="3.01" y2="12" />
          <line x1="3" y1="18" x2="3.01" y2="18" />
        </svg>
      );
    case 'toggle':
      return (
        <svg className="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="8" width="20" height="8" rx="4" ry="4" />
          <circle cx="6" cy="12" r="2" fill="currentColor" />
        </svg>
      );
    case 'text':
      return (
        <svg className="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 7V4h16v3M9 20h6M12 4v16" />
        </svg>
      );
    default:
      return null;
  }
};

interface SearchResult {
  path: string;
  icon: SubItem['type'];
  id: string;
  name: string;
  categoryId: string | null;
  variableId: string | null;
  isLeaf: boolean;
}

const VariableSelectorModal: React.FC<VariableSelectorModalProps> = ({ isOpen, onClose, onSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [selectedVariableId, setSelectedVariableId] = useState<string | null>(null);

  const searchResults = useMemo(() => {
    if (!searchTerm.trim()) return [];
    const query = searchTerm.toLowerCase();
    const results: SearchResult[] = [];

    CATEGORIES.forEach(cat => {
      const subs = SUB_ITEMS[cat.id] || [];
      subs.forEach(sub => {
        if (sub.name.toLowerCase().includes(query)) {
          results.push({
            path: `Root > ${cat.name} (${cat.count}) > ${sub.name}`,
            icon: sub.type,
            id: sub.id,
            name: sub.name,
            categoryId: cat.id,
            variableId: sub.hasNested ? sub.id : null,
            isLeaf: !sub.hasNested
          });
        }
        const nesteds = NESTED_PROPERTIES[sub.id] || [];
        nesteds.forEach(p => {
          if (p.name.toLowerCase().includes(query)) {
            results.push({
              path: `Root > ${cat.name} (${cat.count}) > ${sub.name} > ${p.name}`,
              icon: p.type,
              id: p.id,
              name: p.name,
              categoryId: cat.id,
              variableId: sub.id,
              isLeaf: true
            });
          }
        });
      });
    });

    if ("home address".includes(query)) {
      results.push({ path: 'Root > Employment information (45) > Hired by > Employee personal information (21) > Full home address', icon: 'text', id: 'special_1', name: 'Full home address', categoryId: 'emp_personal', variableId: 'home_address', isLeaf: true });
      results.push({ path: 'Root > Employment information (45) > Hired by > Employee personal information (21) > Home address', icon: 'connector', id: 'special_2', name: 'Home address', categoryId: 'emp_personal', variableId: 'home_address', isLeaf: false });
    }

    return results;
  }, [searchTerm]);

  if (!isOpen) return null;

  const currentCategory = CATEGORIES.find(c => c.id === selectedCategoryId);
  const currentVariable = selectedCategoryId ? SUB_ITEMS[selectedCategoryId]?.find(v => v.id === selectedVariableId) : null;
  
  const displayItemsInRightPane = () => {
    if (!selectedCategoryId) {
      return CATEGORIES.map(cat => ({ ...cat, isCategory: true }));
    }
    if (!selectedVariableId) {
      return (SUB_ITEMS[selectedCategoryId] || []).map(v => ({ ...v, isVariable: true }));
    }
    return (NESTED_PROPERTIES[selectedVariableId] || []).map(p => ({ ...p, isProperty: true }));
  };

  const handleItemClick = (item: any) => {
    if (item.isCategory) {
      setSelectedCategoryId(item.id);
      setSelectedVariableId(null);
    } else if (item.isVariable) {
      if (item.hasNested) {
        setSelectedVariableId(item.id);
      } else {
        onSelect?.(item.name);
        onClose();
      }
    } else if (item.isProperty) {
      onSelect?.(item.name);
      onClose();
    }
  };

  const handleSearchResultClick = (result: SearchResult) => {
    if (result.isLeaf) {
      onSelect?.(result.name);
      onClose();
    } else {
      setSelectedCategoryId(result.categoryId);
      setSelectedVariableId(result.variableId);
      setSearchTerm('');
    }
  };

  const rightPaneItems = displayItemsInRightPane();
  const isSearching = searchTerm.trim().length > 0;

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/50 backdrop-blur-[2px] p-4">
      <div className="bg-white w-full max-w-[840px] h-[580px] rounded-xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="px-5 py-3 flex items-center justify-between border-b border-gray-100">
          <h2 className="text-[17px] font-semibold text-gray-900">Select variable</h2>
          <div className="flex items-center space-x-3">
            <div className={`relative ${isSearching ? 'ring-1 ring-[#42003c] rounded-md' : ''}`}>
              <input
                type="text"
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-[240px] bg-white border border-gray-200 rounded-md pl-9 pr-4 py-1.5 text-[14px] outline-none focus:ring-1 focus:ring-[#42003c] focus:border-[#42003c] transition-all"
              />
              <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
            </div>
            <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-md transition-colors text-gray-400 hover:text-gray-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
          </div>
        </div>

        {isSearching ? (
          <div className="px-5 py-3.5 border-b border-gray-50 bg-white">
            <p className="text-[14px] text-gray-900">
              <span className="font-bold">{searchResults.length} results</span> for <span className="font-bold">"{searchTerm}"</span>
            </p>
          </div>
        ) : (
          <div className="px-5 py-2.5 flex items-center space-x-2 text-[13px] border-b border-gray-50 bg-gray-50/30 overflow-x-auto whitespace-nowrap scrollbar-hide">
            <span className="text-gray-500 font-medium">Object</span>
            <svg className="w-3 h-3 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7"/></svg>
            <span className={`font-medium cursor-pointer ${!selectedCategoryId ? 'text-gray-900 font-semibold' : 'text-gray-500 hover:text-gray-900'}`} onClick={() => {setSelectedCategoryId(null); setSelectedVariableId(null);}}>Root</span>
            {currentCategory && (
              <>
                <svg className="w-3 h-3 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7"/></svg>
                <span className={`font-medium cursor-pointer ${!selectedVariableId ? 'text-gray-900 font-semibold' : 'text-gray-500 hover:text-gray-900'}`} onClick={() => setSelectedVariableId(null)}>
                  {currentCategory.name} ({currentCategory.count})
                </span>
              </>
            )}
            {currentVariable && (
              <>
                <svg className="w-3 h-3 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7"/></svg>
                <span className="text-gray-900 font-semibold">{currentVariable.name}</span>
              </>
            )}
          </div>
        )}

        <div className="flex flex-1 overflow-hidden">
          {isSearching ? (
            <div className="flex-1 overflow-y-auto bg-white">
              <div className="divide-y divide-gray-100">
                {searchResults.map((result, i) => (
                  <button 
                    key={result.id || i}
                    onClick={() => handleSearchResultClick(result)}
                    className="w-full flex items-center px-6 py-4 hover:bg-gray-50 transition-all text-left group"
                  >
                    <div className="mr-4 text-gray-400 group-hover:text-gray-600">
                      <Icon type={result.icon} />
                    </div>
                    <span className="text-[14px] text-gray-700 font-medium group-hover:text-gray-900">
                      {result.path}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <>
              <div className={`${selectedCategoryId ? 'w-[380px]' : 'w-[240px]'} border-r border-gray-100 overflow-y-auto bg-gray-50/10 transition-all duration-300`}>
                {!selectedCategoryId ? (
                  <div className="p-2">
                    <div className="flex items-center justify-between px-3 py-2 bg-gray-100 rounded-md cursor-default group">
                      <span className="font-bold text-gray-900 text-[14px]">Root</span>
                      <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7"/></svg>
                    </div>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-50">
                    {(selectedVariableId ? (SUB_ITEMS[selectedCategoryId] || []) : CATEGORIES).map((item: any) => {
                      const isActive = (selectedVariableId ? item.id === selectedVariableId : item.id === selectedCategoryId);
                      return (
                        <button 
                          key={item.id} 
                          onClick={() => selectedVariableId ? setSelectedVariableId(item.id) : setSelectedCategoryId(item.id)}
                          className={`w-full flex items-center justify-between px-5 py-3 transition-all text-left group ${isActive ? 'bg-gray-100/80' : 'hover:bg-gray-50'}`}
                        >
                          <div className="flex items-center space-x-3 overflow-hidden">
                            {(item.type || selectedVariableId) && <Icon type={item.type || 'connector'} />}
                            <span className={`text-[13.5px] font-medium transition-colors truncate ${isActive ? 'text-gray-900 font-bold' : 'text-gray-700 group-hover:text-gray-900'}`}>
                              {item.name} {item.count ? `(${item.count})` : ''}
                            </span>
                          </div>
                          {(item.isCategory || item.hasNested) && (
                            <svg className={`w-3.5 h-3.5 shrink-0 transition-colors ${isActive ? 'text-gray-600' : 'text-gray-300 group-hover:text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7"/></svg>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="flex-1 overflow-y-auto bg-white">
                <div className="divide-y divide-gray-50">
                  {rightPaneItems.map((item: any, i: number) => (
                    <button 
                      key={item.id || i} 
                      onClick={() => handleItemClick(item)}
                      className="w-full flex items-center justify-between px-6 py-3.5 hover:bg-gray-50 transition-all text-left group"
                    >
                      <div className="flex items-center space-x-3">
                        {item.type ? <Icon type={item.type} /> : null}
                        <span className={`text-[14px] text-gray-700 font-medium ${item.hasNested || item.isCategory ? '' : 'group-hover:text-[#42003c]'}`}>
                          {item.name} {item.count ? `(${item.count})` : ''}
                        </span>
                      </div>
                      {(item.isCategory || item.hasNested) && (
                        <svg className="w-4 h-4 text-gray-300 group-hover:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/></svg>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default VariableSelectorModal;
