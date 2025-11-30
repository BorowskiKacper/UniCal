import { useState, useEffect } from "react";

const useMouseClickPosition = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const updatePosition = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
      console.log(e.clientX, e.clientY); //DELETE THIS
    };

    window.addEventListener("click", updatePosition);

    return () => {
      window.removeEventListener("click", updatePosition);
    };
  }, []);

  return position;
};

export default useMouseClickPosition;
