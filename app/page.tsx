"use client";

import { useRef } from "react";
import Header from "@/src/components/Header";
import Carousel from "@/src/components/Carousel";
import DishesSection from "@/src/components/DishesSection";
import ContactSection from "@/src/components/ContactSection";
import Footer from "@/src/components/Footer";
import Services from "@/src/components/Services";

export default function Home() {
  const homeRef = useRef<HTMLDivElement>(null);
  const dishesRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);

  const handleNavigate = (section: string) => {
    const refs = {
      home: homeRef,
      dishes: dishesRef,
      contact: contactRef,
    };

    const targetRef = refs[section as keyof typeof refs];
    if (targetRef?.current) {
      const yOffset = -80;
      const y =
        targetRef.current.getBoundingClientRect().top +
        window.pageYOffset +
        yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header onNavigate={handleNavigate} />

      <main className="pt-20">
        <div ref={homeRef}>
          <Carousel />

          <section className="bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <Services />
              </div>
            </div>
          </section>
        </div>

        <div ref={dishesRef}>
          <DishesSection />
        </div>

        <div ref={contactRef}>
          <ContactSection />
        </div>
      </main>

      <Footer />
    </div>
  );
}
