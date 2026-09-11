import { NextResponse } from "next/server";
import { Resend } from "resend";

export const runtime = "nodejs";

/** Nom de l’audience (segment) Resend qui reçoit les inscriptions à la bêta. */
const AUDIENCE_NAME = process.env.RESEND_AUDIENCE_NAME?.trim() || "aupro-beta";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

let segmentIdCache: string | null = null;

/** Retrouve l’identifiant du segment nommé AUDIENCE_NAME (ou le crée s’il n’existe pas encore). */
async function resolveSegmentId(resend: Resend): Promise<string> {
  const fromEnv = process.env.RESEND_AUDIENCE_ID?.trim();
  if (fromEnv) return fromEnv;
  if (segmentIdCache) return segmentIdCache;

  let after: string | undefined;
  for (let page = 0; page < 10; page++) {
    const { data, error } = await resend.segments.list(after ? { limit: 100, after } : { limit: 100 });
    if (error) throw new Error(`Resend segments.list : ${error.message}`);
    const found = data.data.find((segment) => segment.name === AUDIENCE_NAME);
    if (found) {
      segmentIdCache = found.id;
      return found.id;
    }
    if (!data.has_more || data.data.length === 0) break;
    after = data.data[data.data.length - 1].id;
  }

  const created = await resend.segments.create({ name: AUDIENCE_NAME });
  if (created.error) throw new Error(`Resend segments.create : ${created.error.message}`);
  segmentIdCache = created.data.id;
  return created.data.id;
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { email?: unknown; website?: unknown } | null;

  // Champ pot-de-miel : un humain ne le remplit jamais, on répond « ok » sans rien enregistrer.
  if (body?.website) return NextResponse.json({ ok: true });

  const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
  if (!EMAIL_RE.test(email)) return NextResponse.json({ ok: false, error: "invalid_email" }, { status: 400 });

  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) {
    console.error("[waitlist] RESEND_API_KEY manquante dans .env.local");
    return NextResponse.json({ ok: false, error: "not_configured" }, { status: 500 });
  }

  const resend = new Resend(apiKey);
  try {
    const segmentId = await resolveSegmentId(resend);

    const created = await resend.contacts.create({ email, unsubscribed: false, segments: [{ id: segmentId }] });
    if (!created.error) return NextResponse.json({ ok: true });

    // Contact déjà connu (inscription précédente ou autre segment) : on l’ajoute simplement au segment.
    const added = await resend.contacts.segments.add({ email, segmentId });
    if (!added.error || /already/i.test(added.error.message)) return NextResponse.json({ ok: true });

    console.error("[waitlist] Resend :", created.error.message, "/", added.error.message);
    return NextResponse.json({ ok: false, error: "resend_error" }, { status: 502 });
  } catch (error) {
    console.error("[waitlist]", error);
    return NextResponse.json({ ok: false, error: "resend_error" }, { status: 502 });
  }
}
