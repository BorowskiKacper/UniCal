import { useState, useEffect, useRef } from "react";
import Fuse from "fuse.js";

const FuzzySearch = ({ colleges, selectedCollegeID, onChange }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredResults, setFilteredResults] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const wrapperRef = useRef(null);
  const inputRef = useRef(null);

  // Initialize Fuse.js with college data
  const fuse = new Fuse(colleges, {
    keys: ["name", "acronym", "aliases"],
    threshold: 0.3,
    includeScore: true,
    ignoreLocation: true,
  });

  // Handle clicks outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Update search results when search term changes
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredResults(colleges.slice(0, 10));
    } else {
      const results = fuse.search(searchTerm);
      setFilteredResults(results.map((result) => result.item).slice(0, 10));
    }
    setHighlightedIndex(-1);
  }, [searchTerm, colleges]);

  // Display selected college name in input
  const getDisplayValue = () => {
    if (selectedCollegeID) {
      const college = colleges.find(
        (c) => c.id === selectedCollegeID || c.name === selectedCollegeID
      );
      return college ? college.name : "";
    }
    return searchTerm;
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setIsOpen(true);
    // Clear selection when user starts typing
    if (selectedCollegeID) {
      onChange("");
    }
  };

  const handleSelectCollege = (college) => {
    onChange(college.id || college.name);
    setSearchTerm(college.name);
    setIsOpen(false);
    setHighlightedIndex(-1);
  };

  const handleKeyDown = (e) => {
    if (!isOpen) {
      if (e.key === "ArrowDown" || e.key === "Enter") {
        setIsOpen(true);
      }
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev < filteredResults.length - 1 ? prev + 1 : prev
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case "Tab":
      case "Enter":
        e.preventDefault();
        if (highlightedIndex >= 0 && filteredResults[highlightedIndex]) {
          // Select the highlighted college
          handleSelectCollege(filteredResults[highlightedIndex]);
        } else if (highlightedIndex === -1 && filteredResults.length > 0) {
          // Select the first college if nothing is highlighted
          handleSelectCollege(filteredResults[0]);
        }
        break;
      case "Escape":
        setIsOpen(false);
        setHighlightedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  const handleFocus = () => {
    setIsOpen(true);
  };

  return (
    <div ref={wrapperRef} className="relative w-full max-w-md">
      <input
        ref={inputRef}
        type="text"
        value={getDisplayValue()}
        onChange={handleInputChange}
        onFocus={handleFocus}
        onKeyDown={handleKeyDown}
        placeholder="Search for your college..."
        className="w-full px-4 py-2 rounded-md border text-sm
                   bg-white border-gray-300 text-gray-800 shadow-sm
                   focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400
                   dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-100 
                   dark:focus:border-emerald-400 dark:focus:ring-emerald-400
                   placeholder:text-gray-400 dark:placeholder:text-zinc-500"
      />

      {isOpen && filteredResults.length > 0 && (
        <ul
          className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg
                     max-h-60 overflow-y-auto
                     dark:bg-zinc-800 dark:border-zinc-700"
        >
          {filteredResults.map((college, index) => (
            <li
              key={college.id || college.name}
              onClick={() => handleSelectCollege(college)}
              className={`px-4 py-2 cursor-pointer transition-colors
                         ${
                           index === highlightedIndex
                             ? "bg-amber-50 dark:bg-zinc-700"
                             : "hover:bg-gray-50 dark:hover:bg-zinc-700"
                         }
                         ${
                           index !== filteredResults.length - 1
                             ? "border-b border-gray-100 dark:border-zinc-700"
                             : ""
                         }`}
            >
              <div className="text-sm font-medium text-gray-900 dark:text-zinc-100">
                {college.name}
              </div>
              {college.acronym && (
                <div className="text-xs text-gray-500 dark:text-zinc-400">
                  {college.acronym}
                </div>
              )}
            </li>
          ))}
        </ul>
      )}

      {isOpen && searchTerm.trim() !== "" && filteredResults.length === 0 && (
        <div
          className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg
                     px-4 py-3 text-sm text-gray-500
                     dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-400"
        >
          No colleges found matching "{searchTerm}"
        </div>
      )}
    </div>
  );
};

export default FuzzySearch;
