"use client";
import { Button } from "@/component/ui/button";
import { cn } from "@/lib/utils";
import { BookOpen, Mail, CheckCircle, AlertCircle, RefreshCw } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

export default function VerifyEmailPage() {
  const [verificationStatus, setVerificationStatus] = useState<"pending" | "success" | "error">("pending");
  const [resendCount, setResendCount] = useState(0);
  const [countdown, setCountdown] = useState(0);
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const email = searchParams.get("email");

  useEffect(() => {
    if (token) {
      // Simulate email verification process
      const verifyEmail = async () => {
        try {
          // Replace with actual API call
          await new Promise(resolve => setTimeout(resolve, 2000));
          // Simulate random success/failure for demo
          const isSuccess = Math.random() > 0.3;
          setVerificationStatus(isSuccess ? "success" : "error");
        } catch (error) {
          setVerificationStatus("error");
        }
      };
      
      verifyEmail();
    }
  }, [token]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleResendEmail = () => {
    if (countdown === 0) {
      setResendCount(resendCount + 1);
      setCountdown(60); // 60 second cooldown
      // Handle resend logic here
      console.log("Resending verification email...");
    }
  };

  const renderContent = () => {
    switch (verificationStatus) {
      case "success":
        return (
          <div className="text-center space-y-6">
            <div className="flex justify-center">
              <CheckCircle className="h-16 w-16 text-green-500" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Email Verified Successfully!
              </h2>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Welcome to ShikkhaConnect! Your account is now active and ready to use.
              </p>
            </div>
            <div className="space-y-3">
              <Button
                asChild
                className="w-full bg-green-600 hover:bg-green-700"
              >
                <Link href="/login">
                  Continue to Sign In
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="w-full"
              >
                <Link href="/">
                  Go to Homepage
                </Link>
              </Button>
            </div>
          </div>
        );

      case "error":
        return (
          <div className="text-center space-y-6">
            <div className="flex justify-center">
              <AlertCircle className="h-16 w-16 text-red-500" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Verification Failed
              </h2>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                The verification link is invalid or has expired. Please request a new verification email.
              </p>
            </div>
            <div className="space-y-3">
              <Button
                onClick={handleResendEmail}
                disabled={countdown > 0}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                {countdown > 0 ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Resend in {countdown}s
                  </>
                ) : (
                  <>
                    <Mail className="h-4 w-4 mr-2" />
                    Resend Verification Email
                  </>
                )}
              </Button>
              <Button
                asChild
                variant="outline"
                className="w-full"
              >
                <Link href="/signup">
                  Back to Sign Up
                </Link>
              </Button>
            </div>
          </div>
        );

      default:
        return (
          <div className="text-center space-y-6">
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600"></div>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Verifying Your Email...
              </h2>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Please wait while we verify your email address.
              </p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-600 rounded-lg flex items-center justify-center">
              <BookOpen className="h-10 w-10 text-white" />
            </div>
          </div>
        </div>

        {renderContent()}

        {verificationStatus === "success" && (
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md p-4">
            <div className="text-sm text-green-700 dark:text-green-300">
              <h4 className="font-medium">What's next?</h4>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Complete your profile setup</li>
                <li>Explore available tutors or create your tutor profile</li>
                <li>Join our community of learners and educators</li>
              </ul>
            </div>
          </div>
        )}

        {email && verificationStatus !== "success" && (
          <div className="text-center text-sm text-gray-600 dark:text-gray-400">
            <p>
              Verification email was sent to: <br />
              <strong className="text-gray-900 dark:text-white">{email}</strong>
            </p>
            {resendCount > 0 && (
              <p className="mt-1 text-green-600">
                Email resent {resendCount} time{resendCount > 1 ? "s" : ""}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
