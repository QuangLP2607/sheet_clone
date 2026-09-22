-- CreateTable
CREATE TABLE "Sheet" (
    "id" TEXT NOT NULL,
    "workbook_id" TEXT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "position" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Sheet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Cell" (
    "id" TEXT NOT NULL,
    "sheet_id" TEXT NOT NULL,
    "row_index" INTEGER NOT NULL,
    "column_index" INTEGER NOT NULL,
    "content" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Cell_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Sheet_workbook_id_idx" ON "Sheet"("workbook_id");

-- CreateIndex
CREATE UNIQUE INDEX "Sheet_workbook_id_position_key" ON "Sheet"("workbook_id", "position");

-- CreateIndex
CREATE INDEX "Cell_sheet_id_idx" ON "Cell"("sheet_id");

-- CreateIndex
CREATE UNIQUE INDEX "Cell_sheet_id_row_index_column_index_key" ON "Cell"("sheet_id", "row_index", "column_index");

-- AddForeignKey
ALTER TABLE "Sheet" ADD CONSTRAINT "Sheet_workbook_id_fkey" FOREIGN KEY ("workbook_id") REFERENCES "Workbook"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cell" ADD CONSTRAINT "Cell_sheet_id_fkey" FOREIGN KEY ("sheet_id") REFERENCES "Sheet"("id") ON DELETE CASCADE ON UPDATE CASCADE;
