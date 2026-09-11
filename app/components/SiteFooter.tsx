import Link from "next/link";
import { Logo } from "./Logo";
import { SITE } from "../site";

export function SiteFooter() {
  return (
    <footer>
      <div className="container footer-inner">
        <div className="footer-brand">
          <Link className="brand" href="/#top"><Logo size={38} />{SITE.name}</Link>
          <p>{SITE.tagline}</p>
        </div>
        <nav className="footer-links" aria-label="Liens légaux">
          <Link href="/mentions-legales">Mentions légales</Link>
          <Link href="/mentions-legales#donnees">Politique de confidentialité</Link>
          <a href={`mailto:${SITE.contactEmail}`}>{SITE.contactEmail}</a>
        </nav>
        <div className="footer-meta">
          <span>© {new Date().getFullYear()} {SITE.name}</span>
          <span>Hébergé par <a href={SITE.host.url} target="_blank" rel="noopener noreferrer">Vercel</a></span>
        </div>
      </div>
    </footer>
  );
}
