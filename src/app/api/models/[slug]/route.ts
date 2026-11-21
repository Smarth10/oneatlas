import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiError, handleError } from "@/lib/api";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const model = await prisma.model.findUnique({
      where: { slug },
      include: {
        lab: true,
        providers: {
          include: { provider: true },
          orderBy: { inputPricePerM: "asc" },
        },
        scores: { include: { benchmark: true } },
      },
    });
    if (!model) return apiError("NOT_FOUND", `Model "${slug}" not found`, 404);
    return NextResponse.json({ data: model });
  } catch (e) {
    return handleError(e);
  }
}