-- CreateTable
CREATE TABLE "BountyNotification" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "bountyId" TEXT NOT NULL,
    "seen" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BountyNotification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "BountyNotification_userId_idx" ON "BountyNotification"("userId");

-- CreateIndex
CREATE INDEX "BountyNotification_seen_idx" ON "BountyNotification"("seen");

-- CreateIndex
CREATE INDEX "BountyNotification_createdAt_idx" ON "BountyNotification"("createdAt");

-- AddForeignKey
ALTER TABLE "BountyNotification" ADD CONSTRAINT "BountyNotification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BountyNotification" ADD CONSTRAINT "BountyNotification_bountyId_fkey" FOREIGN KEY ("bountyId") REFERENCES "Bounty"("id") ON DELETE CASCADE ON UPDATE CASCADE;
