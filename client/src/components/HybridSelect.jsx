import React, { useState, useEffect, useRef } from "react";
import { ChevronDown, X } from "lucide-react";

export default function HybridSelect({ value, onChange, options = [], placeholder = "", disabled = false }) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const containerRef = useRef(null);

  // Synchronize internal input value with the selected value from props
  useEffect(() => {
    const selectedOpt = options.find((opt) => {
      const val = typeof opt === "object" ? opt.value : opt;
      return String(val) === String(value);
    });
    if (selectedOpt) {
      setInputValue(typeof selectedOpt === "object" ? selectedOpt.label : selectedOpt);
    } else {
      if (!isOpen) {
        setInputValue("");
      }
    }
  }, [value, options, isOpen]);

  // Close suggestions dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
        // Reset input value to match the actual selected value on blur
        const selectedOpt = options.find((opt) => {
          const val = typeof opt === "object" ? opt.value : opt;
          return String(val) === String(value);
        });
        if (selectedOpt) {
          setInputValue(typeof selectedOpt === "object" ? selectedOpt.label : selectedOpt);
        } else {
          setInputValue("");
        }
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [value, options]);

  const handleInputChange = (e) => {
    if (disabled) return;
    setInputValue(e.target.value);
    setIsOpen(true);
    if (e.target.value === "") {
      onChange({ target: { value: "" } });
    }
  };

  const handleSelectOption = (opt) => {
    if (disabled) return;
    const selectedValue = typeof opt === "object" ? opt.value : opt;
    const selectedLabel = typeof opt === "object" ? opt.label : opt;
    setInputValue(selectedLabel);
    onChange({ target: { value: selectedValue } });
    setIsOpen(false);
  };

  const handleClear = () => {
    if (disabled) return;
    setInputValue("");
    onChange({ target: { value: "" } });
    setIsOpen(false);
  };

  // Filter options based on text input (case-insensitive substring match)
  const filteredOptions = options.filter((opt) => {
    const label = typeof opt === "object" ? opt.label || opt.value : opt;
    return String(label).toLowerCase().includes(inputValue.toLowerCase());
  });

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="relative">
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={() => {
            if (!disabled) setIsOpen(true);
          }}
          placeholder={placeholder}
          disabled={disabled}
          className="w-full pl-4 pr-16 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-800 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all shadow-sm text-sm disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed"
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5 text-gray-400">
          {inputValue && !disabled && (
            <button
              type="button"
              onClick={handleClear}
              disabled={disabled}
              className="p-0.5 hover:bg-gray-100 rounded-full hover:text-gray-600 transition cursor-pointer"
            >
              <X size={14} />
            </button>
          )}
          <button
            type="button"
            onClick={() => {
              if (!disabled) setIsOpen(!isOpen);
            }}
            disabled={disabled}
            className="p-0.5 hover:bg-gray-100 rounded-full hover:text-gray-600 transition cursor-pointer disabled:cursor-not-allowed"
          >
            <ChevronDown size={16} className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
          </button>
        </div>
      </div>

      {isOpen && !disabled && (
        <div className="absolute z-[9999] w-full mt-2 bg-white border border-gray-100 rounded-xl shadow-xl max-h-60 overflow-y-auto py-1">
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
