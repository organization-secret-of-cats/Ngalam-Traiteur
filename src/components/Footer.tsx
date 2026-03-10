import { Facebook, Instagram, Mail, Phone } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-2xl font-bold text-amber-500 mb-4">
              Le Délice Traiteur
            </h3>
            <p className="text-gray-400 leading-relaxed">
              Votre partenaire gastronomique pour tous vos événements.
              Depuis plus de 15 ans, nous mettons notre passion au service de vos moments précieux.
            </p>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Rapide</h4>
            <div className="space-y-3">
              <a
                href="tel:+33123456789"
                className="flex items-center text-gray-400 hover:text-amber-500 transition-colors"
              >
                <Phone size={18} className="mr-2" />
                +33 1 23 45 67 89
              </a>
              <a
                href="mailto:contact@ledelice-traiteur.fr"
                className="flex items-center text-gray-400 hover:text-amber-500 transition-colors"
              >
                <Mail size={18} className="mr-2" />
                contact@ledelice-traiteur.fr
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Suivez-Nous</h4>
            <div className="flex gap-4">
              <a
                href="#"
                className="bg-gray-800 p-3 rounded-full hover:bg-amber-600 transition-colors"
                aria-label="Facebook"
              >
                <Facebook size={20} />
              </a>
              <a
                href="#"
                className="bg-gray-800 p-3 rounded-full hover:bg-amber-600 transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 Ngalam Traiteur. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
}
