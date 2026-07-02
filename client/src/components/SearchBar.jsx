import React from 'react';
import { Search, Loader2, X } from 'lucide-react';

const SearchBar = ({
  value,
  onChange,
  placeholder = 'Cari...',
  className = '',
  loading = false,
  onClear,
  ...props
}) => {
  return (
    <div className={`relative w-full ${className}`}>
      <Search 
        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" 
        size={18} 
      />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full pl-10 pr-10 py-4 rounded-xl border border-gray-200 bg-white text-gray-800 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all shadow-sm text-sm"
        {...props}
      />
      {loading && (
        <Loader2 
          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-green-500 animate-spin" 
          size={18} 
        />
      )}
      {!loading && value && onClear && (
        <button
          type="button"
          onClick={onClear}
          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
        >
          <X size={18} />
        </button>
      )}
    </div>
  );
};

export default SearchBar;
