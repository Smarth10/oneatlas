import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { handleError } from "@/lib/api";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const data = await prisma.lab.findMany({
      orderBy: { name: "asc" },
      include: { _count: { select: { models: true } } },
    });
    return NextResponse.json({ data });
  } catch (e) {
    return handleError(e);
  }
}