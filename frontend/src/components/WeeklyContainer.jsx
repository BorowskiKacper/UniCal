import React from "react";
import TestScroll from "./TestScroll";

const WeeklyContainer = () => {
  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  //   const weekdaysHead = weekdays.map((weekday) => (
  //     <WeekdayText key={weekday} weekday={weekday} />
  //   ));

  const weekdaysHead = weekdays.map((weekday) => (
    <div key={weekday}>
      <p className="font-mono font-extrabold text-2xl">{weekday}</p>
    </div>
  ));

  return (
    <div className="flex flex-col border-y-1 border-r-2 rounded-r-3xl w-15/16 h-200 overflow-hidden bg-indigo-50">
      <div className="h-1/10 flex flex-row bg-red-50">
        <div className="w-1/10 bg-amber-50 border-r-1"></div>
        <div className="w-9/10 flex flex-row justify-around items-center border-b-1">
          {weekdaysHead}
        </div>
      </div>
      <div className="h-9/10 bg-amber-900">
        <div className="h-250 flex flex-row overflow-scroll">
          <div className="w-1/10 bg-amber-100">
            {" "}
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Adipisci
              eum eveniet quaerat et temporibus. Aliquid, dolorum! Repellendus
              labore, ab dolores sint eum mollitia, dignissimos dicta sed ea
              delectus rem quibusdam?
            </p>
          </div>
          <div className="w-9/10 bg-amber-400 ">
            <div className="  m-6">
              <TestScroll />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeeklyContainer;
