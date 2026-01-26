
import React, { useState, useEffect } from 'react';
import TopNavbar from './components/TopNavbar';
import SubNavbar from './components/SubNavbar';
import SidebarLeft from './components/SidebarLeft';
import DocumentViewer from './components/DocumentViewer';
import SidebarRight from './components/SidebarRight';
import Footer from './components/Footer';
import { PlacedField, Signer } from './types';

const SIGNERS: Signer[] = [
  { id: '1', name: 'David Woods', initials: 'D', color: 'bg-blue-100 text-blue-800' },
  { id: '2', name: 'Brooklyn Simmons', initials: 'B', color: 'bg-orange-100 text-orange-800' }
];

const App: React.FC = () => {
  const [zoom, setZoom] = useState(100);
  const [placedFields, setPlacedFields] = useState<PlacedField[]>([]);
  const [selectedFieldIds, setSelectedFieldIds] = useState<string[]>([]);
  const [activeSignerId, setActiveSignerId] = useState<string>(SIGNERS[0].id);

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 10, 400));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 10, 50));

  const handleDrop = (e: React.DragEvent, fieldType: string, label: string) => {
    e.preventDefault();
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const x = (e.clientX - rect.left) / (zoom / 100);
    const y = (e.clientY - rect.top) / (zoom / 100);

    handleAddField({
      type: fieldType,
      label: label,
      x: x,
      y: y,
      width: fieldType === 'checkbox' ? 20 : 150,
      height: fieldType === 'checkbox' ? 20 : 40,
      page: 1,
      recipientId: activeSignerId,
      required: true
    });
  };

  const handleAddField = (fieldData: Omit<PlacedField, 'id'>) => {
    const newField: PlacedField = {
      ...fieldData,
      id: Math.random().toString(36).substr(2, 9),
    };
    setPlacedFields(prev => [...prev, newField]);
    setSelectedFieldIds([newField.id]);
  };

  const handleSelectField = (id: string | null, multi: boolean = false) => {
    if (id === null) {
      setSelectedFieldIds([]);
      return;
    }

    const fieldToSelect = placedFields.find(f => f.id === id);
    if (!fieldToSelect) return;

    if (!multi) {
      setSelectedFieldIds([id]);
      return;
    }

    setSelectedFieldIds(prev => {
      if (prev.includes(id)) {
        return prev.filter(p => p !== id);
      }
      return [...prev, id];
    });
  };

  const handleSelectMultipleFields = (ids: string[]) => {
    setSelectedFieldIds(ids);
  };

  const handleDeleteField = (ids: string[]) => {
    setPlacedFields(prev => prev.filter(f => !ids.includes(f.id)));
    setSelectedFieldIds(prev => prev.filter(id => !ids.includes(id)));
  };

  const updateFields = (ids: string[], updates: Partial<PlacedField>) => {
    setPlacedFields(prev => prev.map(f => ids.includes(f.id) ? { ...f, ...updates } : f));
  };

  // Keyboard shortcut for deleting selected fields
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (selectedFieldIds.length === 0) return;

      const target = e.target as HTMLElement;
      if (
        target.tagName === 'INPUT' || 
        target.tagName === 'TEXTAREA' || 
        target.isContentEditable ||
        target.closest('[role="combobox"]')
      ) {
        return;
      }

      if (e.key === 'Delete' || e.key === 'Backspace') {
        handleDeleteField(selectedFieldIds);
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [selectedFieldIds]);

  const selectedFields = placedFields.filter(f => selectedFieldIds.includes(f.id));
  const activeSigner = SIGNERS.find(s => s.id === activeSignerId)!;

  return (
    <div className="flex flex-col h-screen w-full overflow-hidden bg-gray-100">
      <TopNavbar />
      <SubNavbar title="Basic-Non-Disclosure-Agreement.pdf" />

      <div className="flex flex-1 overflow-hidden relative">
        <SidebarLeft 
          activeSigner={activeSigner} 
          signers={SIGNERS} 
          onSignerChange={setActiveSignerId} 
        />

        <div className="flex-1 flex flex-col bg-gray-200 overflow-hidden">
          <div className="flex items-center justify-between bg-white border-b px-4 py-2 text-sm text-gray-600">
            <div className="flex items-center space-x-4">
              <div className="flex items-center border rounded px-2 py-1 space-x-2">
                <span>{zoom}%</span>
                <button className="hover:text-black">▾</button>
              </div>
              <div className="flex items-center space-x-2 border-l pl-4">
                <button onClick={handleZoomOut} className="p-1 hover:bg-gray-100 rounded">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4"/></svg>
                </button>
                <button onClick={handleZoomIn} className="p-1 hover:bg-gray-100 rounded">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/></svg>
                </button>
              </div>
            </div>
          </div>

          <DocumentViewer 
            zoom={zoom} 
            placedFields={placedFields} 
            selectedFieldIds={selectedFieldIds}
            onDrop={handleDrop}
            onAddField={handleAddField}
            onSelectField={handleSelectField}
            onSelectMultipleFields={handleSelectMultipleFields}
            onUpdateField={(id, updates) => updateFields([id], updates)}
            onUpdateMultipleFields={updateFields}
          />
        </div>

        <SidebarRight 
          selectedFields={selectedFields} 
          onDelete={() => handleDeleteField(selectedFieldIds)}
          onUpdate={(id, updates) => updateFields([id], updates)}
          onUpdateMultiple={(updates) => updateFields(selectedFieldIds, updates)}
          signers={SIGNERS}
        />
      </div>

      <Footer />
    </div>
  );
};

export default App;
