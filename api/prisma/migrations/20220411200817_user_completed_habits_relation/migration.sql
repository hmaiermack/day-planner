/*
  Warnings:

  - Added the required column `userId` to the `completedHabits` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "completedHabits" ADD COLUMN     "userId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "completedHabits" ADD CONSTRAINT "completedHabits_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
