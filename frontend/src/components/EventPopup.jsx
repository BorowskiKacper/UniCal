import React, { useEffect, useRef, useState, useLayoutEffect } from "react";
import PopupForm from "./PopupForm";

const EventPopup = ({
  activeEvent,
  anchorRect,
  calendarContainerRect,
  onClose,
  setEventProperty,
}) => {
  const isOpen = Boolean(activeEvent);

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

  if (!isOpen) return null;

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
          className={
            "w-[360px] max-w-[90vw] bg-slate-800 text-slate-100 border border-slate-700 shadow-2xl rounded-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150"
          }
          role="dialog"
          aria-modal="true"
        >
          <div className="px-4 py-3 border-b border-slate-700 flex items-center justify-between">
            <h3 className="text-sm font-semibold">Edit event</h3>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-200 transition-colors"
              aria-label="Close"
            >
              ✕
            </button>
          </div>
          <div className="p-4 max-h-[80vh] overflow-y-auto">
            <PopupForm
              activeEvent={activeEvent}
              setEventProperty={setEventProperty}
            />
          </div>
        </div>
      </div>

      {/* Mobile bottom sheet */}
      <div className="md:hidden absolute inset-x-0 bottom-0">
        <div
          className="w-full bg-slate-800 text-slate-100 border-t border-slate-700 shadow-2xl rounded-t-2xl overflow-hidden transform transition-transform duration-200 translate-y-0 max-h-[80vh]"
          role="dialog"
          aria-modal="true"
        >
          <div className="px-4 py-3 border-b border-slate-700 flex items-center justify-between">
            <div className="h-1.5 w-10 bg-slate-600/60 rounded-full mx-auto absolute left-1/2 -translate-x-1/2 -top-2" />
            <h3 className="text-base font-semibold">Edit event</h3>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-200 transition-colors"
              aria-label="Close"
            >
              ✕
            </button>
          </div>
          <div className="p-4 overflow-y-auto">
            <PopupForm
              activeEvent={activeEvent}
              setEventProperty={setEventProperty}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventPopup;
