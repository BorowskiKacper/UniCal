import React from "react";

const UploadText = ({ text, onChange }) => {
  return (
    <>
      <label htmlFor="paragraph">Enter your schedule here</label>
      <textarea
        id="paragraph"
        className="w-full h-40 p-2 border border-gray-300 rounded-md"
        value={text}
        onChange={(event) => onChange(event.target.value)}
      ></textarea>
    </>
  );
};

export default UploadText;
