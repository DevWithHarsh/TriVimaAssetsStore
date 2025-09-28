import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react';

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  // Sample slide data - replace with your actual content
  const slides = [
    {
      id: 1,
      title: "GET GOOD AT 3D ART",
      subtitle: "CREATE GAME-READY ASSETS",
      cta: "CLICK TO START YOUR 3D JOURNEY",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      image: "/api/placeholder/400/300" // Replace with your 3D character images
    },
    {
      id: 2,
      title: "PROFESSIONAL 3D MODELS",
      subtitle: "HIGH-QUALITY DIGITAL ASSETS",
      cta: "EXPLORE OUR COLLECTION",
      background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
      image: "/api/placeholder/400/300"
    },
    {
      id: 3,
      title: "INSTANT DOWNLOAD",
      subtitle: "READY-TO-USE 3D CONTENT",
      cta: "START CREATING TODAY",
      background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
      image: "/api/placeholder/400/300"
    }
  ];

  // Auto-play functionality
  useEffect(() => {
    if (!isPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isPlaying, slides.length]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="relative h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden rounded-lg shadow-2xl">
      {/* Slides Container */}
      <div 
        className="flex transition-transform duration-700 ease-in-out h-full"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className="min-w-full h-full relative flex items-center justify-center"
            style={{ background: slide.background }}
          >
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 transform rotate-12 scale-150"></div>
              <div className="absolute top-0 left-0 w-32 h-32 bg-yellow-400 rounded-full transform -translate-x-16 -translate-y-16"></div>
              <div className="absolute bottom-0 right-0 w-40 h-40 bg-yellow-500 rounded-full transform translate-x-20 translate-y-20"></div>
            </div>

            {/* Content Container */}
            <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
              {/* Main Title */}
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-black mb-4 tracking-tight">
                <span className="text-yellow-400 drop-shadow-lg">
                  {slide.title.split(' ').slice(0, 2).join(' ')}
                </span>
                <br />
                <span className="text-white drop-shadow-lg">
                  {slide.title.split(' ').slice(2).join(' ')}
                </span>
              </h1>

              {/* Subtitle */}
              <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-8 text-white drop-shadow-lg">
                {slide.subtitle}
              </h2>

              {/* CTA Button */}
              <button className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold text-lg md:text-xl px-8 py-4 rounded-full transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl">
                {slide.cta}
              </button>

              {/* Decorative Elements */}
              <div className="absolute -top-10 -left-10 w-20 h-20 bg-yellow-400 rounded-full opacity-20 animate-pulse"></div>
              <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-yellow-500 rounded-full opacity-20 animate-pulse delay-1000"></div>
            </div>

            
          </div>
        ))}
      </div>

      {/* Navigation Controls - Bottom Left */}
      <div className="absolute bottom-6 left-4 flex items-center space-x-2">
        <button
          onClick={prevSlide}
          className="p-3 bg-black bg-opacity-50 hover:bg-opacity-75 text-white rounded-full transition-all duration-300 hover:scale-110"
          aria-label="Previous slide"
        >
          <ChevronLeft size={20} />
        </button>
        
        <button
          onClick={togglePlayPause}
          className="p-3 bg-black bg-opacity-50 hover:bg-opacity-75 text-white rounded-full transition-all duration-300"
          aria-label={isPlaying ? 'Pause slideshow' : 'Play slideshow'}
        >
          {isPlaying ? <Pause size={18} /> : <Play size={18} />}
        </button>
      </div>

      {/* Next Button - Bottom Right */}
      <div className="absolute bottom-6 right-4">
        <button
          onClick={nextSlide}
          className="p-3 bg-black bg-opacity-50 hover:bg-opacity-75 text-white rounded-full transition-all duration-300 hover:scale-110"
          aria-label="Next slide"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Dot Indicators */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              currentSlide === index 
                ? 'bg-yellow-400 scale-125 shadow-lg' 
                : 'bg-white bg-opacity-50 hover:bg-opacity-75'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-black bg-opacity-20">
        <div
          className="h-full bg-yellow-400 transition-all duration-300"
          style={{ width: `${((currentSlide + 1) / slides.length) * 100}%` }}
        />
      </div>
    </div>
  );
};

export default Hero;