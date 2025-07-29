const HorizontalGridLines = () => {
  return (
    <div className="absolute  grid grid-rows-24 bg-blue-50 h-full w-full">
      {[...Array(24)].map((_, index) => (
        <div key={`Item-${index}`} className="border-b-1 "></div>
      ))}
    </div>
  );
};

export default HorizontalGridLines;
