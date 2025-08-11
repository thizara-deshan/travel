import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

import { Plus, MoreHorizontal, Users } from "lucide-react";
import { Employee } from "@/lib/types"; // Adjust the import path as necessary

import { useEmployeeForm } from "@/lib/validation/employeeForm";

interface EmployeesManageSectionProps {
  user: {
    name: string;
    email: string;
    role: string;
  } | null;
}

export default function EmployeesManageSection({
  user,
}: EmployeesManageSectionProps) {
  const [isAddEmployeeOpen, setIsAddEmployeeOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [removeDialogOpen, setRemoveDialogOpen] = React.useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<number | null>(null);

  const [employees, setEmployees] = useState<Employee[]>([]);
  const { handleSubmit, register } = useEmployeeForm();

  const apiBaseUrl =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

  const onSubmit = async (data: {
    name: string;
    role: "EMPLOYEE" | "ADMIN";
    email: string;
    password: string;
  }) => {
    setIsLoading(true);
    try {
      // Construct the payload as needed by your backend
      const payload = {
        name: data.name,
        email: data.email,
        password: data.password,
        role: data.role,
      };
      const response = await fetch(`${apiBaseUrl}/users/employees`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
        credentials: "include", // Include cookies for authentication
      });
      if (!response.ok) {
        throw new Error("Failed to add employee");
      }
      const newEmployee = await response.json();
      setEmployees((prev) => [...prev, newEmployee]);
      setIsAddEmployeeOpen(false);
    } catch (error) {
      console.error("Error adding employee:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemove = (employeeId: number) => {
    setSelectedEmployee(employeeId);
    setRemoveDialogOpen(true);
  };

  const confirmRemoval = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${apiBaseUrl}/users/employees/${selectedEmployee}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", // Include cookies for authentication
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete employee");
      }
      const data = await response.json();
      console.log("Response from delete:", data);
      setEmployees((prev) =>
        prev.filter((employee) => employee.id !== selectedEmployee)
      );
    } catch (error) {
      console.error("Error deleting employee:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchEmployees = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${apiBaseUrl}/users/employees`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", // Include cookies for authentication
        });
        if (!response.ok) {
          throw new Error("Failed to fetch employees");
        }
        const data = await response.json();
        setEmployees(data);
        console.log("Fetched employees:", data);
      } catch (error) {
        console.error("Error fetching employees:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchEmployees();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">Manage Your Employees</h1>
        <p className="text-blue-100 mb-6">
          Welcome back, {user?.name}. Ready to manage your team? Let&apos;s get
          started.
        </p>
        <Button className="bg-white text-blue-600 hover:bg-blue-50">
          Add New Employee
        </Button>
      </div>
      <div>
        <Card className="col-span-1 lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-xl text-blue-900 flex items-center">
                <Users className="mr-2 h-5 w-5" />
                Employee Access & Roles
              </CardTitle>
              <CardDescription>
                Manage employee accounts, roles, and permissions
              </CardDescription>
            </div>
            <Dialog
              open={isAddEmployeeOpen}
              onOpenChange={setIsAddEmployeeOpen}
            >
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Employee
                </Button>
              </DialogTrigger>
              <DialogContent>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <DialogHeader>
                    <DialogTitle>Add New Employee</DialogTitle>
                    <DialogDescription>
                      Create a new employee account and assign their role.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="name" className="text-right">
                        Name
                      </Label>
                      <Input
                        id="name"
                        className="col-span-3"
                        {...register("name")}
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="email" className="text-right">
                        Email
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        className="col-span-3"
                        {...register("email")}
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="password" className="text-right">
                        Password
                      </Label>
                      <Input
                        id="password"
                        type="password"
                        className="col-span-3"
                        {...register("password")}
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="role" className="text-right">
                        Role
                      </Label>
                      <Input
                        id="role"
                        className="col-span-3"
                        defaultValue="EMPLOYEE"
                        disabled
                        {...register("role")}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setIsAddEmployeeOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className="bg-blue-600 hover:bg-blue-700"
                      onClick={() => setIsAddEmployeeOpen(false)}
                    >
                      Add Employee
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            <div className="mb-4"></div>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Join Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {employees.map((employee) => (
                    <TableRow key={employee.id}>
                      <TableCell className="font-medium">
                        {employee.name}
                      </TableCell>
                      <TableCell>{employee.email}</TableCell>

                      <TableCell>
                        <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
                          {employee.role}
                        </Badge>
                      </TableCell>
                      <TableCell>{employee.createdAt}</TableCell>
                      <TableCell>
                        <Badge
                          className={`${
                            employee.status === "ACTIVE"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {employee.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem className="text-red-600">
                              <Button
                                variant="ghost"
                                onClick={() => {
                                  // Handle delete employee logic here
                                  handleRemove(employee.id);
                                }}
                              >
                                Remove
                              </Button>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
        <AlertDialog open={removeDialogOpen} onOpenChange={setRemoveDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently remove
                employee from the system.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmRemoval}
                className="bg-red-600 hover:bg-red-700"
              >
                Remove
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
