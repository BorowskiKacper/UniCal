import React from "react";

const SubmitButton = ({ text, onClick, isDisabled, isLoading = false }) => {
  return (
    <button
      className={`
        relative px-8 py-3 rounded-xl font-semibold transition-all duration-200 ease-in-out min-w-[140px] group
        ${
          isDisabled || isLoading
            ? "bg-gray-300 text-gray-500 cursor-not-allowed dark:bg-slate-600/50 dark:text-slate-400"
            : `shadow-sm bg-[#FFC107] text-gray-950 hover:bg-amber-500 hover:text-black
              dark:bg-emerald-400 dark:text-emerald-950 dark:hover:bg-green-400 hover:dark:text-black `
        }
        focus:outline-none focus:ring-2 focus:ring-[#FFC107]/50 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-[#34D399]/50 dark:focus:ring-offset-[#18181B]
      `}
      onClick={onClick}
      disabled={isDisabled || isLoading}
    >
      <span className="flex items-center justify-center space-x-2">
        {isLoading ? (
          <svg
            className="w-5 h-5 animate-spin"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
        ) : !isDisabled ? (
          <svg
            className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 10V3L4 14h7v7l9-11h-7z"
            />
          </svg>
        ) : null}
        <span>{isLoading ? "Generating..." : text}</span>
      </span>
    </button>
  );
};

export default SubmitButton;
