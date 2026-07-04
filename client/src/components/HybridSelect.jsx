import React, { useState, useEffect, useRef } from "react";
import { ChevronDown, X } from "lucide-react";

export default function HybridSelect({ value, onChange, options = [], placeholder = "" }) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  // Close suggestions dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleInputChange = (e) => {
    onChange(e);
    setIsOpen(true);
  };

  const handleSelectOption = (opt) => {
    const selectedValue = typeof opt === "object" ? opt.value : opt;
    // Mock event object for compatibility with standard form change handlers
    onChange({ target: { value: selectedValue } });
    setIsOpen(false);
  };

  const handleClear = () => {
    onChange({ target: { value: "" } });
    setIsOpen(false);
  };

  // Filter options based on text input (case-insensitive substring match)
  const filteredOptions = options.filter((opt) => {
    const label = typeof opt === "object" ? opt.label || opt.value : opt;
    return String(label).toLowerCase().includes(String(value || "").toLowerCase());
  });

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="relative">
        <input
          type="text"
          value={value}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className="w-full pl-4 pr-16 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-800 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all shadow-sm text-sm"
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5 text-gray-400">
          {value && (
            <button
              type="button"
              onClick={handleClear}
              className="p-0.5 hover:bg-gray-100 rounded-full hover:text-gray-600 transition cursor-pointer"
            >
              <X size={14} />
            </button>
          )}
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="p-0.5 hover:bg-gray-100 rounded-full hover:text-gray-600 transition cursor-pointer"
          >
            <ChevronDown size={16} className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-white border border-gray-150 rounded-xl shadow-xl max-h-60 overflow-y-auto py-1">
          {filteredOptions.length > 0 ? (
            filteredOptions.map((opt, index) => {
              const label = typeof opt === "object" ? opt.label || opt.value : opt;
              const val = typeof opt === "object" ? opt.value : opt;
              const isSelected = String(value).toLowerCase() === String(val).toLowerCase();

              return (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleSelectOption(opt)}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-green-50 hover:text-green-800 transition-colors flex items-center justify-between cursor-pointer ${
                    isSelected ? "bg-green-50/50 text-green-700 font-medium" : "text-gray-700"
                  }`}
                >
                  <span>{label}</span>
                </button>
              );
            })
          ) : (
            <div className="px-4 py-3 text-xs text-gray-400 text-center">
              Tidak ada saran
            </div>
          )}
        </div>
      )}
    </div>
  );
}
