import React, { useState, useEffect } from "react";
import "./Smoke.css";

export default function SmokeDemo() {
  const [puffs, setPuffs] = useState([]);

  // Mouse move → small smoke puff
  const handleMouseMove = (e) => {
    const newPuff = {
      id: Date.now(),
      x: e.clientX,
      y: e.clientY,
    };
    setPuffs((prev) => [...prev, newPuff]);

    setTimeout(() => {
      setPuffs((prev) => prev.filter((p) => p.id !== newPuff.id));
    }, 1000);
  };

  // Add global mouse move listener
  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div className="smoke-area">
      {puffs.map((puff) => (
        <div
          key={puff.id}
          className="smoke puff"
          style={{ left: puff.x, top: puff.y }}
        />
      ))}
    </div>
  );
}
