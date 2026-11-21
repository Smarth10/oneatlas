import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiError, handleError } from "@/lib/api";
import { compareQuerySchema } from "@/lib/validators";

export async function GET(req: NextRequest) {
  try {
    const { models: slugs } = compareQuerySchema.parse(
      Object.fromEntries(req.nextUrl.searchParams)
    );

    const found = await prisma.model.findMany({
      where: { slug: { in: slugs } },
      include: {
        lab: { select: { name: true, slug: true } },
        providers: { include: { provider: { select: { name: true, slug: true } } } },
        scores: { include: { benchmark: true } },
      },
    });

    const missing = slugs.filter((s) => !found.some((m) => m.slug === s));
    if (missing.length) {
      return apiError("NOT_FOUND", `Unknown model(s): ${missing.join(", ")}`, 404);
    }

    // keep the order the caller asked for
    const data = slugs.map((s) => found.find((m) => m.slug === s)!);
    return NextResponse.json({ data });
  } catch (e) {
    return handleError(e);
  }
}