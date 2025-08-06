import React from "react";

const RadioButton = ({ options, selectedOption, onChange }) => {
  return (
    <div className="flex space-x-2 border-[3px] border-purple-400 rounded-xl select-none">
      {options.map((option) => (
        <label
          key={option}
          className="radio flex flex-grow items-center justify-center rounded-lg p-1 cursor-pointer"
        >
          <input
            type="radio"
            name="radio"
            value={option}
            className="peer hidden"
            checked={selectedOption === option}
            onChange={() => {
              console.log(`option: ${option}`);
              onChange(option);
            }}
          />
          <span className="tracking-widest peer-checked:bg-gradient-to-r peer-checked:from-[blueviolet] peer-checked:to-[violet] peer-checked:text-white text-gray-700 p-2 rounded-lg transition duration-150 ease-in-out">
            {option}
          </span>
        </label>
      ))}
    </div>
  );
};

export default RadioButton;
