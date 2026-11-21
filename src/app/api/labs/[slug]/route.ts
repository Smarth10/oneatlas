import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiError, handleError } from "@/lib/api";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const lab = await prisma.lab.findUnique({
      where: { slug },
      include: { models: { orderBy: { releaseDate: "desc" } } },
    });
    if (!lab) return apiError("NOT_FOUND", `Lab "${slug}" not found`, 404);
    return NextResponse.json({ data: lab });
  } catch (e) {
    return handleError(e);
  }
}