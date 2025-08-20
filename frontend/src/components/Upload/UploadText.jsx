import React from "react";

const UploadText = ({ text, onChange }) => {
  return (
    <div className="w-full">
      <label
        htmlFor="paragraph"
        className="block text-sm font-medium text-slate-300 mb-2"
      >
        Enter your schedule here
      </label>
      <div className="relative">
        <textarea
          id="paragraph"
          className="w-full h-40 md:h-48 p-4 bg-slate-700/50 border border-slate-600/50 rounded-xl
                     text-slate-200 placeholder-slate-400 resize-none
                     focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 focus:outline-none
                     transition-all duration-200 ease-in-out
                     scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-transparent"
          placeholder="Type your schedule text here... For example:
Foundations of Speech Communication SPCH 11100 Shepard Hall Rm S-276 Tue/Thurs 2pm-3:15pm; Cross-Cultural Perspectives ANTH 20100 NAC Rm 6/213 Mon/Wed 12:30 to 1:45pm..."
          value={text}
          onChange={(event) => onChange(event.target.value)}
        />
      </div>
    </div>
  );
};

export default UploadText;
