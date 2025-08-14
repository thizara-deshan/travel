// pages/forgot-password.tsx or app/forgot-password/page.tsx
"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";

import {
  Loader2,
  Mail,
  ArrowLeft,
  Plane,
  CheckCircle,
  Shield,
} from "lucide-react";
import {
  useForgotPasswordForm,
  useVerifyOtpForm,
} from "@/lib/validation/login";
import type {
  ForgotPasswordFormValues,
  VerifyOtpFormValues,
} from "@/lib/validation/login";
import { useState } from "react";

const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || "/api";

type Step = "email" | "otp" | "reset" | "success";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const emailForm = useForgotPasswordForm();
  const otpForm = useVerifyOtpForm();

  // Step 1: Send OTP
  const onSendOtp = async (data: ForgotPasswordFormValues) => {
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(`${apiBaseUrl}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: data.email }),
      });

      const result = await response.json();

      if (response.ok) {
        setEmail(data.email);
        setCurrentStep("otp");
        setSuccess(
          "OTP sent successfully! Please check the console for the OTP."
        );
      } else {
        setError(result.message || "Failed to send OTP");
      }
    } catch (err) {
      console.error("Send OTP error:", err);
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Verify OTP and Auto Login
  const onVerifyOtp = async (data: VerifyOtpFormValues) => {
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(`${apiBaseUrl}/auth/verify-otp-login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // Important for cookies
        body: JSON.stringify({ email, otp: data.otp }),
      });

      const result = await response.json();

      if (response.ok) {
        setCurrentStep("success");

        // Redirect based on user role after a short delay
        setTimeout(() => {
          const userRole = result.user?.role;
          switch (userRole) {
            case "SUPER_ADMIN":
              router.push("/dashboard/super-admin");
              break;
            case "EMPLOYEE":
              router.push("/dashboard/employee");
              break;
            case "CUSTOMER":
            default:
              router.push("/dashboard/customer");
              break;
          }
        }, 2000);
      } else {
        setError(result.message || "Invalid OTP");
      }
    } catch (err) {
      console.error("Verify OTP error:", err);
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case "email":
        return (
          <Form {...emailForm}>
            <form
              onSubmit={emailForm.handleSubmit(onSendOtp)}
              className="space-y-4"
            >
              <FormField
                control={emailForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">
                      Email Address
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                          type="email"
                          placeholder="Enter your email address"
                          className="h-11 pl-10 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormDescription className="text-xs text-gray-500">
                      We&apos;ll send an OTP to verify your identity and log you
                      in
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending OTP...
                  </>
                ) : (
                  "Send OTP"
                )}
              </Button>
            </form>
          </Form>
        );

      case "otp":
        return (
          <Form {...otpForm}>
            <form
              onSubmit={otpForm.handleSubmit(onVerifyOtp)}
              className="space-y-4"
            >
              <div className="text-center mb-4">
                <Shield className="w-12 h-12 text-blue-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600">
                  We&apos;ve sent a 6-digit OTP to <strong>{email}</strong>
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Enter the OTP to verify your identity and log in automatically
                </p>
              </div>

              <FormField
                control={otpForm.control}
                name="otp"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">
                      Enter OTP
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="000000"
                        maxLength={6}
                        className="h-11 text-center text-lg tracking-widest border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                        {...field}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, "");
                          field.onChange(value);
                        }}
                      />
                    </FormControl>
                    <FormDescription className="text-xs text-gray-500">
                      Check the console for the OTP (development mode)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setCurrentStep("email")}
                  className="flex-1"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Verifying & Logging in...
                    </>
                  ) : (
                    "Verify & Login"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        );

      case "success":
        return (
          <div className="text-center space-y-4">
            <CheckCircle className="w-16 h-16 text-green-600 mx-auto" />
            <h3 className="text-lg font-semibold text-gray-900">
              Login Successful!
            </h3>
            <p className="text-sm text-gray-600">
              OTP verified successfully. You are now logged in and will be
              redirected to your dashboard.
            </p>
            <div className="flex items-center justify-center space-x-2">
              <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
              <span className="text-sm text-blue-600">Redirecting...</span>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case "email":
        return "Quick Login";
      case "otp":
        return "Verify OTP";
      case "success":
        return "Welcome Back!";
      default:
        return "Quick Login";
    }
  };

  const getStepDescription = () => {
    switch (currentStep) {
      case "email":
        return "Enter your email to receive an OTP for quick login";
      case "otp":
        return "Enter the 6-digit code to verify and log in";
      case "success":
        return "You have been successfully logged in";
      default:
        return "";
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-blue-600 p-3 rounded-full">
              <Plane className="w-8 h-8 text-white" />
            </div>
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">
            {getStepTitle()}
          </h2>
          <p className="mt-2 text-sm text-gray-600">{getStepDescription()}</p>
        </div>

        {/* Progress Indicator */}
        {currentStep !== "success" && (
          <div className="flex justify-center space-x-2">
            {["email", "otp"].map((step, index) => (
              <div
                key={step}
                className={`w-3 h-3 rounded-full ${
                  ["email", "otp"].indexOf(currentStep) >= index
                    ? "bg-blue-600"
                    : "bg-gray-300"
                }`}
              />
            ))}
          </div>
        )}

        {/* Form Card */}
        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur">
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-2xl font-semibold text-center text-gray-900">
              {getStepTitle()}
            </CardTitle>
            <CardDescription className="text-center text-gray-600">
              {getStepDescription()}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Success Message */}
            {success && (
              <div className="text-green-600 text-sm text-center">
                {success}
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="text-red-600 text-sm text-center">{error}</div>
            )}

            {/* Step Content */}
            {renderStepContent()}

            {/* Back to Login */}
            {currentStep === "email" && (
              <div className="text-center">
                <Link
                  href="/login"
                  className="text-sm text-blue-600 hover:text-blue-500 transition-colors flex items-center justify-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Login
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
