/*
  Warnings:

  - A unique constraint covering the columns `[courtId,bookingDate,startHour]` on the table `Booking` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Booking_active_slot_key";

-- AlterTable
ALTER TABLE "Booking" ADD COLUMN     "expiresAt" TIMESTAMP(3);

-- CreateIndex
CREATE UNIQUE INDEX "Booking_active_slot_key" ON "Booking"("courtId", "bookingDate", "startHour") WHERE ("status" IN ('PENDING', 'CONFIRMED'));
