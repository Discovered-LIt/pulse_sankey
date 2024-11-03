import React, { useEffect, useState } from 'react';
import './DollarBreakdown.css';

interface Section {
  width: number;
  color: string;
  labelTop?: string;
  labelBottom?: string;
  percentage: string;
  svg: string;
}

const DollarBreakdown: React.FC = () => {
  const [scrollStage, setScrollStage] = useState(0);
  const [focusedSection, setFocusedSection] = useState(-1);

  const sections: Section[] = [
    { width: 24, color: '#FF7F7F', labelTop: 'HEALTH INSURANCE', percentage: '24%', svg: '/dollarbill-24.svg' },
    { width: 21, color: '#2E3192', labelTop: 'SOCIAL SECURITY', labelBottom: 'INTEREST ON DEBT', percentage: '21%', svg: '/dollarbill-21-1.svg' },
    { width: 21, color: '#39B54A', labelTop: 'SOCIAL SECURITY', percentage: '21%', svg: '/dollarbill-21-2.svg' },
    { width: 10, color: '#ED1C24', labelBottom: '10%', percentage: '10%', svg: '/dollarbill-10-1.svg' },
    { width: 10, color: '#FFD700', labelBottom: 'DEFENSE', percentage: '10%', svg: '/dollarbill-10-2.svg' },
    { width: 5, color: '#FFFFFF', labelBottom: 'DEFENSE', percentage: '5%', svg: '/dollarbill-5.svg' },
  ];

  useEffect(() => {
    const container = document.querySelector('.dollarbreakdown-scrollable-sankey-container');
    const handleScroll = () => {
      if (!container) return;
      const scrollPosition = container.scrollTop;
      const containerHeight = container.clientHeight;
      const scrollPercentage = (scrollPosition / (containerHeight * 2)) * 100;
      const updateStages = () => {
        if (scrollPercentage < 20) {
          setScrollStage(0);
          setFocusedSection(-1);
        } else if (scrollPercentage < 40) {
          setScrollStage(1);
          setFocusedSection(-1);
        } else {
          setScrollStage(2);
          const sectionIndex = Math.floor((scrollPercentage - 40) / 10);
          setFocusedSection(Math.min(sectionIndex, sections.length - 1));
        }
      };
      requestAnimationFrame(updateStages);
    };
    if (container) {
      container.addEventListener('scroll', handleScroll, { passive: true });
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, [sections.length]);

  return (
    <div className="dollarbreakdown-outer-container bg-black">
      {/* SVG Filter Definition */}
      <div className="dollarbreakdown-svg-filters">
        <svg>
          <defs>
            {/* Define subtle neon pattern with fractal noise */}
            <filter id="dollarbreakdown-neonFractal" x="0%" y="0%" width="100%" height="100%">
              {/* Fractal noise generation */}
              <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="3" result="turbulence" />

              {/* Subtle displacement */}
              <feDisplacementMap in="SourceGraphic" in2="turbulence" scale="5" />

              {/* Projected neon color patterns */}
              <feColorMatrix
                type="matrix"
                values="1 0 0 0 0.4
                        0 1 0 0 0.7
                        0 0 1 0 1
                        0 0 0 1 0" />
              
              {/* Blend the neon colors with the original image */}
              <feBlend in="SourceGraphic" in2="turbulence" mode="overlay" />
            </filter>
          </defs>
        </svg>
      </div>

      <div className="dollarbreakdown-scrollable-sankey-container">
        <div className="dollarbreakdown-scrollable-content">
          <div className="dollarbreakdown-fixed-content">
            <div className="dollarbreakdown-dollar-container">
              <div 
                className="transition-all duration-500"
                style={{ opacity: scrollStage === 0 ? 1 : 0, position: 'absolute', width: '100%' }}
              >
                <img 
                  src="/dollarbill.svg" 
                  alt="Dollar Bill" 
                  className="w-full h-auto dollarbreakdown-dollarbill-effect" 
                  style={{ filter: 'url(#dollarbreakdown-neonFractal)' }}
                />
              </div>
              
              <div className="transition-all duration-500" style={{ opacity: scrollStage > 0 ? 1 : 0, position: 'relative' }}>
                <div className="dollarbreakdown-segments-container">
                  {sections.map((section, index) => {
                    const isFocused = scrollStage === 2 && focusedSection === index;
                    const baseTransform = scrollStage === 1 ? 0 : (isFocused ? 40 : 0);

                    return (
                      <div
                        key={index}
                        className={`dollarbreakdown-segment transition-all duration-500 dollarbreakdown-fractal-effect 
                                   dollarbreakdown-glow-effect ${isFocused ? 'focused ambient-light' : ''}`}
                        style={{
                          width: `${section.width}%`,
                          transform: `translateY(${baseTransform}px) scale(${isFocused ? 1.1 : 1})`,
                          zIndex: isFocused ? 10 : 1,
                          opacity: scrollStage === 2 && !isFocused ? 0.3 : 1,
                          position: 'relative'
                        }}
                      >
                        <img
                          src={section.svg}
                          alt={`Section ${index + 1}`}
                          className="dollarbreakdown-svg-section"
                          style={{
                            filter: 'url(#dollarbreakdown-neonFractal)',
                            height: '100%',
                            width: '100%',
                            objectFit: 'contain',
                            objectPosition: 'center'
                          }}
                        />
                        <div 
                          className="absolute w-full text-center transition-opacity duration-300" 
                          style={{ opacity: isFocused ? 1 : 0 }}
                        >
                          {section.labelTop && (
                            <div className="absolute -top-12 w-full dollarbreakdown-shadow-glow">
                              <div className="text-white font-mono">{section.labelTop}</div>
                              <div className="text-white font-mono mt-2">{section.percentage}</div>
                            </div>
                          )}
                          {section.labelBottom && (
                            <div className="absolute -bottom-12 w-full dollarbreakdown-shadow-glow">
                              <div className="text-white font-mono">{section.percentage}</div>
                              <div className="text-white font-mono mt-2">{section.labelBottom}</div>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DollarBreakdown;
