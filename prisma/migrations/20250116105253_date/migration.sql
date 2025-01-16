/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `user` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "user" ALTER COLUMN "date_of_birth" SET DATA TYPE VARCHAR(99);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");
