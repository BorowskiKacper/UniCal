import { useState } from "react";

function ScheduleInput() {
  const [inputText, setInputText] = useState("Monday 10:00-11:00 calc 3");
  const [submittedText, setSubmittedText] = useState("");

  const handleChange = (event) => {
    setInputText(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (inputText.trim() !== "") {
      setSubmittedText(inputText);
      setInputText("");
      // Send text to backend for processing
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSubmit(event);
    }
  };

  return (
    <div className="bg-amber-100">
      <label className="border-2 rounded-2xl p-2 m-2" htmlFor="myInput">
        Enter something:
      </label>
      <input
        className="border-2 rounded-2xl p-2 m-2"
        id="myInput"
        type="text"
        value={inputText}
        onChange={handleChange}
        onSubmit={handleSubmit}
        onKeyDown={handleKeyDown}
      />
      <p className="border-2 rounded-2xl p-2 m-2">You typed: {inputText}</p>
      {submittedText && <p>You submitted: {submittedText}</p>}
    </div>
  );
}

export default ScheduleInput;
