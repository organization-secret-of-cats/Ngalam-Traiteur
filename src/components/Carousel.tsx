"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";

import IMG1 from "../assets/carousel1.jpg";
import IMG2 from "../assets/carousel2.png";
import IMG3 from "../assets/carousel3.jpg";

const slides = [
  {
    id: 1,
    image: IMG1,
    title: "Cuisine Gastronomique",
    description: "Des plats raffinés pour vos événements les plus prestigieux",
  },
  {
    id: 2,
    image: IMG2,
    title: "Buffets Élégants",
    description: "Des buffets variés et colorés pour tous vos événements",
  },
  {
    id: 3,
    image: IMG3,
    title: "Desserts Exquis",
    description: "Une touche sucrée pour terminer en beauté",
  },
];

export default function Carousel() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () =>
    setCurrentSlide((prev) => (prev + 1) % slides.length);

  const prevSlide = () =>
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const slide = slides[currentSlide];

  return (
    <div className="relative h-[600px] w-full overflow-hidden">

      <Image
        src={slide.image}
        alt={slide.title}
        fill
        priority
        className="object-cover transition-opacity duration-700"
      />

      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
        <div className="text-center text-white px-4 max-w-3xl">
          <h2 className="text-5xl md:text-6xl font-bold mb-4">
            {slide.title}
          </h2>
          <p className="text-xl md:text-2xl">
            {slide.description}
          </p>
        </div>
      </div>

      <button
        onClick={prevSlide}
        className="absolute left-4 bottom-6 md:top-1/2 md:-translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-2 md:p-2.5 rounded-full transition"
      >
        <ChevronLeft size={24} />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-4 bottom-6 md:top-1/2 md:-translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-2 md:p-2.5 rounded-full transition"
      >
        <ChevronRight size={24} />
      </button>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`h-3 rounded-full transition-all ${index === currentSlide
              ? "bg-white w-8"
              : "bg-white/50 w-3"
              }`}
          />
        ))}
      </div>
    </div>
  );
}