import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { handleError } from "@/lib/api";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const [labs, providers, benchmarks, capRows] = await Promise.all([
      prisma.lab.findMany({ orderBy: { name: "asc" }, select: { name: true, slug: true } }),
      prisma.provider.findMany({ orderBy: { name: "asc" }, select: { name: true, slug: true } }),
      prisma.benchmark.findMany({
        orderBy: { name: "asc" },
        select: { name: true, slug: true, category: true },
      }),
      prisma.model.findMany({ select: { capabilities: true } }),
    ]);

    const capabilities = [...new Set(capRows.flatMap((r) => r.capabilities))].sort();
    const categories = [...new Set(benchmarks.map((b) => b.category))].sort();
    const types = ["LLM", "IMAGE", "EMBEDDING", "AUDIO", "MULTIMODAL"];

    return NextResponse.json({ data: { labs, providers, benchmarks, categories, capabilities, types } });
  } catch (e) {
    return handleError(e);
  }
}