import React from "react";

const UploadText = ({ text, onChange }) => {
  return (
    <div className="w-full">
      <label
        htmlFor="paragraph"
        className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2"
      >
        Enter your schedule here
      </label>
      <div className="relative">
        <textarea
          id="paragraph"
          className="w-full h-40 md:h-48 p-4 rounded-xl resize-none transition-all duration-200 ease-in-out
                     bg-white border border-gray-300 text-gray-800 placeholder-gray-400
                     focus:ring-2 focus:ring-amber-400 focus:border-amber-400 focus:outline-none
                     dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-100 dark:placeholder-zinc-400
                     scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent dark:scrollbar-thumb-zinc-700"
          placeholder={`Type your schedule text here... For example:\nFoundations of Speech Communication SPCH 11100 Shepard Hall Rm S-276 Tue/Thurs 2pm-3:15pm; Cross-Cultural Perspectives ANTH 20100 NAC Rm 6/213 Mon/Wed 12:30 to 1:45pm...`}
          value={text}
          onChange={(event) => onChange(event.target.value)}
        />
      </div>
    </div>
  );
};

export default UploadText;
