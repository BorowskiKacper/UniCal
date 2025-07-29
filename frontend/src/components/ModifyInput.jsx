import { useState } from "react";

const ModifyInput = ({ callback, text }) => {
  const [value, setValue] = useState(text);

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (value.trim() !== "") {
      console.log("dumbit");
      callback(event.target.value);
      // setSubmittedText(inputText);
      // setInputText("");
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSubmit(event);
    }
  };

  return (
    //     {/* <label className="border-2 rounded-2xl p-2 m-2" htmlFor="title">
    //     Enter something:
    //   </label> */}
    <input
      className="border-2 rounded-2xl p-2 m-2"
      id="title"
      type="text"
      value={value}
      onChange={handleChange}
      onSubmit={handleSubmit}
      onKeyDown={handleKeyDown}
    />
  );
};

export default ModifyInput;
