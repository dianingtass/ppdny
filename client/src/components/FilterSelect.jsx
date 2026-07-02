import React from 'react';
import { ChevronDown } from 'lucide-react';

const FilterSelect = ({
  value,
  onChange,
  options = [],
  placeholder = '',
  className = '',
  inputClassName = 'py-2.5', // default to compact for inside popover
  icon: Icon,
  ...props
}) => {
  return (
    <div className={`relative w-full ${className}`}>
      {Icon && (
        <Icon 
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" 
          size={16} 
        />
      )}
      <select
        value={value}
        onChange={onChange}
        className={`w-full ${Icon ? 'pl-10' : 'pl-4'} pr-10 ${inputClassName} rounded-xl border border-gray-200 bg-white text-gray-800 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all shadow-sm text-sm cursor-pointer appearance-none`}
        {...props}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <ChevronDown 
        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" 
        size={16} 
      />
    </div>
  );
};

export default FilterSelect;
