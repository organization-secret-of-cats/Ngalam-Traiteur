"use client";

import { Mail, Phone, MapPin, Send } from "lucide-react";
import { useState, FormEvent } from "react";
import styles from './ContactSection.module.css'

import ICON_CARD from "../icons/card.png";
import ICON_MONEY from "../icons/money.png";

export default function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    eventDate: "",
    guests: "",
    message: "",
  });
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const isSubmitted = status === "success";

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setStatus("error");
        setErrorMessage(data.error || "Erreur lors de l'envoi du message");
        return;
      }

      setStatus("success");
      setFormData({
        name: "",
        email: "",
        phone: "",
        eventDate: "",
        guests: "",
        message: "",
      });

      setTimeout(() => {
        setStatus("idle");
      }, 4000);
    } catch (error) {
      setStatus("error");
      setErrorMessage("Erreur de connexion au serveur");
      console.error("Submit error:", error);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <section className="py-20 bg-gradient-to-b from-amber-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-amber-700 mb-4">
            Faites votre
          </h2>
          <p className="text-4xl text-black font-bold max-w-2xl mx-auto">
            Réservation
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              Informations de Contact
            </h3>

            <div className="space-y-6">
              <div className="flex items-start">
                <div className="bg-amber-100 p-3 rounded-lg mr-4">
                  <Phone className="text-amber-700" size={24} />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Téléphone</h4>
                  <p className="text-gray-600">+33 6 66 03 03 42</p>
                  <p className="text-gray-600">+33 6 26 76 75 23</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-amber-100 p-3 rounded-lg mr-4">
                  <Mail className="text-amber-700" size={24} />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Email</h4>
                  <p className="text-gray-600">ndiayeaboubakry@gmail.com</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-amber-100 p-3 rounded-lg mr-4">
                  <MapPin className="text-amber-700" size={24} />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Adresse</h4>
                  <p className="text-gray-600">4 Chemin des princes</p>
                  <p className="text-gray-600">78870 Bailly, France</p>
                </div>
              </div>
            </div>

            <div style={{ marginTop: 30 }}>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Modalités de paiement
              </h3>
              <p className="text-gray-600 max-w-2xl mx-auto" style={{ marginTop: -20 }}>
                Uniquement sur devis.
              </p>

              <div className="space-y-6">
                <div className={styles.wrapper}>
                  <div className={styles.item}>
                    <div className={styles.circle}>
                      <img src={ICON_MONEY.src} alt="Espèces" className={styles.icon} />
                    </div>
                    <span className={styles.label}>Espèces</span>
                  </div>

                  <div className={styles.item}>
                    <div className={styles.circle}>
                      <img src={ICON_CARD.src} alt="Virement bancaire" className={styles.icon} />
                    </div>
                    <span className={styles.label}>Virement bancaire</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg">
              <div className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-gray-700 font-medium mb-2">
                    Nom complet *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-600 focus:border-transparent outline-none transition-all"
                    placeholder="Votre nom"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-600 focus:border-transparent outline-none transition-all"
                      placeholder="votre@email.fr"
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-gray-700 font-medium mb-2">
                      Téléphone
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-600 focus:border-transparent outline-none transition-all"
                      placeholder="06 12 34 56 78"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="eventDate" className="block text-gray-700 font-medium mb-2">
                      Date de l'événement
                    </label>
                    <input
                      type="date"
                      id="eventDate"
                      name="eventDate"
                      value={formData.eventDate}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-600 focus:border-transparent outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label htmlFor="guests" className="block text-gray-700 font-medium mb-2">
                      Nombre de convives
                    </label>
                    <input
                      type="number"
                      id="guests"
                      name="guests"
                      value={formData.guests}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-600 focus:border-transparent outline-none transition-all"
                      placeholder="50"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="block text-gray-700 font-medium mb-2">
                    Votre message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    value={formData.message}
                    onChange={handleChange}
                    rows={5}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-600 focus:border-transparent outline-none transition-all resize-none"
                    placeholder="Parlez-nous de votre événement..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-amber-600 to-amber-700 text-white font-semibold py-4 px-6 rounded-lg hover:from-amber-700 hover:to-amber-800 transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                >
                  <Send size={20} />
                  Envoyer la demande
                </button>

                {isSubmitted && (
                  <div className="p-4 bg-green-50 border border-green-200 text-green-800 rounded-lg text-center">
                    Merci pour votre message ! Nous vous répondrons très rapidement.
                  </div>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
