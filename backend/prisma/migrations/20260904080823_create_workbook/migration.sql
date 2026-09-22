-- CreateEnum
CREATE TYPE "WorkbookPermission" AS ENUM ('EDITOR', 'VIEWER');

-- CreateTable
CREATE TABLE "Workbook" (
    "id" TEXT NOT NULL,
    "owner_id" TEXT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Workbook_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkbookPermissionRecord" (
    "id" TEXT NOT NULL,
    "workbook_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "permission" "WorkbookPermission" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WorkbookPermissionRecord_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Workbook_owner_id_idx" ON "Workbook"("owner_id");

-- CreateIndex
CREATE INDEX "WorkbookPermissionRecord_user_id_idx" ON "WorkbookPermissionRecord"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "WorkbookPermissionRecord_workbook_id_user_id_key" ON "WorkbookPermissionRecord"("workbook_id", "user_id");

-- AddForeignKey
ALTER TABLE "Workbook" ADD CONSTRAINT "Workbook_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkbookPermissionRecord" ADD CONSTRAINT "WorkbookPermissionRecord_workbook_id_fkey" FOREIGN KEY ("workbook_id") REFERENCES "Workbook"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkbookPermissionRecord" ADD CONSTRAINT "WorkbookPermissionRecord_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
