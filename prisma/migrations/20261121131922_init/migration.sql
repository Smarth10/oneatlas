-- CreateEnum
CREATE TYPE "ModelType" AS ENUM ('LLM', 'IMAGE', 'EMBEDDING', 'AUDIO', 'MULTIMODAL');

-- CreateTable
CREATE TABLE "Lab" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "website" TEXT NOT NULL,
    "country" TEXT,

    CONSTRAINT "Lab_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Provider" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "website" TEXT NOT NULL,

    CONSTRAINT "Provider_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Model" (
    "id" TEXT NOT NULL,
    "labId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "type" "ModelType" NOT NULL,
    "description" TEXT NOT NULL,
    "contextWindow" INTEGER NOT NULL,
    "releaseDate" TIMESTAMP(3) NOT NULL,
    "inputModalities" TEXT[],
    "outputModalities" TEXT[],
    "capabilities" TEXT[],
    "minInputPrice" DOUBLE PRECISION,

    CONSTRAINT "Model_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ModelProvider" (
    "modelId" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "inputPricePerM" DOUBLE PRECISION NOT NULL,
    "outputPricePerM" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "ModelProvider_pkey" PRIMARY KEY ("modelId","providerId")
);

-- CreateTable
CREATE TABLE "Benchmark" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "maxScore" DOUBLE PRECISION NOT NULL DEFAULT 100,

    CONSTRAINT "Benchmark_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BenchmarkScore" (
    "modelId" TEXT NOT NULL,
    "benchmarkId" TEXT NOT NULL,
    "score" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "BenchmarkScore_pkey" PRIMARY KEY ("modelId","benchmarkId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Lab_slug_key" ON "Lab"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Provider_slug_key" ON "Provider"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Model_slug_key" ON "Model"("slug");

-- CreateIndex
CREATE INDEX "Model_labId_idx" ON "Model"("labId");

-- CreateIndex
CREATE INDEX "Model_type_idx" ON "Model"("type");

-- CreateIndex
CREATE INDEX "Model_releaseDate_idx" ON "Model"("releaseDate");

-- CreateIndex
CREATE INDEX "Model_contextWindow_idx" ON "Model"("contextWindow");

-- CreateIndex
CREATE INDEX "Model_minInputPrice_idx" ON "Model"("minInputPrice");

-- CreateIndex
CREATE INDEX "ModelProvider_providerId_idx" ON "ModelProvider"("providerId");

-- CreateIndex
CREATE UNIQUE INDEX "Benchmark_slug_key" ON "Benchmark"("slug");

-- CreateIndex
CREATE INDEX "Benchmark_category_idx" ON "Benchmark"("category");

-- CreateIndex
CREATE INDEX "BenchmarkScore_benchmarkId_score_idx" ON "BenchmarkScore"("benchmarkId", "score");

-- AddForeignKey
ALTER TABLE "Model" ADD CONSTRAINT "Model_labId_fkey" FOREIGN KEY ("labId") REFERENCES "Lab"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ModelProvider" ADD CONSTRAINT "ModelProvider_modelId_fkey" FOREIGN KEY ("modelId") REFERENCES "Model"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ModelProvider" ADD CONSTRAINT "ModelProvider_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "Provider"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BenchmarkScore" ADD CONSTRAINT "BenchmarkScore_modelId_fkey" FOREIGN KEY ("modelId") REFERENCES "Model"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BenchmarkScore" ADD CONSTRAINT "BenchmarkScore_benchmarkId_fkey" FOREIGN KEY ("benchmarkId") REFERENCES "Benchmark"("id") ON DELETE CASCADE ON UPDATE CASCADE;
