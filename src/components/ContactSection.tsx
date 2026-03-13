"use client";

import { Mail, Phone, MapPin, Send, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { useState, FormEvent, useRef, useEffect, useCallback } from "react";
import styles from './ContactSection.module.css'

import ICON_CARD from "../icons/card.png";
import ICON_MONEY from "../icons/money.png";

// ─── SPAM PROTECTION UTILITIES ──────────────────────────────────────────────

/** 1. Honeypot field — bots fill it, humans never see it */
const HONEYPOT_FIELD = "website";

/** 2. Rate-limit: max 3 submissions, then random 15–30 min cooldown */
const RATE_LIMIT = 3;
const RL_KEY = "contact_rl"; // { count, windowStart, cooldownMs }

interface RLData { count: number; windowStart: number; cooldownMs: number }

function randomCooldownMs(): number {
  const min = 15 * 60 * 1000;
  const max = 30 * 60 * 1000;
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRLData(): RLData {
  try {
    const raw = localStorage.getItem(RL_KEY);
    if (!raw) return { count: 0, windowStart: Date.now(), cooldownMs: randomCooldownMs() };
    return JSON.parse(raw) as RLData;
  } catch { return { count: 0, windowStart: Date.now(), cooldownMs: randomCooldownMs() }; }
}

function getRemainingCooldownMs(): number {
  const { count, windowStart, cooldownMs } = getRLData();
  if (count < RATE_LIMIT) return 0;
  const elapsed = Date.now() - windowStart;
  return Math.max(0, cooldownMs - elapsed);
}

function incrementRLCount() {
  try {
    const { count, windowStart, cooldownMs } = getRLData();
    const expired = Date.now() - windowStart >= cooldownMs;
    localStorage.setItem(RL_KEY, JSON.stringify({
      count: expired ? 1 : count + 1,
      windowStart: expired ? Date.now() : windowStart,
      cooldownMs: expired ? randomCooldownMs() : cooldownMs,
    }));
  } catch {}
}

function formatCountdown(ms: number): string {
  const totalSec = Math.ceil(ms / 1000);
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

/** 3. Time-gate: form must be visible for at least N ms before submit */
const MIN_FILL_TIME_MS = 3000; // 3 seconds

/** 4. Disposable email domains blocklist */
const DISPOSABLE_DOMAINS = [
  "mailinator.com","guerrillamail.com","10minutemail.com","tempmail.com",
  "throwam.com","yopmail.com","sharklasers.com","guerrillamailblock.com",
  "grr.la","guerrillamail.info","spam4.me","trashmail.com","trashmail.me",
  "trashmail.net","dispostable.com","maildrop.cc","spamgourmet.com",
];

function isDisposableEmail(email: string): boolean {
  const domain = email.split("@")[1]?.toLowerCase() || "";
  return DISPOSABLE_DOMAINS.includes(domain);
}

/** 5. Simple content validation — detect obvious spam patterns */
const SPAM_PATTERNS = [
  /\b(casino|viagra|crypto|bitcoin|nft|loan|prize|winner|click here|buy now)\b/i,
  /https?:\/\//gi, // no URLs in message
];

function hasSpamContent(text: string): boolean {
  return SPAM_PATTERNS.some((p) => p.test(text));
}

// ─── COMPONENT ──────────────────────────────────────────────────────────────

interface FormData {
  name: string;
  email: string;
  phone: string;
  eventDate: string;
  guests: string;
  message: string;
  [HONEYPOT_FIELD]: string; // honeypot
}

type Status = "idle" | "loading" | "success" | "error";

export default function ContactSection() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    eventDate: "",
    guests: "",
    message: "",
    [HONEYPOT_FIELD]: "",
  });

  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [cooldownRemaining, setCooldownRemaining] = useState<number>(() => getRemainingCooldownMs());

  const formLoadTime = useRef<number>(Date.now());
  const isSubmitted = status === "success";
  const isRateLimited = cooldownRemaining > 0;

  // Re-record load time when section mounts
  useEffect(() => {
    formLoadTime.current = Date.now();
  }, []);

  // Countdown ticker
  useEffect(() => {
    if (cooldownRemaining <= 0) return;
    const id = setInterval(() => {
      const remaining = getRemainingCooldownMs();
      setCooldownRemaining(remaining);
      if (remaining <= 0) clearInterval(id);
    }, 1000);
    return () => clearInterval(id);
  }, [cooldownRemaining > 0]);

  // ── Client-side validation ──────────────────────────────────────────────
  const validate = useCallback((): boolean => {
    const errors: Partial<Record<keyof FormData, string>> = {};

    if (!formData.name.trim() || formData.name.trim().length < 2)
      errors.name = "Veuillez entrer votre nom complet.";

    if (!formData.email.trim())
      errors.email = "L'email est requis.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      errors.email = "Format d'email invalide.";
    else if (isDisposableEmail(formData.email))
      errors.email = "Veuillez utiliser une adresse email permanente.";

    if (formData.phone && !/^[+\d\s\-()]{6,20}$/.test(formData.phone))
      errors.phone = "Numéro de téléphone invalide.";

    if (!formData.message.trim() || formData.message.trim().length < 10)
      errors.message = "Merci d'écrire un message d'au moins 10 caractères.";
    else if (hasSpamContent(formData.message))
      errors.message = "Votre message contient du contenu non autorisé.";

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }, [formData]);

  // ── Submit handler ──────────────────────────────────────────────────────
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Guard: honeypot
    if (formData[HONEYPOT_FIELD]) return;

    // Guard: time-gate
    if (Date.now() - formLoadTime.current < MIN_FILL_TIME_MS) {
      setStatus("error");
      setErrorMessage("Envoi trop rapide. Veuillez patienter un instant.");
      return;
    }

    // Guard: rate-limit with cooldown
    const remaining = getRemainingCooldownMs();
    if (remaining > 0) {
      setCooldownRemaining(remaining);
      return;
    }

    // Guard: client validation
    if (!validate()) return;

    setStatus("loading");
    setErrorMessage("");

    try {
      // Omit honeypot before sending
      const { [HONEYPOT_FIELD]: _hp, ...payload } = formData;

      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        setStatus("error");
        setErrorMessage(data.error || "Erreur lors de l'envoi du message.");
        return;
      }

      incrementRLCount();
      setCooldownRemaining(getRemainingCooldownMs());
      setStatus("success");
      setFormData({ name:"", email:"", phone:"", eventDate:"", guests:"", message:"", [HONEYPOT_FIELD]:"" });
      setFieldErrors({});

      setTimeout(() => setStatus("idle"), 5000);
    } catch (error) {
      setStatus("error");
      setErrorMessage("Erreur de connexion au serveur.");
      console.error("Submit error:", error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear per-field error on change
    if (fieldErrors[name as keyof FormData]) {
      setFieldErrors((prev) => ({ ...prev, [name]: undefined }));
    }
    if (status === "error") { setStatus("idle"); setErrorMessage(""); }
  };

  // ── Shared input className ──────────────────────────────────────────────
  const inputCls = (field: keyof FormData) =>
    `w-full px-4 py-3 rounded-xl border transition-all outline-none text-sm font-medium
    ${fieldErrors[field]
      ? "border-rose-400 bg-rose-50 focus:ring-2 focus:ring-rose-300"
      : focusedField === field
      ? "border-amber-500 bg-amber-50 ring-2 ring-amber-200"
      : "border-stone-200 bg-stone-50 hover:border-amber-300 focus:ring-2 focus:ring-amber-200 focus:border-amber-400"
    }`;

  return (
    <section className="relative py-24 overflow-hidden" style={{ background: "linear-gradient(160deg, #fdf8f0 0%, #fff7ed 40%, #ffffff 100%)" }}>

      {/* Decorative background blobs */}
      <div aria-hidden className="pointer-events-none absolute -top-32 -left-32 w-96 h-96 rounded-full opacity-20"
        style={{ background: "radial-gradient(circle, #f59e0b 0%, transparent 70%)" }} />
      <div aria-hidden className="pointer-events-none absolute -bottom-24 -right-24 w-80 h-80 rounded-full opacity-15"
        style={{ background: "radial-gradient(circle, #d97706 0%, transparent 70%)" }} />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Header ── */}
        <div className="text-center mb-20">
          <span className="inline-block text-xs font-bold tracking-[0.25em] uppercase text-amber-600 mb-4 px-4 py-1.5 rounded-full bg-amber-100 border border-amber-200">
            Faites votre
          </span>
          <h2 className="text-5xl md:text-6xl font-black text-stone-900 leading-tight">
            Réservation
          </h2>
          <div className="mt-4 mx-auto w-16 h-1 rounded-full bg-gradient-to-r from-amber-500 to-amber-300" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">

          {/* ── Left info column ── */}
          <div className="lg:col-span-2 space-y-10">

            {/* Contact cards */}
            <div>
              <h3 className="text-xl font-bold text-stone-800 mb-6 flex items-center gap-2">
                <span className="w-8 h-0.5 bg-amber-500 inline-block" />
                Informations de Contact
              </h3>
              <div className="space-y-4">
                {[
                  { Icon: Phone, label: "Téléphone", value: "+33 6 66 03 03 42", href: "tel:+33666030342" },
                  { Icon: Phone, label: "WhatsApp", value: "+33 6 26 76 75 23", href: "tel:+33626767523" },
                  { Icon: Mail, label: "Email", value: "ndiayeaboubakry@gmail.com", href: "mailto:ndiayeaboubakry@gmail.com" },
                  { Icon: MapPin, label: "Adresse", value: "4 Chemin des princes\n78870 Bailly, France", href: undefined },
                ].map(({ Icon, label, value, href }) => (
                  <div key={label} className="flex items-start gap-4 p-4 rounded-2xl bg-white border border-stone-100 shadow-sm hover:shadow-md hover:border-amber-200 transition-all group">
                    <div className="shrink-0 w-11 h-11 flex items-center justify-center rounded-xl bg-gradient-to-br from-amber-100 to-amber-200 text-amber-700 group-hover:scale-110 transition-transform">
                      <Icon size={20} />
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-stone-400 mb-0.5">{label}</p>
                      {href ? (
                        <a href={href} className="text-stone-700 font-medium text-sm hover:text-amber-700 transition-colors whitespace-pre-line">{value}</a>
                      ) : (
                        <p className="text-stone-700 font-medium text-sm whitespace-pre-line">{value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment section */}
            <div>
              <h3 className="text-xl font-bold text-stone-800 mb-2 flex items-center gap-2">
                <span className="w-8 h-0.5 bg-amber-500 inline-block" />
                Modalités de paiement
              </h3>
              <p className="text-stone-400 text-sm mb-5">Uniquement sur devis.</p>
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

          {/* ── Form column ── */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-3xl shadow-xl border border-stone-100 p-8 md:p-10">

              <h3 className="text-xl font-bold text-stone-800 mb-8 flex items-center gap-2">
                <span className="w-8 h-0.5 bg-amber-500 inline-block" />
                Votre demande
              </h3>

              <form onSubmit={handleSubmit} noValidate className="space-y-5">

                {/* ── Honeypot (invisible to humans) ── */}
                <div aria-hidden="true" style={{ position: "absolute", left: "-9999px", width: "1px", height: "1px", overflow: "hidden" }}>
                  <label htmlFor={HONEYPOT_FIELD}>Ne pas remplir</label>
                  <input
                    type="text"
                    id={HONEYPOT_FIELD}
                    name={HONEYPOT_FIELD}
                    value={formData[HONEYPOT_FIELD]}
                    onChange={handleChange}
                    tabIndex={-1}
                    autoComplete="off"
                  />
                </div>

                {/* Nom */}
                <div>
                  <label htmlFor="name" className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-1.5">
                    Nom complet <span className="text-amber-500">*</span>
                  </label>
                  <input type="text" id="name" name="name" required
                    value={formData.name} onChange={handleChange}
                    onFocus={() => setFocusedField("name")} onBlur={() => setFocusedField(null)}
                    className={inputCls("name")} placeholder="Votre nom" autoComplete="name" />
                  {fieldErrors.name && <FieldError msg={fieldErrors.name} />}
                </div>

                {/* Email + Téléphone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="email" className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-1.5">
                      Email <span className="text-amber-500">*</span>
                    </label>
                    <input type="email" id="email" name="email" required
                      value={formData.email} onChange={handleChange}
                      onFocus={() => setFocusedField("email")} onBlur={() => setFocusedField(null)}
                      className={inputCls("email")} placeholder="votre@email.fr" autoComplete="email" />
                    {fieldErrors.email && <FieldError msg={fieldErrors.email} />}
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-1.5">
                      Téléphone
                    </label>
                    <input type="tel" id="phone" name="phone"
                      value={formData.phone} onChange={handleChange}
                      onFocus={() => setFocusedField("phone")} onBlur={() => setFocusedField(null)}
                      className={inputCls("phone")} placeholder="06 12 34 56 78" autoComplete="tel" />
                    {fieldErrors.phone && <FieldError msg={fieldErrors.phone} />}
                  </div>
                </div>

                {/* Date + Convives */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="eventDate" className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-1.5">
                      Date de l'événement
                    </label>
                    <input type="date" id="eventDate" name="eventDate"
                      value={formData.eventDate} onChange={handleChange}
                      onFocus={() => setFocusedField("eventDate")} onBlur={() => setFocusedField(null)}
                      min={new Date().toISOString().split("T")[0]}
                      className={inputCls("eventDate")} />
                  </div>
                  <div>
                    <label htmlFor="guests" className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-1.5">
                      Nombre de convives
                    </label>
                    <input type="number" id="guests" name="guests" min={1} max={2000}
                      value={formData.guests} onChange={handleChange}
                      onFocus={() => setFocusedField("guests")} onBlur={() => setFocusedField(null)}
                      className={inputCls("guests")} placeholder="50" />
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label htmlFor="message" className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-1.5">
                    Votre message <span className="text-amber-500">*</span>
                  </label>
                  <textarea id="message" name="message" required rows={5}
                    value={formData.message} onChange={handleChange}
                    onFocus={() => setFocusedField("message")} onBlur={() => setFocusedField(null)}
                    className={`${inputCls("message")} resize-none`}
                    placeholder="Parlez-nous de votre événement..." maxLength={1000} />
                  <div className="flex justify-between mt-1">
                    {fieldErrors.message
                      ? <FieldError msg={fieldErrors.message} />
                      : <span />
                    }
                    <span className="text-xs text-stone-300">{formData.message.length}/1000</span>
                  </div>
                </div>

                {/* Rate-limit countdown banner */}
                {isRateLimited && (
                  <div className="flex items-center gap-3 p-4 bg-amber-50 border border-amber-200 rounded-2xl text-amber-800 text-sm font-medium">
                    <span className="shrink-0 text-amber-500">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                      </svg>
                    </span>
                    <span>
                      Trop de tentatives. Réessayez dans{" "}
                      <span className="font-black tabular-nums text-amber-700">
                        {formatCountdown(cooldownRemaining)}
                      </span>
                    </span>
                  </div>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={status === "loading" || isSubmitted || isRateLimited}
                  className="w-full relative overflow-hidden bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 disabled:from-stone-300 disabled:to-stone-300 text-white font-bold py-4 px-6 rounded-2xl transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 disabled:cursor-not-allowed disabled:shadow-none text-sm tracking-wide"
                >
                  {status === "loading" ? (
                    <><Loader2 size={18} className="animate-spin" /> Envoi en cours…</>
                  ) : isSubmitted ? (
                    <><CheckCircle size={18} /> Message envoyé !</>
                  ) : isRateLimited ? (
                    <><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> {formatCountdown(cooldownRemaining)}</>
                  ) : (
                    <><Send size={18} /> Envoyer la demande</>
                  )}
                </button>

                {/* Feedback banners */}
                {isSubmitted && (
                  <div className="flex items-start gap-3 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-sm font-medium">
                    <CheckCircle size={18} className="shrink-0 mt-0.5 text-emerald-500" />
                    Merci pour votre message ! Nous vous répondrons très rapidement.
                  </div>
                )}
                {status === "error" && errorMessage && (
                  <div className="flex items-start gap-3 p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-700 text-sm font-medium">
                    <AlertCircle size={18} className="shrink-0 mt-0.5 text-rose-500" />
                    {errorMessage}
                  </div>
                )}

                <p className="text-center text-xs text-stone-300">
                  Vos données sont traitées de façon confidentielle et ne sont jamais partagées.
                </p>
              </form>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

// ── Tiny sub-component for field errors ─────────────────────────────────────
function FieldError({ msg }: { msg: string }) {
  return (
    <p className="mt-1 text-xs text-rose-500 flex items-center gap-1">
      <AlertCircle size={11} /> {msg}
    </p>
  );
}