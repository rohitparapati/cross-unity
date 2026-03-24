-- AlterTable
ALTER TABLE "Inquiry" ADD COLUMN     "ipAddress" TEXT,
ADD COLUMN     "userAgent" TEXT;

-- CreateIndex
CREATE INDEX "Inquiry_email_idx" ON "Inquiry"("email");
