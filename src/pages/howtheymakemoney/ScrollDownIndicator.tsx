import React, { useEffect, useState } from 'react';
import './ScrollDownIndicator.css';

const ScrollDownIndicator: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      // Get current scroll position
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      
      // Get total scrollable height
      const scrollHeight = document.documentElement.scrollHeight;
      
      // Get viewport height
      const clientHeight = document.documentElement.clientHeight;

      // Calculate how close to bottom (within 20px of bottom)
      const isBottom = scrollTop + clientHeight >= scrollHeight - 500;
      
      // Hide when at bottom or when scrolled past first view
      setIsVisible(scrollTop < scrollHeight && !isBottom);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      className={`fixed bottom-10 left-1/2 transform -translate-x-1/2 p-4 rounded-full text-white transition-opacity duration-300 ${
        isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
    >
      <div className="containerarrow">
        <div className="chevron"></div>
        <div className="chevron"></div>
        <div className="chevron"></div>
      </div>
    </div>
  );
};

export default ScrollDownIndicator;