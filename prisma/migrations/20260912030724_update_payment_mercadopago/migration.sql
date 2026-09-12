/*
  Warnings:

  - You are about to drop the column `mercadoPagoId` on the `Payment` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[courtId,bookingDate,startHour]` on the table `Booking` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[mercadoPagoOrderId]` on the table `Payment` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[mercadoPagoPaymentId]` on the table `Payment` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Booking_active_slot_key";

-- DropIndex
DROP INDEX "Payment_mercadoPagoId_key";

-- AlterTable
ALTER TABLE "Payment" DROP COLUMN "mercadoPagoId",
ADD COLUMN     "checkoutUrl" TEXT,
ADD COLUMN     "mercadoPagoOrderId" TEXT,
ADD COLUMN     "mercadoPagoPaymentId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Booking_active_slot_key" ON "Booking"("courtId", "bookingDate", "startHour") WHERE ("status" IN ('PENDING', 'CONFIRMED'));

-- CreateIndex
CREATE UNIQUE INDEX "Payment_mercadoPagoOrderId_key" ON "Payment"("mercadoPagoOrderId");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_mercadoPagoPaymentId_key" ON "Payment"("mercadoPagoPaymentId");
