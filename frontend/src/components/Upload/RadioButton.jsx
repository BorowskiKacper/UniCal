import React from "react";

const RadioButton = ({ options, selectedOption, onChange }) => {
  return (
    <div className="flex justify-center mb-8">
      <div className="inline-flex bg-slate-700/50 p-1 rounded-xl border border-slate-600/50 shadow-lg">
        {options.map((option) => (
          <label key={option} className="relative cursor-pointer select-none">
            <input
              type="radio"
              name="radio"
              value={option}
              className="peer sr-only"
              checked={selectedOption === option}
              onChange={() => {
                console.log(`option: ${option}`);
                onChange(option);
              }}
            />
            <div
              className="flex items-center justify-center px-6 py-3 rounded-lg text-sm font-medium transition-all duration-200 ease-in-out
                           peer-checked:bg-gradient-to-r peer-checked:from-blue-500 peer-checked:to-purple-600 
                           peer-checked:text-white peer-checked:shadow-lg peer-checked:scale-105
                           text-slate-300 hover:text-white hover:bg-slate-600/50
                           min-w-[80px]"
            >
              <span className="flex items-center space-x-2">
                {option === "image" && (
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                )}
                {option === "text" && (
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                )}
                <span className="capitalize">{option}</span>
              </span>
            </div>
          </label>
        ))}
      </div>
    </div>
  );
};

export default RadioButton;
