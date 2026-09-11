"use client";

import Image from "next/image";
import { FormEvent, KeyboardEvent, MouseEvent as ReactMouseEvent, PointerEvent as ReactPointerEvent, useEffect, useRef, useState } from "react";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronRight,
  ChevronsLeftRight,
  CircleCheck,
  Image as ImageIcon,
  Inbox,
  Mail,
  MessageCircle,
  Smartphone,
  X,
} from "lucide-react";
import {
  AnimatePresence,
  animate,
  motion,
  useInView,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";

const BRAND = "Aupro";
const EASE = [0.22, 1, 0.36, 1] as const;

type IconName = "calendrier" | "chantier" | "devis" | "livraison" | "messages" | "outils" | "photos" | "taches" | "telephone";

/** Icône illustrée de la charte (public/icones), rendue dans un carré pour garder ses proportions. */
function Ico({ name, size = 24, className = "" }: { name: IconName; size?: number; className?: string }) {
  return (
    <span className={`ico ${className}`} style={{ width: size, height: size }} aria-hidden>
      <Image src={`/icones/${name}.png`} alt="" fill sizes={`${size * 2}px`} style={{ objectFit: "contain" }} />
    </span>
  );
}

/** Logo de l’app (public/logo/aupro-logo.png), déjà arrondi et sur fond bleu foncé. */
function Logo({ size = 36, className = "" }: { size?: number; className?: string }) {
  return (
    <span className={`logo-mark ${className}`} style={{ width: size, height: size }} aria-hidden>
      <Image src="/logo/aupro-logo.png" alt="" fill sizes={`${size * 2}px`} style={{ objectFit: "contain" }} priority={size >= 36} />
    </span>
  );
}

type BadgeTone = "orange" | "ink" | "green" | "amber" | "muted" | "cream";

/** Étiquette « chantier » : icône de la charte (ou pictogramme) + libellé court. */
function Badge({
  icon,
  glyph: Glyph,
  tone = "muted",
  children,
  className = "",
}: {
  icon?: IconName;
  glyph?: typeof Check;
  tone?: BadgeTone;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span className={`badge badge-${tone} ${className}`}>
      {icon && <Ico name={icon} size={18} />}
      {Glyph && <Glyph size={13} strokeWidth={2.5} />}
      {children}
    </span>
  );
}

const incomingMessages: { channel: string; ico?: IconName; glyph?: typeof Mail; sender: string; time: string; message: string }[] = [
  {
    channel: "WhatsApp",
    ico: "messages",
    sender: "Jean Dupont",
    time: "09:42",
    message: "Finalement on part sur 6 prises dans la cuisine au lieu de 4.",
  },
  {
    channel: "Email",
    glyph: Mail,
    sender: "Claire Martin",
    time: "10:16",
    message: "Bonjour, pourriez-vous chiffrer la rénovation de notre terrasse de 35 m² ? Photos jointes.",
  },
  {
    channel: "SMS",
    ico: "telephone",
    sender: "Marc Leroy",
    time: "11:03",
    message: "Tu peux prévoir 4 sacs de colle en plus pour demain matin ?",
  },
];

type FeatureVisual = "inbox" | "actions" | "form" | "photos" | "progress" | "daily";

const features: {
  icon: IconName;
  number: string;
  title: string;
  text: string;
  span: 5 | 7;
  dark?: boolean;
  visual: FeatureVisual;
}[] = [
  {
    icon: "messages",
    number: "01",
    title: "Une seule boîte de réception",
    text: "Emails, WhatsApp Business et demandes importées arrivent dans un seul flux. Plus besoin de chercher où le client a écrit.",
    span: 7,
    dark: true,
    visual: "inbox",
  },
  {
    icon: "taches",
    number: "02",
    title: "Les messages deviennent des actions",
    text: "Chaque message est lu, compris et transformé en action au bon endroit : modification de chantier, demande de devis, achat à prévoir.",
    span: 5,
    visual: "actions",
  },
  {
    icon: "devis",
    number: "03",
    title: "Du message au devis",
    text: "Les coordonnées, prestations, photos et informations utiles préremplissent votre demande de devis.",
    span: 5,
    visual: "form",
  },
  {
    icon: "photos",
    number: "04",
    title: "Chaque photo au bon endroit",
    text: "Photos avant travaux, avancement, réserves et finitions sont automatiquement liées au bon chantier.",
    span: 7,
    visual: "photos",
  },
  {
    icon: "chantier",
    number: "05",
    title: "Le client suit sans appeler",
    text: "Partagez un lien simple avec l’avancement, les étapes terminées et les prochaines interventions.",
    span: 5,
    visual: "progress",
  },
  {
    icon: "calendrier",
    number: "06",
    title: "Votre journée en un coup d’œil",
    text: "Ouvrez l’application le matin et voyez immédiatement les chantiers, urgences, achats et réponses à traiter.",
    span: 7,
    dark: true,
    visual: "daily",
  },
];

const dailyItems: { time: string; title: string; detail: string; status: string; icon: IconName }[] = [
  { time: "08:00", title: "Dupont · Cuisine", detail: "Pose mobilier + vérifier 2 prises", status: "En cours", icon: "chantier" },
  { time: "11:30", title: "Martin · Terrasse", detail: "Visite avant devis", status: "À venir", icon: "calendrier" },
  { time: "14:00", title: "Leroy · SDB", detail: "Livraison carrelage", status: "Livraison", icon: "livraison" },
];

const quotePoints: { icon: IconName; title: string; text: string }[] = [
  {
    icon: "devis",
    title: "Informations extraites automatiquement",
    text: "Surface, matériaux, coordonnées, délais : tout ce qui est utile est repéré dans le message et les pièces jointes.",
  },
  {
    icon: "messages",
    title: "Questions manquantes suggérées",
    text: `${BRAND} vous indique ce qu’il reste à demander avant de vous déplacer ou de chiffrer.`,
  },
  {
    icon: "taches",
    title: "Validation humaine avant envoi",
    text: "Rien ne part sans votre accord. Vous relisez, ajustez, puis envoyez.",
  },
];

type Direction = "left" | "right" | "up";

/** Entrée en fondu directionnelle (translation + flou) déclenchée au scroll. */
function Reveal({
  children,
  direction = "up",
  delay = 0,
  distance,
  className = "",
  duration = 0.9,
}: {
  children: React.ReactNode;
  direction?: Direction;
  delay?: number;
  distance?: number;
  className?: string;
  duration?: number;
}) {
  const reduce = useReducedMotion();
  const d = distance ?? (direction === "up" ? 28 : 72);
  const from = {
    opacity: 0,
    x: direction === "left" ? -d : direction === "right" ? d : 0,
    y: direction === "up" ? d : 0,
    filter: "blur(10px)",
  };
  return (
    <motion.div
      className={className}
      initial={reduce ? false : from}
      whileInView={reduce ? undefined : { opacity: 1, x: 0, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-10% 0px -10% 0px" }}
      transition={{ duration, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

type ChipPosition = "tl" | "tr" | "bl" | "br";

type PhoneChip = {
  icon: IconName;
  title: string;
  sub: string;
  position: ChipPosition;
  /** Décalage optionnel (top/bottom en %) pour viser la zone commentée sur la capture. */
  offset?: React.CSSProperties;
};

/** Capture d’écran de l’app dans son iPhone, avec halo, flottement et puces contextuelles animées. */
function PhoneShowcase({
  src,
  alt,
  width,
  height,
  chips,
  priority = false,
  from = "right",
  className = "",
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
  chips: PhoneChip[];
  priority?: boolean;
  from?: "left" | "right";
  className?: string;
}) {
  const reduce = useReducedMotion();
  const offset = from === "left" ? -70 : 70;

  return (
    <div className={`phone-showcase ${className}`}>
      <motion.div
        className="phone-glow"
        animate={reduce ? undefined : { scale: [1, 1.12, 1], opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="phone-enter"
        initial={reduce ? false : { opacity: 0, x: offset, y: 30, filter: "blur(12px)" }}
        whileInView={{ opacity: 1, x: 0, y: 0, filter: "blur(0px)" }}
        viewport={{ once: true, margin: "-10% 0px" }}
        transition={{ duration: 1.1, delay: 0.1, ease: EASE }}
      >
        <div className="phone-frame">
          <Image src={src} alt={alt} width={width} height={height} priority={priority} sizes="(max-width: 720px) 78vw, 400px" />
        </div>
      </motion.div>

      {chips.map((chip, i) => {
        return (
          <motion.div
            key={chip.title}
            className={`phone-chip ${chip.position}`}
            style={chip.offset}
            initial={reduce ? false : { opacity: 0, y: 18, scale: 0.9 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.7 + i * 0.25, ease: EASE }}
          >
            <div className="phone-chip-inner">
              <span className="chip-icon"><Ico name={chip.icon} size={26} /></span>
              <div><strong>{chip.title}</strong><small>{chip.sub}</small></div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

type WaitlistStatus = "idle" | "loading" | "done" | "error";

/** Formulaire bêta : envoie l’email à /api/waitlist, qui l’ajoute à l’audience Resend. */
function WaitlistForm({ compact = false }: { compact?: boolean }) {
  const [status, setStatus] = useState<WaitlistStatus>("idle");
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState(""); // pot-de-miel : reste vide pour un humain

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!email.trim() || status === "loading") return;
    setStatus("loading");
    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, website }),
      });
      const payload = (await response.json().catch(() => ({}))) as { ok?: boolean };
      setStatus(response.ok && payload.ok ? "done" : "error");
    } catch {
      setStatus("error");
    }
  }

  const done = status === "done";
  const loading = status === "loading";

  return (
    <form className={`waitlist-form ${compact ? "compact" : ""}`} onSubmit={submit} noValidate={false}>
      <AnimatePresence mode="wait">
        {!done ? (
          <motion.div key="form" className="form-row" initial={{ opacity: 1 }} exit={{ opacity: 0, y: -8 }}>
            <input
              type="email"
              value={email}
              onChange={(event) => { setEmail(event.target.value); if (status === "error") setStatus("idle"); }}
              placeholder="votre@email.fr"
              aria-label="Votre adresse email"
              autoComplete="email"
              disabled={loading}
              required
            />
            <input
              className="hp-field"
              type="text"
              name="website"
              value={website}
              onChange={(event) => setWebsite(event.target.value)}
              tabIndex={-1}
              autoComplete="off"
              aria-hidden
            />
            <motion.button whileTap={{ scale: 0.97 }} whileHover={{ y: -1 }} type="submit" disabled={loading} aria-busy={loading}>
              {loading ? "Envoi…" : "Rejoindre la bêta"} <ArrowRight size={18} />
            </motion.button>
          </motion.div>
        ) : (
          <motion.div key="success" className="form-success" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
            <CircleCheck size={19} /> Merci — vous êtes sur la liste de la bêta.
          </motion.div>
        )}
      </AnimatePresence>
      {status === "error" && (
        <motion.p className="form-error" role="alert" initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}>
          Impossible d’enregistrer votre email pour le moment. Réessayez dans un instant.
        </motion.p>
      )}
      {!compact && !done && <small>Aucune carte bancaire · Accès bêta prioritaire · Désinscription en un clic</small>}
    </form>
  );
}

const actionExamples: {
  key: string;
  type: string;
  short: string;
  icon: IconName;
  tone: BadgeTone;
  channel: { label: string; ico?: IconName; glyph?: typeof Mail };
  sender: string;
  time: string;
  message: string;
  target: { icon: IconName; label: string };
  facts: [string, string][];
}[] = [
  {
    key: "modification",
    type: "Modification",
    short: "Modif.",
    icon: "outils",
    tone: "orange",
    channel: { label: "WhatsApp", ico: "messages" },
    sender: "Jean Dupont",
    time: "09:42",
    message: "Finalement on part sur 6 prises dans la cuisine au lieu de 4.",
    target: { icon: "chantier", label: "Chantier Dupont · Cuisine" },
    facts: [["Élément", "Prises cuisine"], ["Quantité", "4 → 6"]],
  },
  {
    key: "devis",
    type: "Demande de devis",
    short: "Devis",
    icon: "devis",
    tone: "ink",
    channel: { label: "Email", glyph: Mail },
    sender: "Claire Martin",
    time: "10:16",
    message: "Pourriez-vous chiffrer la rénovation de notre terrasse de 35 m² ? Photos jointes.",
    target: { icon: "devis", label: "Nouveau devis · Martin" },
    facts: [["Prestation", "Terrasse"], ["Surface", "≈ 35 m²"]],
  },
  {
    key: "achat",
    type: "Achat à prévoir",
    short: "Achat",
    icon: "livraison",
    tone: "green",
    channel: { label: "SMS", ico: "telephone" },
    sender: "Marc Leroy",
    time: "11:03",
    message: "Tu peux prévoir 4 sacs de colle en plus pour demain matin ?",
    target: { icon: "taches", label: "Liste d’achats · Leroy" },
    facts: [["Article", "Colle · 4 sacs"], ["Échéance", "Demain · 08:00"]],
  },
];

const ACTION_CYCLE_MS = 4200;

/** Carte 02 : un message → l’action détectée. Défile seul, se met en pause au survol, cliquable. */
function ActionsDemo() {
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (reduce || paused) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % actionExamples.length), ACTION_CYCLE_MS);
    return () => clearInterval(id);
  }, [reduce, paused]);

  const example = actionExamples[index];
  const ChannelGlyph = example.channel.glyph;

  return (
    <div className="feature-visual actions-demo" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <div className="actions-tabs" role="tablist" aria-label="Type d’action détectée">
        {actionExamples.map((item, i) => (
          <button key={item.key} type="button" role="tab" aria-selected={i === index} className={i === index ? "active" : ""} onClick={() => setIndex(i)}>
            <Ico name={item.icon} size={18} />
            <span className="full">{item.type}</span>
            <span className="short">{item.short}</span>
            {i === index && !reduce && !paused && (
              <motion.span
                key={`progress-${index}`}
                className="tab-progress"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: ACTION_CYCLE_MS / 1000, ease: "linear" }}
              />
            )}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={example.key}
          className="actions-flow"
          initial={reduce ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduce ? undefined : { opacity: 0, y: -10 }}
          transition={{ duration: 0.4, ease: EASE }}
        >
          <div className="actions-msg">
            <span className="ch-tile sm">{example.channel.ico ? <Ico name={example.channel.ico} size={24} /> : ChannelGlyph && <ChannelGlyph size={18} strokeWidth={2.4} />}</span>
            <div>
              <small>{example.sender} · {example.channel.label} · {example.time}</small>
              <p>« {example.message} »</p>
            </div>
          </div>

          <div className="actions-arrow"><span /><ArrowDown size={14} strokeWidth={2.5} /><em>Détecté automatiquement</em><span /></div>

          <div className="actions-result">
            <div className="actions-result-head">
              <Badge icon={example.icon} tone={example.tone}>{example.type}</Badge>
              <span className="actions-target"><Ico name={example.target.icon} size={18} />{example.target.label}</span>
            </div>
            <div className="actions-facts">
              {example.facts.map(([label, value]) => (
                <div key={label}><small>{label}</small><strong>{value}</strong></div>
              ))}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function FeatureVisualBlock({ visual }: { visual: FeatureVisual }) {
  const reduce = useReducedMotion();

  switch (visual) {
    case "inbox":
      return (
        <div className="feature-visual inbox-panel">
          <div className="inbox-head">
            <div><strong>Boîte de réception</strong><small>Tous vos canaux, un seul flux</small></div>
            <Badge tone="cream" glyph={Inbox}>3 nouveaux</Badge>
          </div>
          <div className="inbox-filters">
            {["Tous", "WhatsApp", "Email", "Appels"].map((label, i) => <span key={label} className={i === 0 ? "active" : ""}>{label}</span>)}
          </div>
          <div className="inbox-list">
            {([
              { ico: "messages", sender: "Dupont", channel: "WhatsApp", time: "Maintenant", preview: "Finalement on part sur 6 prises dans la cuisine au lieu de 4.", unread: true },
              { glyph: Mail, sender: "Martin", channel: "Email", time: "2 min", preview: "Pourriez-vous chiffrer la rénovation de notre terrasse ? Photos jointes.", unread: true },
              { ico: "telephone", sender: "Leroy", channel: "Appel manqué", time: "11:03", preview: "Rappel prévu à 14:00 · 4 sacs de colle à prévoir.", unread: false },
            ] as { ico?: IconName; glyph?: typeof Mail; sender: string; channel: string; time: string; preview: string; unread: boolean }[]).map((row, i) => {
              const Glyph = row.glyph;
              return (
                <motion.div
                  key={row.sender}
                  className="inbox-row"
                  initial={reduce ? false : { opacity: 0, x: -18 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.35 + i * 0.12, duration: 0.6, ease: EASE }}
                >
                  <span className="ch-tile">{row.ico ? <Ico name={row.ico} size={28} /> : Glyph && <Glyph size={21} strokeWidth={2.4} />}</span>
                  <div>
                    <div className="inbox-row-head"><strong>{row.sender}</strong><em>{row.channel}</em><small>{row.time}</small></div>
                    <p>{row.preview}</p>
                  </div>
                  {row.unread ? <span className="inbox-dot" aria-label="Non lu" /> : <span className="inbox-dot off" />}
                </motion.div>
              );
            })}
          </div>
        </div>
      );
    case "actions":
      return <ActionsDemo />;
    case "form":
      return (
        <div className="feature-visual form-mini">
          {[
            { label: "Client", value: "Claire Martin" },
            { label: "Prestation", value: "Terrasse · grès cérame" },
            { label: "Surface", value: "≈ 35 m²" },
          ].map((row, i) => (
            <motion.div
              key={row.label}
              initial={reduce ? false : { opacity: 0, x: 18 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.35 + i * 0.12, duration: 0.6, ease: EASE }}
            >
              <small>{row.label}</small>
              <strong>{row.value}</strong>
              <Check size={14} />
            </motion.div>
          ))}
        </div>
      );
    case "photos":
      return (
        <div className="feature-visual photos-mini">
          {[
            { label: "Avant travaux", src: "/photos/chantier-avant.jpg", alt: "Pièce en cours de démolition avant travaux" },
            { label: "Avancement", src: "/photos/chantier-avancement.jpg", alt: "Électricien installant une prise" },
            { label: "Réserves", src: "/photos/chantier-reserves.jpg", alt: "Rouleau de peinture pour les retouches" },
            { label: "Finitions", src: "/photos/chantier-finitions.jpg", alt: "Cuisine rénovée terminée" },
          ].map((photo, i) => (
            <motion.div
              key={photo.label}
              className="photo"
              initial={reduce ? false : { opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.35 + i * 0.1, duration: 0.55, ease: EASE }}
            >
              <Image src={photo.src} alt={photo.alt} fill sizes="(max-width: 720px) 45vw, 200px" style={{ objectFit: "cover" }} />
              <span>{photo.label}</span>
            </motion.div>
          ))}
        </div>
      );
    case "progress":
      return (
        <div className="feature-visual progress-mini">
          <div className="progress-head">
            <strong>Rénovation cuisine</strong>
            <Badge icon="calendrier" tone="orange">Étape 3 / 5</Badge>
          </div>
          <div className="progress-bar">
            <motion.span
              initial={reduce ? false : { width: "0%" }}
              whileInView={{ width: "60%" }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 1.1, ease: EASE }}
            />
          </div>
          <div className="progress-steps">
            <span className="done">Démolition</span>
            <span className="done">Plomberie</span>
            <span className="current">Pose mobilier</span>
            <span>Électricité</span>
            <span>Finitions</span>
          </div>
        </div>
      );
    case "daily":
      return (
        <div className="feature-visual daily-mini">
          {dailyItems.map((item, i) => (
            <motion.div
              key={item.time}
              initial={reduce ? false : { opacity: 0, x: 18 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.35 + i * 0.12, duration: 0.6, ease: EASE }}
            >
              <time>{item.time}</time>
              <span><strong>{item.title}</strong><small>{item.detail}</small></span>
              <Badge icon={item.icon} tone="cream">{item.status}</Badge>
            </motion.div>
          ))}
        </div>
      );
  }
}

function FeatureCard({ feature, index }: { feature: (typeof features)[number]; index: number }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const fromLeft = index % 2 === 0;

  function onMove(event: ReactMouseEvent<HTMLElement>) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${event.clientX - rect.left}px`);
    el.style.setProperty("--my", `${event.clientY - rect.top}px`);
  }

  return (
    <motion.article
      ref={ref}
      onMouseMove={onMove}
      className={`feature-card span-${feature.span} ${feature.dark ? "dark" : ""}`}
      initial={reduce ? false : { opacity: 0, x: fromLeft ? -80 : 80, y: 20, filter: "blur(12px)" }}
      whileInView={reduce ? undefined : { opacity: 1, x: 0, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-12% 0px -8% 0px" }}
      transition={{ duration: 1, delay: fromLeft ? 0 : 0.14, ease: EASE }}
      whileHover={reduce ? undefined : { y: -6 }}
    >
      <div className="feature-spotlight" />
      <div className="feature-top">
        <span className="feature-icon"><Ico name={feature.icon} size={34} /></span>
        <span className="feature-number">{feature.number}</span>
      </div>
      <h3>{feature.title}</h3>
      <p>{feature.text}</p>
      <FeatureVisualBlock visual={feature.visual} />
    </motion.article>
  );
}

const dayMoments: { time: string; icon: IconName; text: string; tag: string }[] = [
  { time: "07:30", icon: "messages", text: "Demande de Mme Martin transformée en devis à compléter", tag: "Prêt" },
  { time: "09:15", icon: "chantier", text: "« 6 prises au lieu de 4 » ajouté au chantier Dupont", tag: "Détecté" },
  { time: "12:30", icon: "photos", text: "Photos de la salle de bain classées dans le chantier Leroy", tag: "Classé" },
  { time: "17:45", icon: "telephone", text: "3 relances prêtes, visibles au même endroit", tag: "Planifié" },
  { time: "20:00", icon: "devis", text: "Devis pré-rempli, validé en 5 minutes", tag: "Terminé" },
];

/** Notes éparpillées de la face « sans » : position en % du demi-panneau, rotation en degrés. */
const chaosNotes: { icon: IconName; text: string; x: number; y: number; r: number; note: boolean }[] = [
  { icon: "photos", text: "47 photos non classées", x: 4, y: 5, r: -4, note: false },
  { icon: "messages", text: "WhatsApp · 12 non lus", x: 50, y: 12, r: 3, note: false },
  { icon: "outils", text: "6 prises… ou 4 ?", x: 12, y: 29, r: -7, note: true },
  { icon: "telephone", text: "Rappeler Mme Martin avant ce soir", x: 36, y: 41, r: 4, note: false },
  { icon: "devis", text: "Devis terrasse à finir", x: 5, y: 57, r: 2, note: false },
  { icon: "livraison", text: "Colle : 4 sacs pour demain", x: 46, y: 68, r: -3, note: true },
  { icon: "messages", text: "Le mail du client… lequel ?", x: 14, y: 84, r: 5, note: false },
];

/** Une face du comparateur. Chaque face place son contenu clé du côté qui lui est visible par défaut. */
function CompareBoard({ variant }: { variant: "before" | "after" }) {
  const reduce = useReducedMotion();

  if (variant === "before") {
    return (
      <div className="cmp-board before">
        <div className="cmp-half chaos">
          <div className="chaos-cloud">
            {chaosNotes.map((note, i) => {
              return (
                <motion.div
                  key={note.text}
                  className={`chaos-note ${note.note ? "sticky" : ""}`}
                  style={{ "--x": `${note.x}%`, "--y": `${note.y}%`, "--r": `${note.r}deg` } as React.CSSProperties}
                  initial={reduce ? false : { opacity: 0, scale: 0.8, y: 14 }}
                  whileInView={{ opacity: 1, scale: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.25 + i * 0.08, ease: EASE }}
                >
                  <Ico name={note.icon} size={22} />
                  {note.text}
                </motion.div>
              );
            })}
          </div>
        </div>
        <div className="cmp-half stat">
          <span className="cmp-kicker"><X size={13} /> Sans {BRAND}</span>
          <h3>Tout est dans la tête.</h3>
          <p>Chaque information vit dans une application différente. Le soir, il faut tout reconstituer de mémoire.</p>
          <div className="cmp-figure">
            <strong>≈ 1 h 40</strong>
            <small>par jour à chercher, noter, ressaisir</small>
          </div>
          <span className="cmp-bar"><i style={{ width: "100%" }} /></span>
        </div>
      </div>
    );
  }

  return (
    <div className="cmp-board after">
      <div className="cmp-half stat">
        <span className="cmp-kicker"><Logo size={16} /> Avec {BRAND}</span>
        <h3>Tout est au bon endroit.</h3>
        <p>Messages, photos, tâches et devis sont rattachés au bon client, automatiquement, au fil de la journée.</p>
        <div className="cmp-figure">
          <strong>≈ 25 min</strong>
          <small>par jour — le reste est déjà en place</small>
        </div>
        <span className="cmp-bar">
          <motion.i
            initial={reduce ? false : { width: "0%" }}
            whileInView={{ width: "24%" }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, delay: 0.5, ease: EASE }}
          />
        </span>
      </div>
      <div className="cmp-half tidy">
        <div className="tidy-card">
          <div className="tidy-head">
            <div><small>Aujourd’hui</small><strong>Tout est rangé</strong></div>
            <span><CircleCheck size={15} /> 5 / 5</span>
          </div>
          {dayMoments.map((moment, i) => {
            return (
              <motion.div
                key={moment.time}
                className="tidy-row"
                initial={reduce ? false : { opacity: 0, x: 22 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.35 + i * 0.1, ease: EASE }}
              >
                <time>{moment.time}</time>
                <span className="tidy-icon"><Ico name={moment.icon} size={24} /></span>
                <p>{moment.text}</p>
                <Badge glyph={Check} tone="green">{moment.tag}</Badge>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

const MOBILE_QUERY = "(max-width: 720px)";

/** Comparateur avant / après : poignée à glisser sur desktop, toggle segmenté sur mobile. */
function CompareSlider() {
  const reduce = useReducedMotion();
  const stageRef = useRef<HTMLDivElement>(null);
  const hintRef = useRef<ReturnType<typeof animate> | null>(null);
  const isMobileRef = useRef(false);
  const draggingRef = useRef(false);
  const x = useMotionValue(50);
  const clip = useTransform(x, (value) => `inset(0 0 0 ${value}%)`);
  const left = useTransform(x, (value) => `${value}%`);
  const [pct, setPct] = useState(50);
  const [dragging, setDragging] = useState(false);
  const [view, setView] = useState<"before" | "after">("before");
  const inView = useInView(stageRef, { once: true, margin: "-25% 0px" });

  useMotionValueEvent(x, "change", (value) => setPct(Math.round(value)));

  // Sur mobile la poignée disparaît : on affiche une face à la fois (voir CSS), la position n’a plus d’effet.
  useEffect(() => {
    const mq = window.matchMedia(MOBILE_QUERY);
    const apply = () => {
      isMobileRef.current = mq.matches;
      if (mq.matches) {
        hintRef.current?.stop();
      } else {
        x.set(50);
      }
    };
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, [x]);

  // Petit va-et-vient à l’arrivée pour signaler que la poignée se manipule.
  useEffect(() => {
    if (!inView || reduce || isMobileRef.current) return;
    hintRef.current = animate(x, [50, 66, 40, 50], { duration: 3.2, ease: "easeInOut", delay: 0.5 });
    return () => hintRef.current?.stop();
  }, [inView, reduce, x]);

  function clamp(value: number) {
    return Math.min(96, Math.max(4, value));
  }

  function percentFromClientX(clientX: number) {
    const el = stageRef.current;
    if (!el) return 50;
    const rect = el.getBoundingClientRect();
    return clamp(((clientX - rect.left) / rect.width) * 100);
  }

  function onGripDown(event: ReactPointerEvent<HTMLButtonElement>) {
    hintRef.current?.stop();
    draggingRef.current = true;
    setDragging(true);
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function onGripMove(event: ReactPointerEvent<HTMLButtonElement>) {
    if (!draggingRef.current) return;
    x.set(percentFromClientX(event.clientX));
  }

  function onGripUp(event: ReactPointerEvent<HTMLButtonElement>) {
    draggingRef.current = false;
    setDragging(false);
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
  }

  function onGripKey(event: KeyboardEvent<HTMLButtonElement>) {
    const step = event.shiftKey ? 15 : 5;
    let target: number | null = null;
    if (event.key === "ArrowLeft") target = clamp(x.get() - step);
    if (event.key === "ArrowRight") target = clamp(x.get() + step);
    if (event.key === "Home") target = 4;
    if (event.key === "End") target = 96;
    if (target === null) return;
    event.preventDefault();
    hintRef.current?.stop();
    animate(x, target, { duration: 0.35, ease: EASE });
  }

  function onStageClick(event: ReactMouseEvent<HTMLDivElement>) {
    if (isMobileRef.current) return;
    if ((event.target as HTMLElement).closest(".cmp-handle")) return;
    hintRef.current?.stop();
    animate(x, percentFromClientX(event.clientX), { duration: 0.5, ease: EASE });
  }

  return (
    <div className="cmp-wrap">
      <div className="cmp-legend">
        <span className="cmp-pill before"><X size={14} /> Sans {BRAND}</span>
        <span className="cmp-hint"><ChevronsLeftRight size={15} /> Glissez pour comparer</span>
        <span className="cmp-pill after"><Logo size={18} /> Avec {BRAND}</span>
      </div>

      <div className="cmp-toggle" role="tablist" aria-label="Choisir la version à afficher">
        <motion.span className="cmp-toggle-thumb" animate={{ x: view === "after" ? "100%" : "0%" }} transition={{ duration: 0.45, ease: EASE }} />
        <button type="button" role="tab" aria-selected={view === "before"} className={view === "before" ? "active" : ""} onClick={() => setView("before")}>Sans {BRAND}</button>
        <button type="button" role="tab" aria-selected={view === "after"} className={view === "after" ? "active" : ""} onClick={() => setView("after")}>Avec {BRAND}</button>
      </div>

      <div ref={stageRef} className={`cmp-stage view-${view} ${dragging ? "dragging" : ""}`} onClick={onStageClick}>
        <div className="cmp-before-wrap">
          <CompareBoard variant="before" />
        </div>
        <motion.div className="cmp-after-clip" style={{ clipPath: clip }}>
          <CompareBoard variant="after" />
        </motion.div>
        <motion.div className="cmp-handle" style={{ left }}>
          <span className="cmp-handle-line" />
          <button
            type="button"
            className="cmp-grip"
            role="slider"
            aria-label={`Comparer sans et avec ${BRAND}`}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={pct}
            onPointerDown={onGripDown}
            onPointerMove={onGripMove}
            onPointerUp={onGripUp}
            onPointerCancel={onGripUp}
            onKeyDown={onGripKey}
          >
            <ChevronsLeftRight size={22} />
          </button>
        </motion.div>
      </div>

      <p className="cmp-note">Journée type donnée à titre d’exemple.</p>
    </div>
  );
}

const hubNodes: { key: string; icon?: IconName; glyph?: typeof Mail; label: string; note: string; side: "left" | "right"; row: 0 | 1 }[] = [
  { key: "wa", icon: "messages", label: "WhatsApp Business", note: "Connexion automatique", side: "left", row: 0 },
  { key: "mail", glyph: Mail, label: "Gmail & Outlook", note: "Connexion automatique", side: "left", row: 1 },
  { key: "sms", icon: "telephone", label: "SMS / messages", note: "Import rapide", side: "right", row: 0 },
  { key: "photos", icon: "photos", label: "Photos & documents", note: "Partage direct", side: "right", row: 1 },
];

/** Tracés (repère 1100 × 420) : du centre de chaque source vers le cœur, le départ étant masqué par la carte. */
const hubPaths: Record<string, string> = {
  wa: "M 190 110 C 400 110, 420 210, 550 210",
  mail: "M 190 310 C 400 310, 420 210, 550 210",
  sms: "M 910 110 C 700 110, 680 210, 550 210",
  photos: "M 910 310 C 700 310, 680 210, 550 210",
};

const hubNotes = [
  { title: "Rien à réinstaller", text: "Vous gardez WhatsApp, votre messagerie et la galerie de votre téléphone." },
  { title: "Comptes professionnels uniquement", text: "Vous choisissez précisément ce qui est connecté — et ce qui ne l’est pas." },
  { title: "Vos échanges privés restent privés", text: `${BRAND} est pensé pour ne jamais aspirer vos conversations personnelles.` },
];

/** Schéma d’intégration : les sources convergent vers le cœur, des points lumineux circulent le long des lignes. */
function IntegrationHub() {
  const reduce = useReducedMotion();
  return (
    <div className="hub">
      <svg className="hub-lines" viewBox="0 0 1100 420" fill="none" aria-hidden>
        <defs>
          <filter id="hub-glow" x="-300%" y="-300%" width="700%" height="700%">
            <feGaussianBlur stdDeviation="3.5" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>
        {hubNodes.map((node, i) => (
          <g key={node.key}>
            <path id={`hub-path-${node.key}`} d={hubPaths[node.key]} stroke="rgba(255,255,255,.16)" strokeWidth="1.5" />
            {!reduce && (
              <circle r="4.5" fill="#ff6a3d" filter="url(#hub-glow)" opacity="0">
                <animateMotion dur="3.4s" begin={`${i * 0.85}s`} repeatCount="indefinite" calcMode="spline" keySplines="0.4 0 0.2 1" keyTimes="0;1">
                  <mpath href={`#hub-path-${node.key}`} />
                </animateMotion>
                <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.12;0.82;1" dur="3.4s" begin={`${i * 0.85}s`} repeatCount="indefinite" />
              </circle>
            )}
          </g>
        ))}
      </svg>

      {/* Le positionnement (translate) reste sur un div simple : Motion écrirait sinon son propre transform par-dessus. */}
      {hubNodes.map((node, i) => {
        const Glyph = node.glyph;
        return (
          <div key={node.key} className={`hub-node ${node.side} row-${node.row}`}>
            <motion.div
              className="hub-node-card"
              initial={reduce ? false : { opacity: 0, x: node.side === "left" ? -28 : 28, filter: "blur(8px)" }}
              whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.15 + i * 0.1, ease: EASE }}
            >
              <span className="hub-node-icon">{node.icon ? <Ico name={node.icon} size={28} /> : Glyph && <Glyph size={22} strokeWidth={2.4} />}</span>
              <div><strong>{node.label}</strong><small>{node.note}</small></div>
              <span className="hub-node-dot" aria-label="Connecté" />
            </motion.div>
          </div>
        );
      })}

      <div className="hub-center">
        <motion.div
          className="hub-center-inner"
          initial={reduce ? false : { opacity: 0, scale: 0.85 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, delay: 0.1, ease: EASE }}
        >
          <span className="hub-glow" />
          <span className="hub-ring" />
          <span className="hub-mark"><Logo size={92} /></span>
          <strong>{BRAND}</strong>
        </motion.div>
      </div>
    </div>
  );
}

export default function Home() {
  const { scrollY, scrollYProgress } = useScroll();
  const reduce = useReducedMotion();
  const [scrolled, setScrolled] = useState(false);
  useMotionValueEvent(scrollY, "change", (value) => setScrolled(value > 32));

  return (
    <main>
      <motion.div className="scroll-progress" style={{ scaleX: scrollYProgress }} />

      <header className={`nav-wrap ${scrolled ? "scrolled" : ""}`}>
        <nav className="nav container">
          <a className="brand" href="#top"><Logo size={38} />{BRAND}</a>
          <div className="nav-links">
            <a href="#fonctionnement">Fonctionnement</a>
            <a href="#features">Fonctionnalités</a>
            <a href="#devis">Devis</a>
            <a href="#canaux">Connexions</a>
          </div>
          <a className="nav-cta" href="#waitlist">Accès bêta <ArrowUpRight size={16} /></a>
        </nav>
      </header>

      <section className="hero" id="top">
        <div className="hero-noise" />
        <motion.div className="hero-orb orb-one" animate={reduce ? undefined : { y: [0, -22, 0], x: [0, 12, 0] }} transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }} />
        <motion.div className="hero-orb orb-two" animate={reduce ? undefined : { y: [0, 24, 0], x: [0, -14, 0] }} transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }} />

        <div className="container hero-grid">
          <div className="hero-copy">
            <motion.div initial={reduce ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <div className="launch-pill"><span>Accès bêta</span> Pensé avec des artisans <ChevronRight size={14} /></div>
            </motion.div>

            <motion.h1
              initial={reduce ? false : { opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.08, ease: EASE }}
            >
              Vos clients vous écrivent <em>partout.</em><br />On range tout au bon endroit.
            </motion.h1>

            <motion.p
              className="hero-sub"
              initial={reduce ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.18 }}
            >
              Centralisez les demandes reçues par WhatsApp, email et téléphone. {BRAND} transforme vos échanges en clients, devis, tâches et chantiers — sans ressaisie.
            </motion.p>

            <motion.div initial={reduce ? false : { opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.28 }}>
              <WaitlistForm />
            </motion.div>

            <motion.div className="hero-proof" initial={reduce ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.48 }}>
              <span><Check size={15} /> Pas de logiciel compliqué à apprendre</span>
              <span><Check size={15} /> Mobile + ordinateur</span>
            </motion.div>
          </div>

          <div className="hero-visual">
            <PhoneShowcase
              src="/home.png"
              alt={`Écran d’accueil de ${BRAND} : messages, devis, chantiers et tâches du jour`}
              width={941}
              height={1672}
              priority
              className="hero-phone"
              chips={[
                { icon: "messages", title: "Jean Dupont · WhatsApp", sub: "6 prises au lieu de 4 → ajouté au chantier", position: "tl", offset: { top: "23%" } },
                { icon: "devis", title: "Devis pré-rempli", sub: "Terrasse · 35 m² · 4 photos", position: "br" },
              ]}
            />
          </div>
        </div>

        <div className="container channel-strip">
          <span>Fonctionne avec vos habitudes</span>
          <div className="channel-list">
            <span><MessageCircle size={17} /> WhatsApp</span>
            <span><Mail size={17} /> Email</span>
            <span><Smartphone size={17} /> SMS</span>
            <span><ImageIcon size={17} /> Photos</span>
          </div>
        </div>
      </section>

      <section className="pain-section">
        <div className="container pain-grid">
          <Reveal direction="left">
            <h2>Le chantier n’est pas désorganisé.<br />L’information l’est.</h2>
          </Reveal>
          <Reveal direction="right" delay={0.1} className="pain-copy">
            <p>Une demande dans WhatsApp. Un plan par email. Une photo dans la galerie. Une modification dite au téléphone.</p>
            <p className="pain-highlight">Puis, le soir, il faut se souvenir de tout.</p>
          </Reveal>
        </div>
        <div className="container chaos-row">
          {([
            { text: "47 photos non classées", icon: "photos" },
            { text: "3 demandes à rappeler", icon: "telephone" },
            { text: "Devis à finir", icon: "devis" },
            { text: "Modification client", icon: "outils" },
            { text: "Matériel à commander", icon: "livraison" },
          ] as { text: string; icon: IconName }[]).map((item, i) => (
            <motion.div
              key={item.text}
              className="chaos-chip"
              initial={reduce ? false : { opacity: 0, y: 24, rotate: i % 2 ? 3 : -3 }}
              whileInView={{ opacity: 1, y: 0, rotate: i % 2 ? 1.2 : -1.2 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07, duration: 0.6, ease: EASE }}
              whileHover={reduce ? undefined : { rotate: 0, y: -3 }}
            ><Ico name={item.icon} size={24} />{item.text}</motion.div>
          ))}
        </div>
      </section>

      <section className="workflow-section" id="fonctionnement">
        <div className="workflow-bg" />
        <div className="container">
          <Reveal className="section-heading centered">
            <h2>Vous continuez à travailler.<br />{BRAND} structure le reste.</h2>
            <p>Le produit ne remplace pas vos habitudes. Il transforme ce qui arrive déjà en information exploitable, prête à être utilisée sur le chantier.</p>
          </Reveal>

          <div className="workflow-grid">
            <Reveal direction="left" className="workflow-input">
              <div className="workflow-label"><span>01</span> Vos clients écrivent</div>
              <div className="inbox-stack">
                {incomingMessages.map((message, i) => {
                  const Glyph = message.glyph;
                  return (
                    <motion.div
                      key={message.channel}
                      className="mini-message"
                      initial={reduce ? false : { opacity: 0, x: -36 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.25 + i * 0.14, duration: 0.7, ease: EASE }}
                      whileHover={reduce ? undefined : { x: 6 }}
                    >
                      <span className="ch-tile">{message.ico ? <Ico name={message.ico} size={28} /> : Glyph && <Glyph size={21} strokeWidth={2.4} />}</span>
                      <div>
                        <div className="mini-head"><strong>{message.sender}</strong><em>{message.channel}</em></div>
                        <p>{message.message}</p>
                      </div>
                      <small>{message.time}</small>
                    </motion.div>
                  );
                })}
              </div>
            </Reveal>

            <div className="workflow-center">
              <div className="flow-line in"><span className="flow-dot" /></div>
              <motion.div className="core-halo" animate={reduce ? undefined : { scale: [1, 1.22, 1], opacity: [0.5, 0.9, 0.5] }} transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut" }} />
              <motion.div
                className="ai-core"
                initial={reduce ? false : { scale: 0.8, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.3, ease: EASE }}
              >
                <motion.div className="core-ring ring-a" animate={reduce ? undefined : { rotate: 360 }} transition={{ duration: 18, repeat: Infinity, ease: "linear" }} />
                <motion.div className="core-ring ring-b" animate={reduce ? undefined : { rotate: -360 }} transition={{ duration: 13, repeat: Infinity, ease: "linear" }} />
                <Ico name="outils" size={52} />
                <span>Analyse</span>
              </motion.div>
              <div className="flow-line out"><span className="flow-dot" /></div>
            </div>

            <div className="workflow-output">
              <Reveal direction="right" delay={0.1}>
                <div className="workflow-label"><span>02</span> Tout est organisé dans le chantier</div>
              </Reveal>
              <PhoneShowcase
                src="/work.png"
                alt="Fiche du chantier Dupont : avancement, photos classées et tâches détectées"
                width={981}
                height={1602}
                className="workflow-phone"
                chips={[
                  { icon: "photos", title: "Photos classées", sub: "10 photos · Chantier Dupont", position: "tl", offset: { top: "45%" } },
                  { icon: "taches", title: "Tâche ajoutée", sub: "Valider 2 prises supplémentaires", position: "br", offset: { bottom: "24%" } },
                ]}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="features-section" id="features">
        <div className="container">
          <Reveal className="section-heading">
            <h2>Moins d’administratif.<br />Plus de chantier.</h2>
            <p>Six briques simples, pensées pour une journée d’artisan — pas pour un bureau.</p>
          </Reveal>

          <div className="features-grid">
            {features.map((feature, i) => (
              <FeatureCard key={feature.title} feature={feature} index={i} />
            ))}
          </div>
        </div>
      </section>

      <section className="quote-section" id="devis">
        <div className="quote-bg" />
        <div className="container quote-grid">
          <Reveal direction="left" className="quote-copy">
            <h2>Le client écrit.<br />Le devis commence déjà.</h2>
            <p className="lead">{BRAND} récupère le besoin, les coordonnées, les dimensions, les photos — et signale ce qu’il manque avant même que vous ouvriez le dossier.</p>
            <div className="quote-points">
              {quotePoints.map((point, i) => {
                return (
                  <motion.div
                    key={point.title}
                    className="quote-point"
                    initial={reduce ? false : { opacity: 0, x: -24 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + i * 0.12, duration: 0.7, ease: EASE }}
                  >
                    <span className="point-icon"><Ico name={point.icon} size={30} /></span>
                    <div>
                      <strong>{point.title}</strong>
                      <p>{point.text}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
            <a className="text-link" href="#waitlist">Tester sur mes demandes <ArrowRight size={18} /></a>
          </Reveal>

          <PhoneShowcase
            src="/quote.png"
            alt="Demande de devis reçue par WhatsApp : informations extraites par l’IA et questions manquantes"
            width={971}
            height={1619}
            className="quote-phone"
            chips={[
              { icon: "devis", title: "Extraites par l’IA", sub: "Projet · Surface · Ville · Photos", position: "tl", offset: { top: "37%" } },
              { icon: "messages", title: "4 questions à poser", sub: "Envoyées au client en un clic", position: "br", offset: { bottom: "28%" } },
            ]}
          />
        </div>
      </section>

      <section className="channels-section" id="canaux">
        <div className="container">
          <Reveal className="section-heading centered light">
            <h2>Pas besoin de changer votre façon de travailler.</h2>
            <p>Vos messages, mails, SMS et photos arrivent déjà quelque part. {BRAND} s’y branche — c’est tout.</p>
          </Reveal>

          <IntegrationHub />

          <div className="hub-notes">
            {hubNotes.map((note, i) => (
              <Reveal key={note.title} delay={0.1 + i * 0.1} distance={20} className="hub-note">
                <span className="hub-note-index">0{i + 1}</span>
                <strong>{note.title}</strong>
                <p>{note.text}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="before-after-section" id="avant-apres">
        <div className="container">
          <Reveal className="section-heading centered">
            <h2>La même journée.<br />Beaucoup moins de charge mentale.</h2>
            <p>Faites glisser le curseur : les mêmes moments, sans et avec {BRAND}.</p>
          </Reveal>
          <Reveal delay={0.1} distance={40}>
            <CompareSlider />
          </Reveal>
        </div>
      </section>

      <section className="cta-section" id="waitlist">
        <div className="container cta-inner">
          <motion.div className="cta-glow" animate={reduce ? undefined : { scale: [0.9, 1.12, 0.9], opacity: [0.35, 0.6, 0.35] }} transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }} />
          <Reveal className="cta-content">
            <span className="cta-icon"><Ico name="chantier" size={34} /></span>
            <h2>Vos prochains chantiers peuvent déjà être mieux organisés.</h2>
            <p>Rejoignez les premiers artisans qui testeront {BRAND} et participez directement à la construction du produit.</p>
            <WaitlistForm compact />
            <div className="cta-meta"><span><Check size={15} /> Gratuit pendant la bêta</span><span><Check size={15} /> Places limitées</span></div>
          </Reveal>
        </div>
      </section>

      <footer>
        <div className="container footer-inner">
          <a className="brand" href="#top"><Logo size={38} />{BRAND}</a>
          <p>Le copilote administratif des artisans.</p>
          <span>© 2026 {BRAND}</span>
        </div>
      </footer>
    </main>
  );
}
