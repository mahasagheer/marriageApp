import React from "react";

export const Dropdown = ({
  label,
  error,
  options = [],
  value,
  onChange,
  name,
  className = "",
  ...props
}) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block mb-1 font-semibold text-marriagePink">
          {label}
        </label>
      )}
      <select
        name={name}
        value={value}
        onChange={onChange}
        className={`w-full px-4 py-2 rounded-lg border border-marriagePink focus:outline-none focus:ring-2 focus:ring-marriageHotPink ${className}`}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="text-marriageRed text-xs mt-1">{error}</p>
      )}
    </div>
  );
}; 