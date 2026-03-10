import { useEffect, useState } from 'react';
import { Utensils, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

interface Dish {
  id: number;
  name: string;
  category: string;
  image: string;
  description: string;
}

const dishes: Dish[] = [
  {
    id: 1,
    name: 'Saumon en Croûte',
    category: 'Poisson',
    image: 'https://images.pexels.com/photos/3551717/pexels-photo-3551717.jpeg?auto=compress&cs=tinysrgb&w=800',
    description: 'Saumon frais en croûte de pâte feuilletée avec épinards',
  },
  {
    id: 2,
    name: 'Filet de Bœuf',
    category: 'Viande',
    image: 'https://images.pexels.com/photos/769289/pexels-photo-769289.jpeg?auto=compress&cs=tinysrgb&w=800',
    description: 'Filet de bœuf tendre accompagné de sa sauce au poivre',
  },
  {
    id: 3,
    name: 'Plateau de Fromages',
    category: 'Fromages',
    image: 'https://images.pexels.com/photos/821365/pexels-photo-821365.jpeg?auto=compress&cs=tinysrgb&w=800',
    description: 'Sélection de fromages français affinés',
  },
  {
    id: 4,
    name: 'Tartelettes Salées',
    category: 'Entrées',
    image: 'https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg?auto=compress&cs=tinysrgb&w=800',
    description: 'Assortiment de tartelettes aux saveurs variées',
  },
  {
    id: 5,
    name: 'Pavlova aux Fruits',
    category: 'Desserts',
    image: 'https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg?auto=compress&cs=tinysrgb&w=800',
    description: 'Meringue croustillante garnie de fruits frais',
  },
  {
    id: 6,
    name: 'Verrines Gourmandes',
    category: 'Entrées',
    image: 'https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg?auto=compress&cs=tinysrgb&w=800',
    description: 'Verrines créatives pour vos apéritifs',
  },
];

export default function DishesSection() {
  const [selectedDish, setSelectedDish] = useState<Dish | null>(null);

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
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="flex justify-center mb-4">
            <Utensils className="text-amber-700" size={48} />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Nos Plats Signature
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Découvrez notre sélection de plats préparés avec passion et des ingrédients de qualité
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {dishes.map((dish) => (
            <button
              key={dish.id}
              type="button"
              onClick={() => setSelectedDish(dish)}
              className="group relative overflow-hidden rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 text-left w-full focus:outline-none focus:ring-4 focus:ring-amber-300"
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={dish.image}
                  alt={dish.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>

              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end p-6">
                <span className="text-amber-400 text-sm font-semibold mb-2">
                  {dish.category}
                </span>
                <h3 className="text-white text-2xl font-bold mb-2">{dish.name}</h3>
                <p className="text-gray-200">{dish.description}</p>
              </div>
            </button>
          ))}
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
                    src={selectedDish.image}
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
                  <p className="text-gray-600 text-sm sm:text-base">
                    {selectedDish.description}
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}