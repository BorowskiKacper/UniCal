import { useRef, useEffect } from "react";

const ReminderRadioButtons = ({
  reminderOption,
  setReminderOption,
  customMinutes,
  setCustomMinutes,
}) => {
  const customRef = useRef();

  // Focus the input when custom option becomes selected
  useEffect(() => {
    if (reminderOption === "custom" && customRef.current) {
      customRef.current.focus();
    }
  }, [reminderOption]);

  return (
    <div className="flex flex-col gap-3 items-start max-w-sm mx-auto text-left">
      <label className="inline-flex items-center gap-2 cursor-pointer">
        <input
          type="radio"
          name="reminder"
          className="accent-amber-400 dark:accent-emerald-400"
          checked={reminderOption === "none"}
          onChange={() => setReminderOption("none")}
        />
        <span className="text-gray-700 dark:text-zinc-300">No reminder</span>
      </label>
      <label className="inline-flex items-center gap-2 cursor-pointer">
        <input
          type="radio"
          name="reminder"
          className="accent-amber-400 dark:accent-emerald-400"
          checked={reminderOption === "10"}
          onChange={() => setReminderOption("10")}
        />
        <span className="text-gray-700 dark:text-zinc-300">
          10 minutes (recommended)
        </span>
      </label>
      <label className="inline-flex items-center gap-2 cursor-pointer">
        <input
          type="radio"
          name="reminder"
          className="accent-amber-400 dark:accent-emerald-400"
          checked={reminderOption === "30"}
          onChange={() => setReminderOption("30")}
        />
        <span className="text-gray-700 dark:text-zinc-300">30 minutes</span>
      </label>
      <label className="inline-flex items-center gap-2 cursor-pointer w-full">
        <input
          type="radio"
          name="reminder"
          className="accent-amber-400 dark:accent-emerald-400"
          checked={reminderOption === "custom"}
          onChange={() => setReminderOption("custom")}
        />
        <span className="text-gray-700 dark:text-zinc-300">Custom:</span>
        <input
          ref={customRef}
          type="number"
          min={1}
          max={1440}
          step={1}
          value={customMinutes}
          onChange={(e) => {
            const v = e.target.valueAsNumber;
            if (Number.isNaN(v)) {
              setCustomMinutes("");
              return;
            }
            const clamped = Math.max(1, Math.min(1440, v));
            setCustomMinutes(clamped);
          }}
          onClick={() => setReminderOption("custom")}
          className={`ml-1 w-24 border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 dark:focus:border-emerald-400 dark:focus:ring-emerald-400 ${
            reminderOption === "custom"
              ? "bg-white border-gray-300 dark:bg-slate-900/50 dark:border-slate-600"
              : "bg-gray-100 border-gray-200 cursor-pointer dark:bg-slate-800/50 dark:border-slate-700"
          }`}
          readOnly={reminderOption !== "custom"}
          placeholder="minutes"
        />
      </label>
    </div>
  );
};

export default ReminderRadioButtons;
