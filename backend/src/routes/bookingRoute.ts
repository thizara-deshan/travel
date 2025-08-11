import { Router } from "express";

import { verifyToken } from "../middleware/authMiddleware";
import {
  createBooking,
  getBookings,
  getAllUnassignedBookings,
  assignEmployeeToBooking,
  deleteBooking,
  getAllAssignedBookings,
  getBookingDetailsbyId,
  getEmployeeAssignedBookings,
  getEmployeeBookingDetails,
  updateBookingStatus,
  deleteCustomerBooking,
  updateCustomerBooking,
} from "../controllers/bookingController";
import {
  upload,
  uploadReceipt,
  downloadReceipt,
} from "../controllers/uploadController";

const router = Router();
//customer booking routes
router.post("/createbooking", verifyToken, createBooking);
router.get("/get-bookings", verifyToken, getBookings);
router.get("/:bookingId/details", verifyToken, getBookingDetailsbyId);
router.delete("/customer/:bookingId", verifyToken, deleteCustomerBooking);
router.put("/customer/:bookingId", verifyToken, updateCustomerBooking);

// Receipt upload routes
router.post(
  "/:bookingId/upload-receipt",
  verifyToken,
  upload.single("receipt"),
  uploadReceipt
);
router.get("/:bookingId/download-receipt", verifyToken, downloadReceipt);

//Admin booking routes
router.get(
  "/get-all-unassigned-bookings",
  verifyToken,
  getAllUnassignedBookings
);
router.get("/get-all-assigned-bookings", verifyToken, getAllAssignedBookings);
router.post("/:bookingId/assign", assignEmployeeToBooking);
router.delete("/:bookingId", verifyToken, deleteBooking);

// Employee booking routes
router.get(
  "/employee/assigned-bookings",
  verifyToken,
  getEmployeeAssignedBookings
);
router.get(
  "/employee/:bookingId/details",
  verifyToken,
  getEmployeeBookingDetails
);
router.put("/employee/:bookingId/status", verifyToken, updateBookingStatus);

export default router;
