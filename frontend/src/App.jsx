import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import ScheduleInput from "./components/ScheduleInput";

function App() {
  const [count, setCount] = useState(0);

  // const handleChange = (event) => {
  //   setInputText(event.target.value);
  // };

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>UniCal</h1>
      {/* <div>
        <label htmlFor="myInput">Enter something:</label>
        <input
          id="myInput"
          type="text"
          value={inputText}
          onChange={handleChange}
        />
        <p>You typed: {inputText}</p>
      </div> */}
      <ScheduleInput />
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
}

export default App;
