-- CreateEnum
CREATE TYPE "BountyStatus" AS ENUM ('OPEN', 'CLOSED');

-- CreateTable
CREATE TABLE "Bounty" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "amount" INTEGER NOT NULL,
    "status" "BountyStatus" NOT NULL DEFAULT 'OPEN',
    "createdById" TEXT NOT NULL,
    "fulfilledById" TEXT,
    "fulfilledCourseId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Bounty_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Bounty_status_idx" ON "Bounty"("status");

-- CreateIndex
CREATE INDEX "Bounty_createdById_idx" ON "Bounty"("createdById");

-- AddForeignKey
ALTER TABLE "Bounty" ADD CONSTRAINT "Bounty_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bounty" ADD CONSTRAINT "Bounty_fulfilledById_fkey" FOREIGN KEY ("fulfilledById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bounty" ADD CONSTRAINT "Bounty_fulfilledCourseId_fkey" FOREIGN KEY ("fulfilledCourseId") REFERENCES "Course"("id") ON DELETE SET NULL ON UPDATE CASCADE;
