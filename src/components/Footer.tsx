import { Facebook, Instagram, Mail, Phone } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-2xl font-bold text-amber-500 mb-4">
              Ngalam Traiteur
            </h3>
            <p className="text-gray-400 leading-relaxed">
              Votre partenaire gastronomique pour tous vos événements.
            </p>
          </div>

          <div>

          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Rapide</h4>
            <div className="flex flex-col sm:flex-row gap-4">
              <span className="flex items-center text-gray-400">
                <Phone size={18} className="mr-2" />

                <span className="flex flex-col gap-1">
                  <a
                    href="tel:+33666030342"
                    className="text-gray-400 hover:text-amber-500 transition-colors"
                  >
                    +33 6 66 03 03 42
                  </a>

                  <a
                    href="tel:+33626767523"
                    className="text-gray-400 hover:text-amber-500 transition-colors"
                  >
                    +33 6 26 76 75 23
                  </a>
                </span>
              </span>

              <a
                href="mailto:ndiayeaboubakry@gmail.com"
                className="flex items-center text-gray-400 hover:text-amber-500 transition-colors"
              >
                <Mail size={18} className="mr-2" />
                ndiayeaboubakry@gmail.com
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2004 - {new Date().getFullYear()} Ngalam Traiteur. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
}
