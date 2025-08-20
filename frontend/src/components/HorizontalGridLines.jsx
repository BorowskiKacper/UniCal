const HorizontalGridLines = () => {
  return (
    <div className="absolute inset-0 grid grid-rows-24 h-full w-full pointer-events-none">
      {[...Array(24)].map((_, index) => (
        <div
          key={`Item-${index}`}
          className="border-b border-slate-700/30 last:border-b-0"
        />
      ))}
    </div>
  );
};

export default HorizontalGridLines;
