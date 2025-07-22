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
      <h1>UniCal</h1>
      <ScheduleInput />
      <div>
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
    </>
  );
}

export default App;
