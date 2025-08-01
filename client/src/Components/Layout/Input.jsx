import React from "react";

export const Input = ({
  label,
  error,
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
      <input
        {...props}
        className={`w-full px-4 py-2 rounded-lg dark:bg-gray-700 dark:text-white border border-marriagePink focus:outline-none focus:ring-2 focus:ring-marriageHotPink ${className}`}
      />
      {error && (
        <p className="text-marriageRed text-xs mt-1">{error}</p>
      )}
    </div>
  );
}; 