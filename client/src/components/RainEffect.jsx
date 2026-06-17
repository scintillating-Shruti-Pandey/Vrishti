import { useEffect, useRef } from 'react';
import './RainEffect.css';

export default function RainEffect({ intensity = 80 }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Clear existing drops
    container.innerHTML = '';

    // Create rain drops
    for (let i = 0; i < intensity; i++) {
      const drop = document.createElement('div');
      drop.className = 'rain-drop';

      // Random properties
      const left = Math.random() * 100;
      const delay = Math.random() * 3;
      const duration = 1.5 + Math.random() * 1;
      const opacity = 0.2 + Math.random() * 0.4;
      const width = 1 + Math.random() * 1.5;
      const height = 15 + Math.random() * 20;

      drop.style.cssText = `
        left: ${left}%;
        animation-delay: ${delay}s;
        animation-duration: ${duration}s;
        opacity: ${opacity};
        width: ${width}px;
        height: ${height}px;
      `;

      container.appendChild(drop);
    }

    return () => {
      container.innerHTML = '';
    };
  }, [intensity]);

  return <div className="rain-container" ref={containerRef} aria-hidden="true" />;
}
