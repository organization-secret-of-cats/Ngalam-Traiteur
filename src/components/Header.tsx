import { Menu, X } from 'lucide-react';
import { useState } from 'react';

import ICON_SERVICE from "../icons/service.png";

interface HeaderProps {
  onNavigate: (section: string) => void;
}

export default function Header({ onNavigate }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { label: 'Accueil', value: 'home' },
    { label: 'Nos Plats', value: 'dishes' },
    { label: 'À propos', value: 'about' },
    { label: 'Contact', value: 'contact' },
  ];

  const handleNavClick = (section: string) => {
    onNavigate(section);
    setIsMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm shadow-sm z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <button
            onClick={() => handleNavClick('home')}
            className="text-2xl font-bold text-amber-700 hover:text-amber-600 transition-colors flex items-center"
          >
            <img src={ICON_SERVICE.src} alt="Ngalam Traiteur" className="h-12 w-12 mr-2" />
            Ngalam Traiteur
          </button>

          <nav className="hidden md:flex space-x-8">
            {navItems.map((item) => (
              <button
                key={item.value}
                onClick={() => handleNavClick(item.value)}
                className="text-gray-700 hover:text-amber-700 font-medium transition-colors"
              >
                <span className={`${item.value === "contact" ? "text-white bg-amber-700 px-3 py-1 rounded-full" : ""}`}>{item.label}</span>
              </button>
            ))}
          </nav>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-gray-700 hover:text-amber-700"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <nav className="px-4 py-4 space-y-3">
            {navItems.map((item) => (
              <button
                key={item.value}
                onClick={() => handleNavClick(item.value)}
                className={`block w-full text-left text-gray-700 hover:text-amber-700 font-medium py-2 transition-colors`}
              >
                <span className={`${item.value === "contact" ? "text-white bg-amber-700 px-3 py-1 rounded-full" : ""}`}>{item.label}</span>
              </button>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
