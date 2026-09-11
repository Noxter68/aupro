import Link from "next/link";
import { Logo } from "./Logo";
import { SITE } from "../site";

export function SiteFooter() {
  return (
    <footer>
      <div className="container footer-inner">
        <Link className="brand" href="/#top"><Logo size={38} />{SITE.name}</Link>
        <nav className="footer-links" aria-label="Liens légaux">
          <Link href="/mentions-legales">Mentions légales</Link>
          <Link href="/mentions-legales#donnees">Politique de confidentialité</Link>
        </nav>
        <span className="footer-meta">© {new Date().getFullYear()} {SITE.name}</span>
      </div>
    </footer>
  );
}
