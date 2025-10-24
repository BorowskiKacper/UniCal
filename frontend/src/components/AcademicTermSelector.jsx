import { useEffect } from "react";

const AcademicTermSelector = ({
  selectedCollegeID,
  colleges,
  selectedTermID,
  onChange,
}) => {
  // Find the selected college object
  const college = colleges.find((c) => c.id === selectedCollegeID);
  const academicTerms = college?.academic_terms || [];

  // Auto-select the last term when college changes
  useEffect(() => {
    if (academicTerms.length > 0) {
      const lastTerm = academicTerms[academicTerms.length - 1];
      onChange(lastTerm.id);
    } else {
      onChange("");
    }
  }, [selectedCollegeID, academicTerms.length]);

  if (!selectedCollegeID || academicTerms.length === 0) {
    return null;
  }

  return (
    <div className="w-full max-w-md">
      <label
        htmlFor="academic-term-select"
        className="block text-xs uppercase tracking-wide text-gray-500 dark:text-slate-400 mb-1"
      >
        Select Academic Term
      </label>
      <select
        id="academic-term-select"
        value={selectedTermID}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full px-4 py-2.5 bg-white dark:bg-zinc-700 border border-gray-300 dark:border-zinc-600 rounded-lg shadow-sm text-gray-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 dark:focus:border-emerald-400 dark:focus:ring-emerald-400 transition-colors"
      >
        {academicTerms.map((term) => (
          <option key={term.id} value={term.id}>
            {term.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default AcademicTermSelector;
