import React from "react";

const Loader: React.FC = () => (
  <div className="flex items-center justify-center h-32">
    <svg className="animate-spin h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24">
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v8z"
      />
    </svg>
    <span className="ml-4 text-blue-600 font-semibold">Loading...</span>
  </div>
);

export default Loader;
