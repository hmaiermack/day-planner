-- AlterTable
ALTER TABLE "completedHabits" ALTER COLUMN "dateCompleted" SET DEFAULT CURRENT_TIMESTAMP;

-- CreateIndex
CREATE INDEX "completedHabits_dateCompleted_idx" ON "completedHabits"("dateCompleted");
