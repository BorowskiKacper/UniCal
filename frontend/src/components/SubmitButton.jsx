import React from "react";

const SubmitButton = ({ text, onClick }) => {
  return (
    <div>
      <button
        className="bg-blue-500 text-white p-2 rounded-md"
        onClick={onClick}
      >
        {text}
      </button>
    </div>
  );
};

export default SubmitButton;
