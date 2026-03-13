import { useEffect, useState } from 'react';
import { ChefHat, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import styles from './DishesSection.module.css'
import { dishes } from '../data/dishes';
import Image from 'next/image';

type Category =
  | 'Plats principaux'
  | 'Cocktails'
  | 'Entrées et salades'
  | 'Desserts et Pièces montées';

export interface Dish {
  id: number;
  name: string;
  category: Category;
  image: string;
}

const categories: Category[] = [
  'Plats principaux',
  'Cocktails',
  'Entrées et salades',
  'Desserts et Pièces montées',
];

export default function DishesSection() {
  const [selectedDish, setSelectedDish] = useState<Dish | null>(null);

  const [visibleCount, setVisibleCount] = useState<Record<string, number>>({
    'Plats principaux': 6,
    'Cocktails': 6,
    'Entrées et salades': 6,
    'Desserts': 6,
    'Pièces montées': 6,
  });

  const showMore = (category: Category) => {
    setVisibleCount((prev) => ({
      ...prev,
      [category]: prev[category] + 6,
    }));
  };

  useEffect(() => {
    if (!selectedDish) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedDish(null);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [selectedDish]);

  return (
    <section className="pt-10 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="flex justify-center mb-4">
            <ChefHat className="text-amber-700" size={48} />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Nos Plats Signature
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Découvrez notre sélection de plats préparés avec passion et des ingrédients de qualité
          </p>
        </div>

        <div>
          {categories.map((category, index) => {
            const filtered = dishes.filter((d) => d.category === category);
            if (filtered.length === 0) return null;

            const visible = filtered.slice(0, visibleCount[category]);

            return (
              <div key={index} className="mb-20">
                <h3 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                  {category}
                </h3>

                <div className={styles.masonry}>
                  {visible.map((dish, index2) => (
                    <motion.button
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.35 }}
                      key={index2}
                      onClick={() => setSelectedDish(dish)}
                      className={styles['masonry-item'] + ' min-h-[260px] group relative overflow-hidden rounded-xl'}
                    >
                      <Image
                        src={`/photos/1/${dish.image}`}
                        alt={dish.name}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        fill
                      />
                      <div className="absolute inset-0 flex items-end p-5 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-90 group-hover:opacity-100 transition">
                        <h4 className="text-white text-xl font-semibold tracking-wide">{dish.name}</h4>
                      </div>
                    </motion.button>
                  ))}
                </div>

                {visible.length < filtered.length && (
                  <div className="text-center mt-6">
                    <button
                      onClick={() => showMore(category)}
                      className="mt-4 px-8 py-3 rounded-full bg-amber-700 text-white font-medium tracking-wide hover:bg-amber-800 hover:scale-105 transition"
                    >
                      Afficher plus
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <AnimatePresence>
        {selectedDish && (
          <motion.div
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedDish(null)}
          >
            <motion.div
              className="relative w-full max-w-5xl"
              initial={{ opacity: 0, scale: 0.92, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setSelectedDish(null)}
                className="absolute -top-3 -right-3 sm:top-4 sm:right-4 z-10 bg-white/90 hover:bg-white text-gray-900 rounded-full p-2 shadow-lg transition"
                aria-label="Fermer l'image"
              >
                <X size={22} />
              </button>

              <div className="overflow-hidden rounded-2xl bg-white shadow-2xl">
                <div className="bg-black">
                  <img
                    src={`/photos/1/${selectedDish.image}`}
                    alt={selectedDish.name}
                    className="w-full max-h-[55vh] sm:max-h-[70vh] object-contain"
                  />
                </div>

                <div className="p-4 sm:p-6">
                  <span className="inline-block text-amber-700 text-sm font-semibold mb-2">
                    {selectedDish.category}
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                    {selectedDish.name}
                  </h3>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}