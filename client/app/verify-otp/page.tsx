"use client";
import { Button } from "@/component/ui/button";
import { OTPInput } from "@/component/ui/otp-input";
import { cn } from "@/lib/utils";
import { BookOpen, ArrowLeft, Mail, Phone, RefreshCw } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import { authAPI } from "@/lib/api";

function VerifyOTPContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const method = searchParams.get("method") || "email";
  const contact = searchParams.get("contact") || "";
  const [otp, setOtp] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState("");
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleOTPComplete = async (otpValue: string) => {
    setOtp(otpValue);
    setIsVerifying(true);
    setError("");
    
    try {
      if (method === "phone") {
        const response = await authAPI.verifyPhone({
          phone: contact,
          otp: otpValue,
        });

        if (response.success) {
          // Reload the full page to refresh authentication state
          window.location.href = "/";
        }
      }
    } catch (err: any) {
      setError(err.message || "OTP verification failed. Please try again.");
      setIsVerifying(false);
    }
  };

  const handleResendOTP = async () => {
    if (!canResend) return;
    
    setError("");
    
    try {
      if (method === "phone") {
        const response = await authAPI.resendPhoneOTP(contact);

        if (response.success) {
          setTimeLeft(300);
          setCanResend(false);
        }
      }
    } catch (err: any) {
      setError(err.message || "Failed to resend OTP. Please try again.");
    }
  };

  const maskedContact = method === "email" 
    ? contact.replace(/(.{2})(.*)(@.*)/, "$1***$3")
    : contact.replace(/(\+?\d{1,3})(\d{3})(\d{3})(\d{4})/, "$1***$3$4");

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-600 rounded-lg flex items-center justify-center">
              <BookOpen className="h-10 w-10 text-white" />
            </div>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            Verify Your {method === "email" ? "Email" : "Phone"}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            We sent a 6-digit code to
          </p>
          <p className="text-center text-sm font-medium text-gray-900 dark:text-white flex items-center justify-center mt-1">
            {method === "email" ? (
              <Mail className="h-4 w-4 mr-2 text-gray-500" />
            ) : (
              <Phone className="h-4 w-4 mr-2 text-gray-500" />
            )}
            {maskedContact}
          </p>
        </div>

        <div className="mt-8 space-y-6">
          {error && (
            <div className="rounded-md bg-red-50 dark:bg-red-900/20 p-4">
              <p className="text-sm text-red-800 dark:text-red-200 text-center">{error}</p>
            </div>
          )}
          
          <div className="flex flex-col items-center space-y-4">
            <OTPInput
              length={6}
              onComplete={handleOTPComplete}
              onChange={setOtp}
              disabled={isVerifying}
              className="justify-center"
            />
            
            {isVerifying && (
              <div className="flex items-center space-x-2 text-green-600">
                <RefreshCw className="h-4 w-4 animate-spin" />
                <span className="text-sm">Verifying...</span>
              </div>
            )}
          </div>

          <div className="text-center space-y-4">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Code expires in: <span className="font-medium text-red-600">{formatTime(timeLeft)}</span>
            </div>
            
            <div>
              {canResend ? (
                <button
                  onClick={handleResendOTP}
                  className="text-sm font-medium text-green-600 hover:text-green-500"
                >
                  Resend Code
                </button>
              ) : (
                <span className="text-sm text-gray-500">
                  Didn't receive the code? You can resend in {formatTime(timeLeft)}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <Link
              href="/signup"
              className="flex items-center text-sm font-medium text-gray-600 hover:text-gray-500 dark:text-gray-400 dark:hover:text-gray-300"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to signup
            </Link>
            
            <Link
              href={method === "email" ? "/signup?method=phone" : "/signup?method=email"}
              className="text-sm font-medium text-green-600 hover:text-green-500"
            >
              Use {method === "email" ? "phone" : "email"} instead
            </Link>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200">
                  Security Tip
                </h3>
                <div className="mt-2 text-sm text-blue-700 dark:text-blue-300">
                  <ul className="list-disc list-inside space-y-1">
                    <li>Never share this code with anyone</li>
                    <li>Our team will never ask for this code</li>
                    <li>The code expires in 5 minutes</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function VerifyOTPPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-md w-full space-y-8">
            <div className="text-center">
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <BookOpen className="h-10 w-10 text-white" />
                </div>
              </div>
            </div>
            <div className="text-center space-y-6">
              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600"></div>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Loading...
                </h2>
              </div>
            </div>
          </div>
        </div>
      }
    >
      <VerifyOTPContent />
    </Suspense>
  );
}
