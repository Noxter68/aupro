# Aupro — Landing artisans

Landing page Next.js / TypeScript pour tester une waitlist autour d'un assistant de gestion pour artisans.

## Stack
- Next.js (App Router)
- TypeScript
- Motion for React (successeur actuel de Framer Motion)
- Lucide React
- CSS responsive sans dépendance UI

## Lancer le projet
```bash
npm install
npm run dev
```
Puis ouvrir http://localhost:3000.

## Personnaliser rapidement
- Nom du produit : `app/page.tsx` → `const BRAND = "Aupro"`
- Couleurs : `app/globals.css` → variables dans `:root`
- Textes / features : tableaux `incomingMessages`, `features` et sections dans `app/page.tsx`

## Waitlist → Resend
Le formulaire appelle `POST /api/waitlist` (`app/api/waitlist/route.ts`), qui ajoute l'email à l'audience (segment) Resend **aupro-beta** — créée automatiquement si elle n'existe pas. Un email déjà connu est simplement ajouté au segment. Un champ pot-de-miel filtre les bots.

Configuration : copier `.env.example` en `.env.local` et renseigner `RESEND_API_KEY` (clé « Full access », depuis https://resend.com/api-keys). Variables optionnelles : `RESEND_AUDIENCE_NAME` (défaut `aupro-beta`), `RESEND_AUDIENCE_ID` pour fixer l'identifiant. Ne jamais committer `.env.local`.
