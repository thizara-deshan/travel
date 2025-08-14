// pages/admin/revenue-report.tsx or app/admin/revenue-report/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DollarSign, Package, Calendar, RefreshCw } from "lucide-react";
// import { string } from "zod";
const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || "/api";

// Types
interface RevenueData {
  totalRevenue: number;
  totalBookings: number;
  averageBookingValue: number;
}

interface PackageRevenueData {
  packageId: number;
  packageTitle: string;
  country: string;
  packageType: string;
  totalRevenue: number;
  totalBookings: number;
  averageBookingValue: number;
}

interface MonthlyData {
  month: string;
  totalRevenue: number;
}

export default function RevenueReport() {
  const [revenueData, setRevenueData] = useState<RevenueData | null>(null);
  const [packageData, setPackageData] = useState<PackageRevenueData[]>([]);
  const [, setMonthlyData] = useState<MonthlyData[] | null>([]);
  const [selectedMonth, setSelectedMonth] = useState<string>("all");
  const [selectedYear, setSelectedYear] = useState<string>(
    new Date().getFullYear().toString()
  );
  const [isLoading, setIsLoading] = useState(true);

  // Generate month options
  const monthOptions = [
    { value: "all", label: "All Time" },
    { value: "1", label: "January" },
    { value: "2", label: "February" },
    { value: "3", label: "March" },
    { value: "4", label: "April" },
    { value: "5", label: "May" },
    { value: "6", label: "June" },
    { value: "7", label: "July" },
    { value: "8", label: "August" },
    { value: "9", label: "September" },
    { value: "10", label: "October" },
    { value: "11", label: "November" },
    { value: "12", label: "December" },
  ];

  // Generate year options (last 5 years)
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 5 }, (_, i) => {
    const year = currentYear - i;
    return { value: year.toString(), label: year.toString() };
  });

  // Fetch revenue data
  const fetchRevenueData = React.useCallback(async () => {
    try {
      setIsLoading(true);

      // Build query parameters
      const queryParams = new URLSearchParams();
      if (selectedMonth !== "all") {
        queryParams.append("month", selectedMonth);
        queryParams.append("year", selectedYear);
      }

      const queryString = queryParams.toString();
      const baseParams = queryString ? `?${queryString}` : "";

      const [overviewRes, packageRes, monthlyRes] = await Promise.all([
        fetch(`${apiBaseUrl}/admin/revenue/overview${baseParams}`, {
          credentials: "include",
        }),
        fetch(`${apiBaseUrl}/admin/revenue/packages${baseParams}`, {
          credentials: "include",
        }),
        fetch(`${apiBaseUrl}/admin/revenue/month`, {
          credentials: "include",
        }),
      ]);

      const [overview, packages, monthlydata] = await Promise.all([
        overviewRes.json(),
        packageRes.json(),
        monthlyRes.json(),
      ]);

      console.log("overview data", overview.data);
      setRevenueData(overview.data);
      setPackageData(packages.data);
      setMonthlyData(monthlydata.data);
    } catch (error) {
      console.error("Error fetching revenue data:", error);
    } finally {
      setIsLoading(false);
    }
  }, [selectedMonth, selectedYear]);

  useEffect(() => {
    fetchRevenueData();
  }, [fetchRevenueData]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Revenue Report</h1>
          <p className="text-gray-600 mt-2">
            Total revenue analytics and insights
          </p>
        </div>

        {/* Month/Year Selection */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-600" />
            <Select value={selectedMonth} onValueChange={setSelectedMonth}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Select month" />
              </SelectTrigger>
              <SelectContent>
                {monthOptions.map((month) => (
                  <SelectItem key={month.value} value={month.value}>
                    {month.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedMonth !== "all" && (
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger className="w-[100px]">
                <SelectValue placeholder="Year" />
              </SelectTrigger>
              <SelectContent>
                {yearOptions.map((year) => (
                  <SelectItem key={year.value} value={year.value}>
                    {year.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          <Button
            onClick={() => fetchRevenueData()}
            variant="outline"
            size="sm"
            disabled={isLoading}
          >
            <RefreshCw
              className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Revenue
                  {selectedMonth !== "all" && (
                    <span className="block text-xs text-gray-500">
                      {
                        monthOptions.find((m) => m.value === selectedMonth)
                          ?.label
                      }{" "}
                      {selectedYear}
                    </span>
                  )}
                </p>
                <p className="text-3xl font-bold text-green-600">
                  {formatCurrency(revenueData?.totalRevenue || 0)}
                </p>
              </div>
              <DollarSign className="w-10 h-10 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Accepted Bookings
                  {selectedMonth !== "all" && (
                    <span className="block text-xs text-gray-500">
                      {
                        monthOptions.find((m) => m.value === selectedMonth)
                          ?.label
                      }{" "}
                      {selectedYear}
                    </span>
                  )}
                </p>
                <p className="text-3xl font-bold text-blue-600">
                  {revenueData?.totalBookings || 0}
                </p>
              </div>
              <Package className="w-10 h-10 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Average Booking Value
                  {selectedMonth !== "all" && (
                    <span className="block text-xs text-gray-500">
                      {
                        monthOptions.find((m) => m.value === selectedMonth)
                          ?.label
                      }{" "}
                      {selectedYear}
                    </span>
                  )}
                </p>
                <p className="text-3xl font-bold text-purple-600">
                  {formatCurrency(revenueData?.averageBookingValue || 0)}
                </p>
              </div>
              <DollarSign className="w-10 h-10 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Revenue by Package */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="w-5 h-5" />
            Revenue by Tour Package
            {selectedMonth !== "all" && (
              <span className="text-sm font-normal text-gray-500">
                - {monthOptions.find((m) => m.value === selectedMonth)?.label}{" "}
                {selectedYear}
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {packageData.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No revenue data available for the selected period
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Package</TableHead>
                    <TableHead>Country</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Revenue</TableHead>
                    <TableHead>Bookings</TableHead>
                    <TableHead>Avg. Value</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {packageData.map((pkg) => (
                    <TableRow key={pkg.packageId}>
                      <TableCell className="font-medium">
                        {pkg.packageTitle}
                      </TableCell>
                      <TableCell>{pkg.country}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{pkg.packageType}</Badge>
                      </TableCell>
                      <TableCell className="font-semibold text-green-600">
                        {formatCurrency(pkg.totalRevenue)}
                      </TableCell>
                      <TableCell>{pkg.totalBookings}</TableCell>
                      <TableCell>
                        {formatCurrency(pkg.averageBookingValue)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
