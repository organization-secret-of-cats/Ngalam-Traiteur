"use client";

import { useRef } from "react";
import Header from "@/src/components/Header";
import Carousel from "@/src/components/Carousel";
import MenusSection from "@/src/components/MenusSection";
import DishesSection from "@/src/components/DishesSection";
import ContactSection from "@/src/components/ContactSection";
import Footer from "@/src/components/Footer";

export default function Home() {
  const homeRef = useRef<HTMLDivElement>(null);
  const menusRef = useRef<HTMLDivElement>(null);
  const dishesRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);

  const handleNavigate = (section: string) => {
    const refs = {
      home: homeRef,
      menus: menusRef,
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
        </div>

        <div ref={menusRef}>
          <MenusSection />
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
