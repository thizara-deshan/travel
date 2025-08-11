import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getRevenueOverview = async (req: Request, res: Response) => {
  try {
    const { month, year } = req.query;

    // Build date filter if month and year are provided
    let dateFilter = {};
    if (month && year) {
      const startDate = new Date(
        parseInt(year as string),
        parseInt(month as string) - 1,
        1
      );
      const endDate = new Date(
        parseInt(year as string),
        parseInt(month as string),
        0,
        23,
        59,
        59
      );
      dateFilter = {
        travelDate: {
          gte: startDate,
          lte: endDate,
        },
      };
    }

    // Get total revenue and bookings
    const totalStats = await prisma.booking.aggregate({
      where: {
        status: "ACCEPTED",
        ...dateFilter,
      },

      _sum: {
        totalAmount: true,
      },
      _count: {
        id: true,
      },
      _avg: {
        totalAmount: true,
      },
    });

    const data = {
      totalRevenue: totalStats._sum.totalAmount || 0,
      totalBookings: totalStats._count.id || 0,
      averageBookingValue: totalStats._avg.totalAmount || 0,
    };

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("Error fetching revenue overview:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getRevenueByPackage = async (req: Request, res: Response) => {
  try {
    const { month, year } = req.query;

    // Build date filter if month and year are provided
    let dateFilter = {};
    if (month && year) {
      const startDate = new Date(
        parseInt(year as string),
        parseInt(month as string) - 1,
        1
      );
      const endDate = new Date(
        parseInt(year as string),
        parseInt(month as string),
        0,
        23,
        59,
        59
      );
      dateFilter = {
        travelDate: {
          gte: startDate,
          lte: endDate,
        },
      };
    }

    const packageRevenue = await prisma.booking.groupBy({
      where: {
        status: "ACCEPTED",
        ...dateFilter,
      },
      by: ["tourPackageId"],
      _sum: {
        totalAmount: true,
      },
      _count: {
        id: true,
      },
      _avg: {
        totalAmount: true,
      },
    });

    // Get package details
    const packageIds = packageRevenue.map((p) => p.tourPackageId);
    const packages = await prisma.tourPackage.findMany({
      where: {
        id: {
          in: packageIds,
        },
      },
      select: {
        id: true,
        title: true,
        country: true,
        packageType: true,
      },
    });

    const data = packageRevenue.map((revenue) => {
      const packageInfo = packages.find((p) => p.id === revenue.tourPackageId);
      return {
        packageId: revenue.tourPackageId,
        packageTitle: packageInfo?.title || "Unknown Package",
        country: packageInfo?.country || "Unknown",
        packageType: packageInfo?.packageType || "Unknown",
        totalRevenue: revenue._sum.totalAmount || 0,
        totalBookings: revenue._count.id || 0,
        averageBookingValue: revenue._avg.totalAmount || 0,
      };
    });

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("Error fetching package revenue:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getRevenueByMonth = async (req: Request, res: Response) => {
  try {
    const revenueByMonth = await prisma.booking.groupBy({
      by: ["createdAt"],
      where: {
        status: "ACCEPTED",
      },
      _sum: {
        totalAmount: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    const monthlyTotals: { [key: string]: number } = {};

    revenueByMonth.forEach((record) => {
      if (record._sum.totalAmount) {
        const month = record.createdAt.toISOString().slice(0, 7); // "YYYY-MM"
        if (!monthlyTotals[month]) {
          monthlyTotals[month] = 0;
        }
        monthlyTotals[month] += record._sum.totalAmount;
      }
    });

    // Convert to array format for the response
    const data = Object.keys(monthlyTotals).map((month) => ({
      month,
      totalRevenue: monthlyTotals[month],
    }));

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("Error fetching monthly revenue:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
