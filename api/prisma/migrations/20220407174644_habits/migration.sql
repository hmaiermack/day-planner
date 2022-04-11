-- CreateTable
CREATE TABLE "habits" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "habitDays" BOOLEAN[],
    "remindTime" TEXT,
    "remindDays" BOOLEAN[],
    "userId" INTEGER NOT NULL,

    CONSTRAINT "habits_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "completedHabits" (
    "id" SERIAL NOT NULL,
    "dateCompleted" TIMESTAMP(3) NOT NULL,
    "habitId" INTEGER NOT NULL,

    CONSTRAINT "completedHabits_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "habits_name_key" ON "habits"("name");

-- AddForeignKey
ALTER TABLE "habits" ADD CONSTRAINT "habits_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "completedHabits" ADD CONSTRAINT "completedHabits_habitId_fkey" FOREIGN KEY ("habitId") REFERENCES "habits"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
