import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Logo } from "../components/Logo";
import { SiteFooter } from "../components/SiteFooter";
import { SITE } from "../site";

export const metadata: Metadata = {
  title: `Mentions légales & confidentialité — ${SITE.name}`,
  description: `Mentions légales, hébergement et politique de confidentialité du site ${SITE.domain}.`,
};

const editorName = `${SITE.editor.firstName} ${SITE.editor.lastName}`;

/** Affiche la valeur, ou un repère surligné si elle reste à compléter. */
function Field({ value, placeholder }: { value: string; placeholder: string }) {
  return value ? <>{value}</> : <mark>{placeholder}</mark>;
}

const sections = [
  { id: "editeur", label: "Éditeur" },
  { id: "hebergement", label: "Hébergement" },
  { id: "propriete", label: "Propriété intellectuelle" },
  { id: "donnees", label: "Données personnelles" },
  { id: "cookies", label: "Cookies" },
  { id: "credits", label: "Crédits" },
  { id: "contact", label: "Contact" },
];

export default function MentionsLegales() {
  return (
    <>
      <header className="legal-header">
        <nav className="nav container">
          <Link className="brand" href="/"><Logo size={38} />{SITE.name}</Link>
          <Link className="legal-back" href="/"><ArrowLeft size={16} /> Retour au site</Link>
        </nav>
      </header>

      <main className="legal">
        <div className="container legal-doc">
          <h1>Mentions légales &amp; politique de confidentialité</h1>
          <p className="legal-updated">Dernière mise à jour : {SITE.legalUpdatedAt}</p>

          <nav className="legal-toc" aria-label="Sommaire">
            {sections.map((section) => <a key={section.id} href={`#${section.id}`}>{section.label}</a>)}
          </nav>

          <section id="editeur">
            <h2>1. Éditeur du site</h2>
            <p>
              Le site <a href={SITE.url}>{SITE.domain}</a> est édité par <strong>{editorName}</strong>
              {SITE.editor.status ? `, ${SITE.editor.status}` : <>, <mark>statut juridique à compléter</mark></>}.
            </p>
            <ul>
              <li>Adresse : <Field value={SITE.editor.address} placeholder="adresse postale à compléter" /></li>
              <li>SIREN / SIRET : <Field value={SITE.editor.siren} placeholder="à compléter, ou retirer cette ligne si non applicable" /></li>
              <li>Email : <a href={`mailto:${SITE.contactEmail}`}>{SITE.contactEmail}</a></li>
              <li>Directeur de la publication : {editorName}</li>
            </ul>
          </section>

          <section id="hebergement">
            <h2>2. Hébergement</h2>
            <p>
              Le site est hébergé par <strong>{SITE.host.name}</strong>, {SITE.host.address} —{" "}
              <a href={SITE.host.url} target="_blank" rel="noopener noreferrer">{SITE.host.url}</a>.
            </p>
            <p>
              La liste d’attente (adresses email collectées via le formulaire d’accès bêta) est stockée et gérée par{" "}
              <strong>{SITE.emailProvider.name}</strong>, {SITE.emailProvider.address} —{" "}
              <a href={SITE.emailProvider.url} target="_blank" rel="noopener noreferrer">{SITE.emailProvider.url}</a>.
            </p>
          </section>

          <section id="propriete">
            <h2>3. Propriété intellectuelle</h2>
            <p>
              L’ensemble des contenus du site (textes, logo, maquettes d’application, illustrations, code) est la propriété de {editorName},
              sauf mention contraire. Toute reproduction, représentation, modification ou diffusion, totale ou partielle, sans autorisation
              écrite préalable est interdite. Les marques et logos de tiers cités sur le site (WhatsApp, Gmail, Outlook, etc.) appartiennent
              à leurs propriétaires respectifs.
            </p>
          </section>

          <section id="donnees">
            <h2>4. Données personnelles (RGPD)</h2>
            <p><strong>Responsable du traitement :</strong> {editorName}, joignable à <a href={`mailto:${SITE.contactEmail}`}>{SITE.contactEmail}</a>.</p>
            <p>
              <strong>Données collectées :</strong> lorsque vous rejoignez la liste d’attente, nous enregistrons votre adresse email et la date
              d’inscription. L’hébergeur peut par ailleurs traiter des données techniques (adresse IP, type de navigateur) dans ses journaux
              de sécurité.
            </p>
            <p>
              <strong>Finalité et base légale :</strong> ces données servent uniquement à gérer l’accès à la version bêta de {SITE.name} et à
              vous informer de son lancement et de ses évolutions. Le traitement repose sur votre consentement (article 6.1.a du RGPD),
              exprimé en saisissant votre email dans le formulaire.
            </p>
            <p>
              <strong>Destinataires et transferts :</strong> les données sont traitées par {SITE.editor.firstName} {SITE.editor.lastName} et
              par ses sous-traitants {SITE.emailProvider.name} (stockage de la liste et envoi des emails) et {SITE.host.name} (hébergement),
              tous deux situés aux États-Unis. Ces transferts sont encadrés par le Data Privacy Framework UE–États-Unis et/ou les clauses
              contractuelles types de la Commission européenne. Aucune donnée n’est vendue ni cédée à des tiers.
            </p>
            <p>
              <strong>Durée de conservation :</strong> votre email est conservé jusqu’à votre désinscription, et au plus tard trois ans après
              votre dernier contact avec {SITE.name}.
            </p>
            <p>
              <strong>Vos droits :</strong> vous disposez d’un droit d’accès, de rectification, d’effacement, d’opposition, de limitation et de
              portabilité de vos données, ainsi que du droit de retirer votre consentement à tout moment. Chaque email envoyé comporte un lien
              de désinscription ; vous pouvez aussi écrire à <a href={`mailto:${SITE.contactEmail}`}>{SITE.contactEmail}</a>. Si vous estimez
              que vos droits ne sont pas respectés, vous pouvez saisir la CNIL (<a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer">www.cnil.fr</a>).
            </p>
          </section>

          <section id="cookies">
            <h2>5. Cookies</h2>
            <p>
              Le site n’utilise aucun cookie publicitaire ni outil de mesure d’audience. Seuls des cookies strictement techniques peuvent être
              déposés par l’hébergeur pour assurer le fonctionnement et la sécurité du service ; ils ne nécessitent pas de consentement.
            </p>
          </section>

          <section id="credits">
            <h2>6. Crédits</h2>
            <p>
              Conception et réalisation : {editorName}. Photos de chantier : <a href="https://unsplash.com" target="_blank" rel="noopener noreferrer">Unsplash</a>{" "}
              (licence Unsplash). Pictogrammes : <a href="https://lucide.dev" target="_blank" rel="noopener noreferrer">Lucide</a> et créations
              originales.
            </p>
          </section>

          <section id="contact">
            <h2>7. Contact</h2>
            <p>
              Pour toute question relative au site ou à vos données : <a href={`mailto:${SITE.contactEmail}`}>{SITE.contactEmail}</a>.
            </p>
          </section>
        </div>
      </main>

      <SiteFooter />
    </>
  );
}
