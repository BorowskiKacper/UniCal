import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import ScheduleInput from "./components/ScheduleInput";
import WeeklyContainer from "./components/WeeklyContainer";

function App() {
  const [count, setCount] = useState(0);

  // const handleChange = (event) => {
  //   setInputText(event.target.value);
  // };

  return (
    <div className="w-full h-full">
      <h1>UniCal</h1>

      <div className="flex items-center flex-col overflow-y-auto ">
        <div className=" h-150">upload</div>
        <WeeklyContainer />
        <div className="h-40"></div>
      </div>
    </div>
  );
}

export default App;
