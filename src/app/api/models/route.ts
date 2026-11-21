import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { handleError } from "@/lib/api";
import { modelsQuerySchema } from "@/lib/validators";

const orderByMap: Record<string, Prisma.ModelOrderByWithRelationInput> = {
  release_desc: { releaseDate: "desc" },
  price_asc: { minInputPrice: "asc" },
  price_desc: { minInputPrice: "desc" },
  context_desc: { contextWindow: "desc" },
};

export async function GET(req: NextRequest) {
  try {
    const { q, lab, provider, type, capability, sort, page, limit } =
      modelsQuerySchema.parse(Object.fromEntries(req.nextUrl.searchParams));

    const where: Prisma.ModelWhereInput = {
      ...(q && {
        OR: [
          { name: { contains: q, mode: "insensitive" } },
          { description: { contains: q, mode: "insensitive" } },
          { lab: { name: { contains: q, mode: "insensitive" } } },
        ],
      }),
      ...(lab && { lab: { slug: lab } }),
      ...(provider && { providers: { some: { provider: { slug: provider } } } }),
      ...(type && { type }),
      ...(capability && { capabilities: { has: capability } }),
    };

    const [total, data] = await Promise.all([
      prisma.model.count({ where }),
      prisma.model.findMany({
        where,
        orderBy: [orderByMap[sort], { id: "asc" }],
        skip: (page - 1) * limit,
        take: limit,
        include: {
          lab: { select: { name: true, slug: true } },
          providers: {
            include: { provider: { select: { name: true, slug: true } } },
          },
        },
      }),
    ]);

    return NextResponse.json({
      data,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    });
  } catch (e) {
    return handleError(e);
  }
}