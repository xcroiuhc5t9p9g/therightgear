import React, { useState, useEffect } from 'react';
import { HomepageSpotlight as SpotlightType } from '../types';
import { Container } from './ui-blocks';
import { ChevronLeft, ChevronRight, Pause, Play, ArrowRight } from 'lucide-react';

interface HomepageSpotlightProps {
  spotlights: SpotlightType[];
  onNavigate: (page: string, params?: any) => void;
}

export const HomepageSpotlight: React.FC<HomepageSpotlightProps> = ({ spotlights, onNavigate }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  // Auto-play
  useEffect(() => {
    if (!isPlaying || spotlights.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % spotlights.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [isPlaying, spotlights.length]);

  if (!spotlights.length) {
    // Honest fallback if no spotlights configured
    return (
      <section className="bg-white border-b border-trg-gray-200 py-16">
        <Container className="text-center">
          <p className="text-sm font-bold tracking-widest text-trg-gray-400 uppercase mb-4">Spotlight Integration</p>
          <h2 className="text-2xl font-bold text-trg-carbon mb-2">Editorial Spotlight</h2>
          <p className="text-trg-gray-500">Spotlight content management system pending integration.</p>
        </Container>
      </section>
    );
  }

  const current = spotlights[currentIndex];

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + spotlights.length) % spotlights.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % spotlights.length);
  };

  const handleAction = () => {
    if (current.targetUrl) {
      window.location.href = current.targetUrl;
    } else if (current.targetType === 'EDITORIAL' && current.targetId) {
      // Prototype canonical route derivation
      // In a real implementation this would use a canonical routing service
      onNavigate('home'); // Fallback for demo
    } else if (current.targetId) {
       onNavigate('home'); // Generic fallback
    }
  };

  return (
    <section className="bg-trg-warm-white border-b border-trg-gray-200 relative overflow-hidden">
      <div className="flex flex-col lg:flex-row w-full min-h-[500px] lg:min-h-[600px]">
        
        {/* Mobile: Image First / Desktop: Image Right (order-last lg:order-last) but let's do text left, image right */}
        <div className="lg:w-1/2 flex flex-col justify-center px-6 py-12 lg:px-16 lg:py-20 z-10 order-2 lg:order-1">
          <div className="max-w-xl mx-auto lg:mx-0 w-full">
            <div className="flex items-center justify-between mb-6">
              <span className="text-xs font-bold tracking-widest text-trg-red uppercase">
                {current.eyebrow}
              </span>
              
              {/* Controls */}
              {spotlights.length > 1 && (
                <div className="flex items-center gap-2">
                  <button onClick={() => setIsPlaying(!isPlaying)} className="p-2 text-trg-gray-400 hover:text-trg-carbon transition-colors" aria-label={isPlaying ? "Pause slideshow" : "Play slideshow"}>
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </button>
                  <div className="flex items-center gap-1 ml-2">
                    <button onClick={handlePrevious} className="p-2 bg-white border border-trg-gray-200 rounded-full text-trg-carbon hover:border-trg-gray-400 transition-colors" aria-label="Previous slide">
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button onClick={handleNext} className="p-2 bg-white border border-trg-gray-200 rounded-full text-trg-carbon hover:border-trg-gray-400 transition-colors" aria-label="Next slide">
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            <h1 className="text-3xl md:text-5xl font-bold text-trg-carbon tracking-tight leading-tight mb-6">
              {current.title}
            </h1>
            
            <p className="text-lg text-trg-gray-500 mb-8 leading-relaxed">
              {current.summary}
            </p>
            
            <button 
              onClick={handleAction}
              className="inline-flex items-center gap-2 px-6 py-3 bg-trg-carbon text-white font-bold rounded-lg hover:bg-trg-graphite transition-colors min-h-[44px]"
            >
              Discover <ArrowRight className="w-4 h-4" />
            </button>
            
            {/* Dots */}
            {spotlights.length > 1 && (
              <div className="flex items-center gap-2 mt-12">
                {spotlights.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentIndex(idx)}
                    className={`w-2 h-2 rounded-full transition-all ${idx === currentIndex ? 'bg-trg-red w-6' : 'bg-trg-gray-300'}`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Image */}
        <div className="lg:w-1/2 h-[300px] lg:h-auto relative order-1 lg:order-2 bg-trg-gray-200">
          <img 
            src={current.image} 
            alt={current.imageAlt}
            className="absolute inset-0 w-full h-full object-cover object-center"
          />
        </div>

      </div>
    </section>
  );
};
