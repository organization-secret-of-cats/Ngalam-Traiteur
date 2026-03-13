import { ChefHat } from "lucide-react";
import Image from "next/image";

import CHEF from '../assets/chef.png';

export default function AboutSection() {
    return (
        <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <div className="flex justify-center mb-4">
                        <ChefHat className="text-amber-700" size={48} />
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                        À propos de nous
                    </h2>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                    <div className="relative w-full max-w-[450px] aspect-square mx-auto lg:mx-0">
                        <Image
                            src={CHEF.src}
                            alt="Chef Ngalam Traiteur"
                            fill
                            className="object-cover rounded-2xl shadow-xl"
                            sizes="(max-width: 1024px) 100vw, 450px"
                        />
                    </div>

                    <div className="max-w-xl">
                        <h2 className="text-3xl font-semibold text-gray-900 mb-6">
                            Une passion au service de vos événements
                        </h2>

                        <p className="text-gray-600 text-lg leading-relaxed mb-6">
                            <strong>Forts de plus de 10 ans d'expérience dans le domaine culinaire</strong>, mon équipe et moi
                            mettons notre savoir-faire et notre passion au service de votre événement. Chaque
                            prestation est pensée avec soin afin de créer une expérience gastronomique à la
                            hauteur de vos attentes.
                        </p>

                        <p className="text-gray-600 text-lg leading-relaxed">
                            <strong>Notre objectif est simple</strong> : vous permettre de vivre votre événement exactement
                            comme vous l'aviez imaginé. Votre satisfaction est au cœur de notre engagement
                            et guide chacune de nos créations culinaires.
                        </p>
                    </div>

                </div>
            </div>
        </section>
    )
}