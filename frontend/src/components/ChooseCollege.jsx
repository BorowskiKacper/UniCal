const ChooseCollege = ({ selectedCollege, colleges, onChange }) => {
  return (
    <div>
      <select
        className="flex-1 bg-slate-900/50 border border-slate-600 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
        value={selectedCollege}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">Select your college</option>
        {colleges.map((college) => (
          <option key={college} value={college} className="bg-slate-900">
            {college}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ChooseCollege;
