import React from "react";

const SubmitButton = ({ text, onClick, isDisabled }) => {
  return (
    <div>
      <button
        className="bg-blue-500 text-white p-2 rounded-md disabled:bg-blue-300"
        onClick={onClick}
        disabled={isDisabled}
      >
        {text}
      </button>
    </div>
  );
};

export default SubmitButton;
