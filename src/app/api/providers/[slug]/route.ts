import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiError, handleError } from "@/lib/api";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const provider = await prisma.provider.findUnique({
      where: { slug },
      include: {
        models: {
          orderBy: { inputPricePerM: "asc" },
          include: {
            model: { include: { lab: { select: { name: true, slug: true } } } },
          },
        },
      },
    });
    if (!provider) return apiError("NOT_FOUND", `Provider "${slug}" not found`, 404);
    return NextResponse.json({ data: provider });
  } catch (e) {
    return handleError(e);
  }
}