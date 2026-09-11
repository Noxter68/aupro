import Image from "next/image";

/** Logo de l’app (public/logo/aupro-logo.png), déjà arrondi et sur fond bleu foncé. */
export function Logo({ size = 36, className = "" }: { size?: number; className?: string }) {
  return (
    <span className={`logo-mark ${className}`} style={{ width: size, height: size }} aria-hidden>
      <Image src="/logo/aupro-logo.png" alt="" fill sizes={`${size * 2}px`} style={{ objectFit: "contain" }} priority={size >= 36} />
    </span>
  );
}
