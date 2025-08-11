import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import fs from "fs";

const prisma = new PrismaClient();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, "..", "receipts");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

const fileFilter = (req: any, file: Express.Multer.File, cb: any) => {
  // Accept images and PDFs
  if (
    file.mimetype.startsWith("image/") ||
    file.mimetype === "application/pdf"
  ) {
    cb(null, true);
  } else {
    cb(new Error("Only images and PDF files are allowed"), false);
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

export const uploadReceipt = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const bookingId = parseInt(req.params.bookingId, 10);
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ message: "Authentication required" });
      return;
    }

    if (!bookingId) {
      res.status(400).json({ message: "Booking ID is required" });
      return;
    }

    if (!req.file) {
      res.status(400).json({ message: "No file uploaded" });
      return;
    }

    // Verify booking exists and belongs to user
    const booking = await prisma.booking.findFirst({
      where: {
        id: bookingId,
        userId: userId,
        status: "ASSIGNED", // Only allow receipt upload for assigned bookings
      },
    });

    if (!booking) {
      res.status(404).json({ message: "Booking not found or not assigned" });
      return;
    }

    // Update booking with receipt filename and change status to PAID
    const updatedBooking = await prisma.booking.update({
      where: { id: bookingId },
      data: {
        receipt: req.file.filename,
        status: "PAID",
      },
    });

    res.status(200).json({
      message: "Receipt uploaded successfully",
      booking: updatedBooking,
    });
  } catch (error) {
    console.error("Error uploading receipt:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const downloadReceipt = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const bookingId = parseInt(req.params.bookingId, 10);
    const userRole = req.user?.role;
    const userId = req.user?.id;

    if (!bookingId) {
      res.status(400).json({ message: "Booking ID is required" });
      return;
    }

    let booking;

    // Check access based on user role
    if (userRole === "CUSTOMER") {
      booking = await prisma.booking.findFirst({
        where: {
          id: bookingId,
          userId: userId,
        },
      });
    } else if (userRole === "EMPLOYEE") {
      // Employee can access receipts for their assigned bookings
      booking = await prisma.booking.findFirst({
        where: {
          id: bookingId,
          assignment: {
            employeeId: userId,
          },
        },
      });
    } else if (userRole === "SUPER_ADMIN") {
      booking = await prisma.booking.findUnique({
        where: { id: bookingId },
      });
    }

    if (!booking || !booking.receipt) {
      res.status(404).json({ message: "Receipt not found" });
      return;
    }

    const filePath = path.join(__dirname, "..", "receipts", booking.receipt);

    if (!fs.existsSync(filePath)) {
      res.status(404).json({ message: "Receipt file not found" });
      return;
    }

    res.download(filePath, booking.receipt);
  } catch (error) {
    console.error("Error downloading receipt:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
