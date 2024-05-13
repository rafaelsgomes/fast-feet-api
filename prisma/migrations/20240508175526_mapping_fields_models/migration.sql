/*
  Warnings:

  - You are about to drop the column `answer_id` on the `attachments` table. All the data in the column will be lost.
  - You are about to drop the column `additionalAddressInformation` on the `deliveries` table. All the data in the column will be lost.
  - You are about to drop the column `deliverymanId` on the `deliveries` table. All the data in the column will be lost.
  - You are about to drop the column `recipientId` on the `deliveries` table. All the data in the column will be lost.
  - You are about to drop the column `zipCode` on the `deliveries` table. All the data in the column will be lost.
  - Added the required column `additional_address_information` to the `deliveries` table without a default value. This is not possible if the table is not empty.
  - Added the required column `recipient_id` to the `deliveries` table without a default value. This is not possible if the table is not empty.
  - Added the required column `zip_code` to the `deliveries` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "deliveries" DROP CONSTRAINT "deliveries_deliverymanId_fkey";

-- DropForeignKey
ALTER TABLE "deliveries" DROP CONSTRAINT "deliveries_recipientId_fkey";

-- AlterTable
ALTER TABLE "attachments" DROP COLUMN "answer_id";

-- AlterTable
ALTER TABLE "deliveries" DROP COLUMN "additionalAddressInformation",
DROP COLUMN "deliverymanId",
DROP COLUMN "recipientId",
DROP COLUMN "zipCode",
ADD COLUMN     "additional_address_information" TEXT NOT NULL,
ADD COLUMN     "deliveryman_id" TEXT,
ADD COLUMN     "recipient_id" TEXT NOT NULL,
ADD COLUMN     "zip_code" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "deliveries" ADD CONSTRAINT "deliveries_recipient_id_fkey" FOREIGN KEY ("recipient_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "deliveries" ADD CONSTRAINT "deliveries_deliveryman_id_fkey" FOREIGN KEY ("deliveryman_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
