
import React, { useState, useRef, useEffect } from 'react';
import { PlacedField } from '../types';

interface DocumentViewerProps {
  zoom: number;
  placedFields: PlacedField[];
  selectedFieldIds: string[];
  onDrop: (e: React.DragEvent, type: string, label: string) => void;
  onAddField: (field: Omit<PlacedField, 'id'>, sourceId?: string) => void;
  onSelectField: (id: string | null, multi?: boolean) => void;
  onSelectMultipleFields: (ids: string[]) => void;
  onUpdateField: (id: string, updates: Partial<PlacedField>) => void;
  onUpdateMultipleFields: (ids: string[], updates: Partial<PlacedField>) => void;
}

const DocumentViewer: React.FC<DocumentViewerProps> = ({ 
  zoom, 
  placedFields, 
  selectedFieldIds, 
  onDrop, 
  onAddField,
  onSelectField,
  onSelectMultipleFields,
  onUpdateField,
  onUpdateMultipleFields
}) => {
  const [draggingFieldIds, setDraggingFieldIds] = useState<string[]>([]);
  const [hoveredSide, setHoveredSide] = useState<string | null>(null);
  const [selectionBox, setSelectionBox] = useState<{ x: number, y: number, width: number, height: number } | null>(null);
  
  const canvasRef = useRef<HTMLDivElement>(null);
  const dragStartPos = useRef({ x: 0, y: 0 });
  const fieldsStartPos = useRef<Record<string, { x: number, y: number }>>({});
  const selectionStartPos = useRef({ x: 0, y: 0 });

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const onHandleDropInternal = (e: React.DragEvent) => {
    const type = e.dataTransfer.getData('fieldType');
    const label = e.dataTransfer.getData('fieldLabel');
    if (type) {
      onDrop(e, type, label);
    }
  };

  const handleFieldMouseDown = (e: React.MouseEvent, field: PlacedField) => {
    e.stopPropagation();
    const isMulti = e.shiftKey || e.metaKey || e.ctrlKey;
    
    if (!selectedFieldIds.includes(field.id) && !isMulti) {
      onSelectField(field.id, false);
    } else if (isMulti) {
      onSelectField(field.id, true);
    }

    let dragIds = [field.id];
    if (selectedFieldIds.includes(field.id)) {
      dragIds = selectedFieldIds;
    } else if (isMulti) {
       dragIds = [...selectedFieldIds, field.id];
    }
    
    setDraggingFieldIds(dragIds);
    dragStartPos.current = { x: e.clientX, y: e.clientY };
    
    fieldsStartPos.current = {};
    dragIds.forEach(id => {
      const f = placedFields.find(item => item.id === id);
      if (f) {
        fieldsStartPos.current[id] = { x: f.x, y: f.y };
      }
    });
  };

  const handleCanvasMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    onSelectField(null);
    selectionStartPos.current = {
      x: (e.clientX - rect.left) / (zoom / 100),
      y: (e.clientY - rect.top) / (zoom / 100)
    };
    setSelectionBox({ x: selectionStartPos.current.x, y: selectionStartPos.current.y, width: 0, height: 0 });
  };

  const handleQuickAdd = (e: React.MouseEvent, baseField: PlacedField, side: string) => {
    e.stopPropagation();
    const spacing = 12;
    let newX = baseField.x;
    let newY = baseField.y;

    if (side === 'left') newX -= (baseField.width + spacing);
    if (side === 'right') newX += (baseField.width + spacing);
    if (side === 'top') newY -= (baseField.height + spacing);
    if (side === 'bottom') newY += (baseField.height + spacing);

    onAddField({
      ...baseField,
      x: newX,
      y: newY,
    }, baseField.id);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (draggingFieldIds.length > 0) {
        const deltaX = (e.clientX - dragStartPos.current.x) / (zoom / 100);
        const deltaY = (e.clientY - dragStartPos.current.y) / (zoom / 100);

        draggingFieldIds.forEach(id => {
          const start = fieldsStartPos.current[id];
          if (start) {
            onUpdateField(id, {
              x: start.x + deltaX,
              y: start.y + deltaY,
            });
          }
        });
        return;
      }

      if (selectionBox) {
        const rect = canvasRef.current?.getBoundingClientRect();
        if (!rect) return;

        const currentX = (e.clientX - rect.left) / (zoom / 100);
        const currentY = (e.clientY - rect.top) / (zoom / 100);

        const x = Math.min(selectionStartPos.current.x, currentX);
        const y = Math.min(selectionStartPos.current.y, currentY);
        const width = Math.abs(selectionStartPos.current.x - currentX);
        const height = Math.abs(selectionStartPos.current.y - currentY);

        setSelectionBox({ x, y, width, height });
      }
    };

    const handleMouseUp = () => {
      if (selectionBox) {
        const newlySelectedIds = placedFields.filter(f => {
          return (
            f.x < selectionBox.x + selectionBox.width &&
            f.x + f.width > selectionBox.x &&
            f.y < selectionBox.y + selectionBox.height &&
            f.y + f.height > selectionBox.y
          );
        }).map(f => f.id);

        if (newlySelectedIds.length > 0) {
          onSelectMultipleFields(newlySelectedIds);
        }
        setSelectionBox(null);
      }
      setDraggingFieldIds([]);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [draggingFieldIds, selectionBox, zoom, onUpdateField, placedFields, onSelectMultipleFields]);

  return (
    <div 
      className="flex-1 overflow-auto p-12 flex justify-center items-start bg-[#e5e7eb]"
      onMouseDown={handleCanvasMouseDown}
    >
      <div 
        ref={canvasRef}
        className="bg-white shadow-xl transition-transform origin-top-center mb-16 relative"
        onDragOver={handleDragOver}
        onDrop={onHandleDropInternal}
        style={{ 
          width: '800px', 
          minHeight: '1130px', 
          transform: `scale(${zoom / 100})`,
        }}
      >
        <div className="p-24 text-[#111827] leading-[1.8] pointer-events-none select-none">
          <h2 className="text-[32px] font-bold text-center mb-14 tracking-tight">
            NON-DISCLOSURE AGREEMENT (NDA)
          </h2>
          <p className="mb-10 text-[15px]">
            This Nondisclosure Agreement or ("Agreement") has been entered into on the date of
            ____________________________________ and is by and between:
          </p>
          <div className="space-y-8 mb-14 text-[15px]">
            <div>
              <p><span className="font-bold underline decoration-1 underline-offset-4">Party Disclosing</span> Information: ____________________________________</p>
            </div>
            <div>
              <p><span className="font-bold underline decoration-1 underline-offset-4">Party Receiving</span> Information: ____________________________________</p>
            </div>
          </div>
        </div>

        {selectionBox && (
          <div className="absolute border border-blue-500 bg-blue-500/10 pointer-events-none z-[100]"
            style={{ left: selectionBox.x, top: selectionBox.y, width: selectionBox.width, height: selectionBox.height }}
          />
        )}

        {placedFields.map(field => {
          const isSelected = selectedFieldIds.includes(field.id);
          const isOnlySelection = selectedFieldIds.length === 1 && isSelected;
          
          return (
            <div 
              key={field.id}
              onMouseDown={(e) => handleFieldMouseDown(e, field)}
              onMouseLeave={() => setHoveredSide(null)}
              className={`absolute cursor-move border-2 transition-colors flex items-center justify-center group ${
                isSelected 
                  ? 'border-[#2563eb] bg-[#eff6ff]/80 z-20 shadow-md' 
                  : 'border-gray-300 bg-transparent z-10 hover:border-gray-400'
              }`}
              style={{ left: field.x, top: field.y, width: field.width, height: field.height }}
            >
              {field.type === 'checkbox' ? (
                <div className="w-[14px] h-[14px] border border-[#2563eb] bg-white relative"></div>
              ) : (
                <span className="text-[10px] font-bold text-[#1d4ed8] uppercase pointer-events-none px-2 text-center truncate">
                  {field.label}
                </span>
              )}

              {isOnlySelection && field.type === 'checkbox' && (
                <>
                  <div className="absolute inset-x-0 -top-4 h-4 cursor-default z-30" onMouseEnter={() => setHoveredSide('top')} />
                  <div className="absolute inset-x-0 -bottom-4 h-4 cursor-default z-30" onMouseEnter={() => setHoveredSide('bottom')} />
                  <div className="absolute inset-y-0 -left-4 w-4 cursor-default z-30" onMouseEnter={() => setHoveredSide('left')} />
                  <div className="absolute inset-y-0 -right-4 w-4 cursor-default z-30" onMouseEnter={() => setHoveredSide('right')} />

                  <button onClick={(e) => handleQuickAdd(e, field, 'top')}
                    className={`absolute -top-7 left-1/2 -translate-x-1/2 w-5 h-5 bg-white border border-[#2563eb] text-[#2563eb] rounded-full flex items-center justify-center hover:bg-[#2563eb] hover:text-white transition-all shadow-sm z-40 ${hoveredSide === 'top' ? 'opacity-100 scale-110' : 'opacity-0 scale-75 pointer-events-none'}`}>
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4"/></svg>
                  </button>
                  <button onClick={(e) => handleQuickAdd(e, field, 'bottom')}
                    className={`absolute -bottom-7 left-1/2 -translate-x-1/2 w-5 h-5 bg-white border border-[#2563eb] text-[#2563eb] rounded-full flex items-center justify-center hover:bg-[#2563eb] hover:text-white transition-all shadow-sm z-40 ${hoveredSide === 'bottom' ? 'opacity-100 scale-110' : 'opacity-0 scale-75 pointer-events-none'}`}>
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4"/></svg>
                  </button>
                  <button onClick={(e) => handleQuickAdd(e, field, 'left')}
                    className={`absolute top-1/2 -left-7 -translate-y-1/2 w-5 h-5 bg-white border border-[#2563eb] text-[#2563eb] rounded-full flex items-center justify-center hover:bg-[#2563eb] hover:text-white transition-all shadow-sm z-40 ${hoveredSide === 'left' ? 'opacity-100 scale-110' : 'opacity-0 scale-75 pointer-events-none'}`}>
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4"/></svg>
                  </button>
                  <button onClick={(e) => handleQuickAdd(e, field, 'right')}
                    className={`absolute top-1/2 -right-7 -translate-y-1/2 w-5 h-5 bg-white border border-[#2563eb] text-[#2563eb] rounded-full flex items-center justify-center hover:bg-[#2563eb] hover:text-white transition-all shadow-sm z-40 ${hoveredSide === 'right' ? 'opacity-100 scale-110' : 'opacity-0 scale-75 pointer-events-none'}`}>
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4"/></svg>
                  </button>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DocumentViewer;
