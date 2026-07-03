import React, { useState, useRef, useEffect } from 'react';
import { ArrowUpDown } from 'lucide-react';

export default function SortDropdown({
  options = [],
  value,
  onChange,
  className = ''
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find(opt => opt.value === value) || options[0];

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 md:gap-2 px-4 md:px-5 py-4 rounded-xl border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition shadow-sm text-sm font-semibold cursor-pointer whitespace-nowrap active:scale-98"
        type="button"
      >
        <ArrowUpDown size={18} className="text-gray-500" />
        <span className="hidden md:inline">Urutkan:</span>
        <span className="hidden md:inline text-green-600 font-bold">{selectedOption?.label}</span>
      </button>

      {/* Popover Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-2xl shadow-xl z-30 py-2 animate-in fade-in slide-in-from-top-3 duration-150">
          <div className="px-3 py-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
            Metode Urutkan
          </div>
          {options.map((opt) => {
            const isSelected = opt.value === value;
            return (
              <button
                key={opt.value}
                onClick={() => {
                  onChange(opt.value);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-4 py-2.5 text-sm transition font-medium flex items-center justify-between cursor-pointer ${
                  isSelected 
                    ? 'bg-green-50 text-green-700 font-bold' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
                }`}
                type="button"
              >
                <span>{opt.label}</span>
                {isSelected && (
                  <span className="w-1.5 h-1.5 bg-green-600 rounded-full" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
