import { useState, useRef } from "react";

const Header = ({ currentUser, handleLogout, setDarkMode }) => {
  const [userHoverOpen, setUserHoverOpen] = useState(false);
  const hoverTimeoutRef = useRef(null);

  return (
    <header className="p-6 flex justify-between items-center w-full max-w-7xl mx-auto border-b border-gray-200 dark:border-zinc-700">
      <div className="flex items-center gap-2">
        <img
          src="/light-theme-logo.svg"
          alt="Logo"
          className="h-7 w-7 dark:hidden"
        />
        <img
          src="/dark-theme-logo.svg"
          alt="Logo"
          className="h-7 w-7 hidden dark:inline"
        />
        <h1 className="text-xl font-bold text-gray-800 dark:text-zinc-100">
          UniCal
        </h1>
      </div>
      <div className="flex items-center gap-3">
        <p className="text-gray-500 dark:text-zinc-400 text-sm hidden sm:block">
          AI-Powered Schedule Management
        </p>
        {currentUser && (
          <div
            className="relative"
            onMouseEnter={() => {
              if (hoverTimeoutRef.current)
                clearTimeout(hoverTimeoutRef.current);
              setUserHoverOpen(true);
            }}
            onMouseLeave={() => {
              if (hoverTimeoutRef.current)
                clearTimeout(hoverTimeoutRef.current);
              hoverTimeoutRef.current = setTimeout(
                () => setUserHoverOpen(false),
                120
              );
            }}
          >
            <button
              type="button"
              className="outline-none"
              aria-label="Account hover card"
            >
              {currentUser.photoURL ? (
                <img
                  src={currentUser.photoURL}
                  alt="User Img"
                  className="w-8 h-8 rounded-full border-2 border-gray-200 dark:border-zinc-700"
                />
              ) : (
                <div className="w-8 h-8 rounded-full border-2 border-gray-200 dark:border-zinc-700">
                  {currentUser.displayName?.[0].toUpperCase() ||
                    currentUser.email?.[0].toUpperCase() ||
                    "U"}
                </div>
              )}
            </button>

            {userHoverOpen && (
              <div className="absolute right-0 mt-2 z-50 w-64 rounded-lg border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 shadow-lg p-2 m-1">
                <p className="text-xs font-semibold text-gray-500 dark:text-zinc-400">
                  UniCal Account
                </p>
                <p className="pt-1 text-sm text-gray-900 dark:text-zinc-100 truncate">
                  {currentUser.displayName || "Unnamed User"}
                </p>
                <p className="text-sm text-gray-600 dark:text-zinc-300 truncate">
                  {currentUser.email}
                </p>

                <div className="mt-3 border-t border-gray-200 dark:border-zinc-700 pt-2">
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-3 py-2 text-sm rounded-md text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
        <button
          type="button"
          onClick={() => setDarkMode(true)}
          className="ml-2 rounded-md px-3 py-2 text-sm font-medium border border-gray-200 bg-white text-gray-900 hover:bg-gray-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700"
          aria-label="Toggle dark mode"
          title="Toggle theme"
        >
          <span className="inline dark:hidden">Light</span>
          <span className="hidden dark:inline">Dark</span>
        </button>
      </div>
    </header>
  );
};

export default Header;
