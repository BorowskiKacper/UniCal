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
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSubmit(event);
    }
  };

  return (
    <div>
      <label htmlFor="myInput">Enter something:</label>
      <input
        id="myInput"
        type="text"
        value={inputText}
        onChange={handleChange}
        onSubmit={handleSubmit}
        onKeyDown={handleKeyDown}
      />
      <p>You typed: {inputText}</p>
      {submittedText && <p>You submitted: {submittedText}</p>}
    </div>
  );
}

export default ScheduleInput;
