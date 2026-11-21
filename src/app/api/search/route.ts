import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { handleError } from "@/lib/api";
import { searchQuerySchema } from "@/lib/validators";

export async function GET(req: NextRequest) {
  try {
    const { q } = searchQuerySchema.parse(Object.fromEntries(req.nextUrl.searchParams));
    const contains = { contains: q, mode: "insensitive" as const };

    const [models, labs, providers] = await Promise.all([
      prisma.model.findMany({
        where: { OR: [{ name: contains }, { lab: { name: contains } }] },
        take: 5,
        orderBy: { releaseDate: "desc" },
        select: { name: true, slug: true, type: true, lab: { select: { name: true } } },
      }),
      prisma.lab.findMany({ where: { name: contains }, take: 5, select: { name: true, slug: true } }),
      prisma.provider.findMany({ where: { name: contains }, take: 5, select: { name: true, slug: true } }),
    ]);

    return NextResponse.json({ data: { models, labs, providers } });
  } catch (e) {
    return handleError(e);
  }
}