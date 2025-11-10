import { useEffect, useRef, useState, useLayoutEffect } from "react";
import EditEventForm from "./EditEventForm";

const EventPopup = ({
  activeEvent,
  anchorRect,
  calendarContainerRect,
  onClose,
  eventModify,
  eventAdd,
  eventDelete,
  weekdays,
  weekdayToAddCourse,
  calendarEvents,
  mouseClickPosition,
}) => {
  const isOpen = Boolean(activeEvent) || Boolean(weekdayToAddCourse);

  // Close on Esc
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  const panelRef = useRef(null);
  const [desktopPos, setDesktopPos] = useState({
    left: 0,
    top: 0,
    side: "right",
  });
  const clickedPercentageAwayFromTop =
    (mouseClickPosition?.y - anchorRect?.y) / anchorRect?.height;

  useLayoutEffect(() => {
    if (!isOpen || !anchorRect) return;
    const margin = 8; // px

    const compute = () => {
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const panelRect = panelRef.current?.getBoundingClientRect();
      const panelWidth = panelRect?.width || 360;
      const panelHeight = panelRect?.height || 460;

      const spaceLeftOfContainer =
        (viewportWidth - calendarContainerRect?.width) / 2 || 100;

      const spaceRight = viewportWidth - anchorRect.right - margin;
      const spaceLeft = anchorRect.left - margin;
      const side = spaceLeft < spaceRight ? "right" : "left";

      let left;
      if (side === "right") {
        left = Math.min(
          anchorRect.right + margin - spaceLeftOfContainer,
          viewportWidth - panelWidth - spaceLeftOfContainer * 2
        );
      } else {
        left = Math.max(
          margin,
          anchorRect.left - panelWidth - spaceLeftOfContainer
        );
      }

      // Vertically center around the event; then clamp
      let top = anchorRect.top + anchorRect.height / 2 - panelHeight / 2;
      top = Math.max(
        margin,
        Math.min(top, viewportHeight - panelHeight - margin)
      );

      setDesktopPos({ left, top, side });
    };

    compute();
  }, [isOpen, anchorRect]);

  const [copySelectionId, setCopySelectionId] = useState("");

  if (!isOpen) return null;

  const activeEventForForm = weekdayToAddCourse
    ? { className: "", weekDay: weekdayToAddCourse, description: "", time: "" }
    : activeEvent;

  const handleCopySelected = () => {
    if (!copySelectionId) return;
    const src = calendarEvents?.[copySelectionId];
    if (!src) return;
    const newEvent = {
      className: src.className || "",
      description: src.description || "",
      time: src.time || "",
      weekDay: weekdayToAddCourse,
    };
    eventAdd?.(newEvent);
    onClose?.();
  };

  return (
    <div className="fixed inset-0 z-[100]">
      {/* Backdrop */}
      <button
        aria-label="Close popup"
        onClick={onClose}
        className="absolute inset-0 bg-black/60 "
      />

      {/* Desktop anchored panel */}
      <div
        className="hidden md:block absolute"
        style={{ left: `${desktopPos.left}px`, top: `${desktopPos.top}px` }}
      >
        <div
          ref={panelRef}
          className={`w-[360px] max-w-[90vw] rounded-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 shadow-2xl border
             bg-white text-gray-900 border-gray-200 dark:bg-slate-800 dark:text-slate-100 dark:border-slate-700`}
          role="dialog"
          aria-modal="true"
        >
          <div className="px-4 py-3 border-b border-gray-200 dark:border-slate-700 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-slate-100">
              {weekdayToAddCourse ? "Add Event" : "Edit event"}
            </h3>
            <div className="flex items-center gap-2">
              {!weekdayToAddCourse && (
                <button
                  onClick={() => {
                    eventDelete();
                    onClose();
                  }}
                  className="text-gray-500 hover:text-red-500 transition-colors dark:text-slate-400 dark:hover:text-red-400"
                  aria-label="Delete event"
                  title="Delete event"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    className="w-5 h-5"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 6h18M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2m-6 5v6m4-6v6"
                    />
                  </svg>
                </button>
              )}
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 transition-colors dark:text-slate-400 dark:hover:text-slate-200"
                aria-label="Close"
              >
                ✕
              </button>
            </div>
          </div>
          <div className="p-4 max-h-[80vh] overflow-y-auto">
            {weekdayToAddCourse && (
              <div className="space-y-4 mb-4">
                <div>
                  <p className="text-xs uppercase tracking-wide text-gray-500 mb-1 dark:text-slate-400">
                    Copy existing course into {weekdayToAddCourse}
                  </p>
                  <div className="flex gap-2">
                    <select
                      className="flex-1 px-3 py-2 rounded-md border text-sm bg-white border-gray-300 text-gray-800 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 dark:bg-slate-900/50 dark:border-slate-600 dark:text-slate-100 dark:focus:border-emerald-400 dark:focus:ring-emerald-400"
                      value={copySelectionId}
                      onChange={(e) => setCopySelectionId(e.target.value)}
                    >
                      <option value="">Select a course to copy</option>
                      {Object.entries(calendarEvents || {}).map(
                        ([id, event]) => (
                          <option
                            key={id}
                            value={id}
                            className="bg-white dark:bg-slate-900"
                          >
                            {event.className} ({event.time})
                          </option>
                        )
                      )}
                    </select>
                    <button
                      onClick={handleCopySelected}
                      disabled={!copySelectionId}
                      className={`px-3 py-2 rounded-md border text-sm transition-colors ${
                        copySelectionId
                          ? "bg-amber-400 hover:bg-amber-500 border-amber-400 text-black dark:bg-emerald-400 dark:hover:bg-green-400 dark:border-emerald-400 dark:text-emerald-950 dark:hover:text-black"
                          : "bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed dark:bg-slate-700/50 dark:border-slate-600 dark:text-slate-400"
                      }`}
                    >
                      Copy
                    </button>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-gray-400 dark:text-slate-400">
                  <div className="flex-1 h-px bg-gray-200 dark:bg-slate-700" />
                  <span className="text-xs">or create new</span>
                  <div className="flex-1 h-px bg-gray-200 dark:bg-slate-700" />
                </div>
              </div>
            )}
            <EditEventForm
              activeEvent={activeEventForForm}
              eventModify={
                weekdayToAddCourse
                  ? (props) => eventAdd?.({ ...props })
                  : eventModify
              }
              weekdays={weekdays}
              closePopup={onClose}
            />
          </div>
        </div>
      </div>

      {/* Mobile bottom sheet */}
      <div className="md:hidden absolute inset-x-0 bottom-0">
        <div
          className={`w-full bg-white text-gray-900 border-t border-gray-200 dark:bg-slate-800 dark:text-slate-100 dark:border-slate-700 shadow-2xl rounded-t-2xl overflow-hidden transform transition-transform duration-200 translate-y-0 max-h-[80vh]`}
          role="dialog"
          aria-modal="true"
        >
          <div className="px-4 py-3 border-b border-gray-200 dark:border-slate-700 flex items-center justify-between">
            <div className="h-1.5 w-10 bg-gray-300 dark:bg-slate-600/60 rounded-full mx-auto absolute left-1/2 -translate-x-1/2 -top-2" />
            <h3 className="text-base font-semibold">
              {weekdayToAddCourse ? "Add Event" : "Edit event"}
            </h3>
            <div className="flex items-center gap-3">
              {!weekdayToAddCourse && (
                <button
                  onClick={() => {
                    eventDelete?.();
                    onClose?.();
                  }}
                  className="text-gray-500 hover:text-red-500 transition-colors dark:text-slate-400 dark:hover:text-red-400"
                  aria-label="Delete event"
                  title="Delete event"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    className="w-5 h-5"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 6h18M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2m-6 5v6m4-6v6"
                    />
                  </svg>
                </button>
              )}
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 transition-colors dark:text-slate-400 dark:hover:text-slate-200"
                aria-label="Close"
              >
                ✕
              </button>
            </div>
          </div>
          <div className="p-4 overflow-y-auto">
            {weekdayToAddCourse && (
              <div className="space-y-4 mb-4">
                <div>
                  <p className="text-xs uppercase tracking-wide text-gray-500 mb-1 dark:text-slate-400">
                    Copy existing course into {weekdayToAddCourse}
                  </p>
                  <div className="flex gap-2">
                    <select
                      className="flex-1 px-3 py-2 rounded-md border text-sm bg-white border-gray-300 text-gray-800 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 dark:bg-slate-900/50 dark:border-slate-600 dark:text-slate-100"
                      value={copySelectionId}
                      onChange={(e) => setCopySelectionId(e.target.value)}
                    >
                      <option value="">Select a course to copy</option>
                      {Object.entries(calendarEvents || {}).map(([id, ev]) => (
                        <option
                          key={id}
                          value={id}
                          className="bg-white dark:bg-slate-900"
                        >
                          {ev.className} ({ev.time})
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={handleCopySelected}
                      disabled={!copySelectionId}
                      className={`px-3 py-2 rounded-md border text-sm transition-colors ${
                        copySelectionId
                          ? "bg-amber-400 hover:bg-amber-500 border-amber-400 text-black dark:bg-emerald-400 dark:hover:bg-emerald-500 dark:border-emerald-400 dark:text-emerald-950"
                          : "bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed dark:bg-slate-700/50 dark:border-slate-600 dark:text-slate-400"
                      }`}
                    >
                      Copy
                    </button>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-gray-400 dark:text-slate-400">
                  <div className="flex-1 h-px bg-gray-200 dark:bg-slate-700" />
                  <span className="text-xs">or create new</span>
                  <div className="flex-1 h-px bg-gray-200 dark:bg-slate-700" />
                </div>
              </div>
            )}
            <EditEventForm
              activeEvent={activeEvent}
              eventModify={
                weekdayToAddCourse
                  ? (props) => eventAdd?.({ ...props })
                  : eventModify
              }
              weekdays={weekdays}
              closePopup={onClose}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventPopup;
