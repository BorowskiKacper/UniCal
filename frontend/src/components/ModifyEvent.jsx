import React, { useState } from "react";

const ModifyEvent = ({ activeEvent }) => {
  return (
    <div className="flex flex-col border-y-1 border-l-2 rounded-l-3xl w-full h-full overflow-hidden bg-indigo-50">
      {activeEvent && <div>{activeEvent.id}</div>}
    </div>
  );
};

export default ModifyEvent;
