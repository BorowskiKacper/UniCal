const HorizontalLines = () => {
  return (
    <div className="grid grid-rows-24 h-full w-full pointer-events-none">
      {[...Array(24)].map((_, index) => (
        <div
          key={`Item-${index}`}
          className="border-b border-slate-700/30 dark:border-slate-400/30 last:border-b-0"
        />
      ))}
    </div>
  );
};

export default HorizontalLines;
