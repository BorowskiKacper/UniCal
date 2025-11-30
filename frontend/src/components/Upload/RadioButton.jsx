import React from "react";

const RadioButton = ({ options, selectedOption, onChange }) => {
  return (
    <div className="flex justify-center mb-6">
      <div className="inline-flex p-1 rounded-lg border bg-gray-50 border-gray-200 shadow-sm dark:bg-zinc-900 dark:border-zinc-700">
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
              className="flex items-center justify-center px-4 py-2 rounded-md text-sm font-medium transition-all duration-200
                           min-w-[80px]
                           text-gray-600 hover:bg-gray-200 peer-checked:hover:bg-amber-500 peer-checked:bg-amber-400 peer-checked:text-black hover:text-black
                           dark:text-zinc-300 dark:hover:text-zinc-100 dark:hover:bg-zinc-800 dark:peer-checked:hover:bg-green-400  dark:peer-checked:bg-emerald-400 dark:peer-checked:text-emerald-950 dark:hover:peer-checked:text-black"
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
