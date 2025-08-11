-- AlterEnum
ALTER TYPE "BookingStatus" ADD VALUE 'PAID';

-- AlterTable
ALTER TABLE "Booking" ADD COLUMN     "receipt" TEXT;
