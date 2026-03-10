import { ChefHat } from 'lucide-react';

interface Menu {
  id: number;
  name: string;
  description: string;
  items: string[];
}

const menus: Menu[] = [
  {
    id: 1,
    name: 'Menu Classique',
    description: 'Parfait pour vos réunions familiales',
    items: [
      'Assortiment de canapés',
      'Saumon fumé et ses blinis',
      'Poulet rôti aux herbes',
      'Gratin dauphinois',
      'Salade de saison',
      'Plateau de fromages',
      'Dessert du jour',
    ],
  },
  {
    id: 2,
    name: 'Menu Prestige',
    description: 'Pour vos événements exceptionnels',
    items: [
      'Foie gras maison',
      'Huîtres fraîches',
      'Tournedos Rossini',
      'Homard grillé',
      'Légumes de saison',
      'Sélection de fromages affinés',
      'Pièce montée ou entremet',
    ],
  },
  {
    id: 3,
    name: 'Menu Cocktail',
    description: 'Idéal pour vos réceptions',
    items: [
      'Verrines apéritives variées',
      'Mini-brochettes gourmandes',
      'Petits fours salés',
      'Tartines créatives',
      'Wraps et sandwichs gourmet',
      'Macarons et mignardises',
    ],
  },
];

export default function MenusSection() {
  return (
    <section className="py-20 bg-gradient-to-b from-white to-amber-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="flex justify-center mb-4">
            <ChefHat className="text-amber-700" size={48} />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Nos Menus
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Des menus élaborés avec soin pour satisfaire tous les goûts et toutes les occasions
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {menus.map((menu) => (
            <div
              key={menu.id}
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              <div className="bg-gradient-to-r from-amber-600 to-amber-700 text-white p-6">
                <h3 className="text-2xl font-bold mb-2">{menu.name}</h3>
                <p className="text-amber-100 mb-3">{menu.description}</p>
              </div>
              <div className="p-6">
                <ul className="space-y-3">
                  {menu.items.map((item, index) => (
                    <li key={index} className="flex items-start border-b border-gray-200 pb-3">
                      <span className="text-amber-600 mr-2">•</span>
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
