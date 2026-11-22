import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { handleError } from "@/lib/api";
import { rankingsQuerySchema } from "@/lib/validators";

export async function GET(req: NextRequest) {
  try {
    const { benchmark, category, type, limit } = rankingsQuerySchema.parse(
      Object.fromEntries(req.nextUrl.searchParams)
    );

    const scores = await prisma.benchmarkScore.findMany({
      where: {
        benchmark: {
          ...(benchmark && { slug: benchmark }),
          ...(category && { category }),
        },
        ...(type && { model: { type } }),
      },
      include: {
        benchmark: { select: { name: true, slug: true, category: true } },
        model: {
          select: {
            id: true,
            name: true,
            slug: true,
            releaseDate: true,
            minInputPrice: true,
            lab: { select: { name: true, slug: true } },
          },
        },
      },
    });

    // group scores per model and average them
    const byModel = new Map<
      string,
      { model: (typeof scores)[number]["model"]; values: number[]; benchmarks: string[] }
    >();
    for (const s of scores) {
      const entry = byModel.get(s.modelId) ?? { model: s.model, values: [], benchmarks: [] };
      entry.values.push(s.score);
      entry.benchmarks.push(s.benchmark.name);
      byModel.set(s.modelId, entry);
    }

    const data = [...byModel.values()]
      .map((e) => ({
        model: e.model,
        score: Math.round((e.values.reduce((a, b) => a + b, 0) / e.values.length) * 10) / 10,
        benchmarks: e.benchmarks,
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map((row, i) => ({ rank: i + 1, ...row }));

    return NextResponse.json({ data, total: byModel.size });
  } catch (e) {
    return handleError(e);
  }
}