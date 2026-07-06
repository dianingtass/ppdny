import React, { useState, useEffect } from 'react';
import { SlidersHorizontal, RotateCcw, X } from 'lucide-react';

const FilterDropdown = ({
  children,
  onReset,
  activeCount = 0,
  className = '',
  ...props
}) => {
  const [isOpen, setIsOpen] = useState(false);

  // Prevent background scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <div className={`${className}`}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`flex items-center gap-1.5 md:gap-2 px-4 md:px-5 py-4 rounded-xl border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 transition shadow-sm text-sm font-semibold cursor-pointer ${
          activeCount > 0 ? 'border-green-500 text-green-600 bg-green-50/20' : ''
        }`}
        type="button"
        {...props}
      >
        <SlidersHorizontal size={18} />
        <span className="hidden md:inline">Filter</span>
        {activeCount > 0 && (
          <span className="flex items-center justify-center bg-green-600 text-white text-[10px] w-5 h-5 rounded-full font-bold">
            {activeCount}
          </span>
        )}
      </button>

      {/* Modal Overlay & Card */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-opacity cursor-pointer"
          onClick={() => setIsOpen(false)}
        >
          {/* Modal Card container */}
          <div 
            className="bg-white rounded-2xl shadow-2xl border border-gray-100 max-w-md w-full flex flex-col animate-in fade-in zoom-in-95 duration-150 cursor-default"
            onClick={(e) => e.stopPropagation()}
          >
            
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <SlidersHorizontal size={18} className="text-green-600" />
                <h3 className="font-bold text-gray-800 text-base">Filter Kategori</h3>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition p-1.5 hover:bg-gray-100 rounded-lg cursor-pointer"
                type="button"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content Body */}
            <div className="p-6 space-y-4 max-h-[60vh] overflow-visible">
              {children}
            </div>

            {/* Footer Action Buttons */}
            {onReset && (
              <div className="p-5 border-t border-gray-100 bg-gray-50/50 flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => {
                    onReset();
                    setIsOpen(false);
                  }}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm font-semibold text-gray-600 hover:bg-gray-50 transition cursor-pointer"
                >
                  <RotateCcw size={14} />
                  Reset Semua
                </button>
              </div>
            )}

          </div>
        </div>
      )}
    </div>
  );
};

export default FilterDropdown;
