const ChooseCollege = ({ selectedCollege, colleges, onChange }) => {
  return (
    <div>
      <select
        className="flex-1 px-3 py-2 rounded-md border text-sm
                   bg-white border-gray-300 text-gray-800 shadow-sm
                   focus:outline-none focus:ring-1 focus:ring-amber-400 focus:border-amber-400
                   dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-100 dark:focus:border-emerald-400 dark:focus:ring-emerald-400"
        value={selectedCollege}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">Select your college</option>
        {colleges.map((college) => (
          <option
            key={college}
            value={college}
            className="bg-white dark:bg-zinc-800"
          >
            {college}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ChooseCollege;
