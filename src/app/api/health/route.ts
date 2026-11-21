import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const env = {
    DATABASE_URL: Boolean(process.env.DATABASE_URL),
    DATABASE_URL_starts_with_postgresql: (process.env.DATABASE_URL ?? "").startsWith("postgresql://"),
    DIRECT_URL: Boolean(process.env.DIRECT_URL),
  };
  try {
    const models = await prisma.model.count();
    return NextResponse.json({ ok: true, models, env });
  } catch (e) {
    const err = e as { code?: string; message?: string };
    return NextResponse.json(
      { ok: false, code: err.code ?? null, message: String(err.message ?? e).slice(0, 600), env },
      { status: 500 }
    );
  }
}