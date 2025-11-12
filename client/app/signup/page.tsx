"use client";
import { Button } from "@/component/ui/button";
import { Input } from "@/component/ui/input";
import { Label } from "@/component/ui/label";
import { PhoneInput } from "@/component/ui/phone-input";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/component/ui/hover-card";
import { cn } from "@/lib/utils";
import { BookOpen, Eye, EyeOff, Check, X, AlertCircle, Phone, Mail, Github } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const signupSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().optional(),
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, 
      "Password must contain uppercase, lowercase, number and special character"),
  confirmPassword: z.string(),
  userType: z.enum(["student", "tutor"]),
  agreeToTerms: z.boolean().refine(val => val === true, "You must agree to the terms"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type SignupFormData = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [contactMethod, setContactMethod] = useState<"email" | "phone">("email");
  
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      userType: "student",
      agreeToTerms: false,
    }
  });

  const password = watch("password");

  const checkPasswordStrength = (password: string) => {
    const checks = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      special: /[@$!%*?&]/.test(password),
    };
    
    const score = Object.values(checks).filter(Boolean).length;
    return { checks, score };
  };

  const { checks, score } = checkPasswordStrength(password || "");

  const onSubmit = async (data: SignupFormData) => {
    try {
      // Handle signup logic here
      console.log("Signup data:", data);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error("Signup error:", error);
    }
  };

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
            Join ShikkhaConnect
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Be part of the educational revolution
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {/* Contact Method Toggle */}
          <div className="flex justify-center space-x-4 mb-6">
            <button
              type="button"
              onClick={() => setContactMethod("email")}
              className={cn(
                "flex items-center space-x-2 px-4 py-2 rounded-lg border transition-all",
                contactMethod === "email"
                  ? "bg-green-50 border-green-500 text-green-700 dark:bg-green-900/20 dark:border-green-400 dark:text-green-300"
                  : "border-gray-300 text-gray-600 hover:border-gray-400 dark:border-gray-600 dark:text-gray-400"
              )}
            >
              <Mail className="h-4 w-4" />
              <span>Email</span>
            </button>
            <button
              type="button"
              onClick={() => setContactMethod("phone")}
              className={cn(
                "flex items-center space-x-2 px-4 py-2 rounded-lg border transition-all",
                contactMethod === "phone"
                  ? "bg-green-50 border-green-500 text-green-700 dark:bg-green-900/20 dark:border-green-400 dark:text-green-300"
                  : "border-gray-300 text-gray-600 hover:border-gray-400 dark:border-gray-600 dark:text-gray-400"
              )}
            >
              <Phone className="h-4 w-4" />
              <span>Phone</span>
            </button>
          </div>

          <div className="space-y-4">
            {/* Full Name */}
            <div>
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                type="text"
                placeholder="Enter your full name"
                {...register("fullName")}
                className={errors.fullName ? "border-red-500" : ""}
              />
              {errors.fullName && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.fullName.message}</p>
              )}
            </div>

            {/* Email or Phone */}
            {contactMethod === "email" ? (
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  {...register("email")}
                  className={errors.email ? "border-red-500" : ""}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email.message}</p>
                )}
              </div>
            ) : (
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <PhoneInput
                  defaultCountry="BD"
                  placeholder="Enter phone number"
                  onChange={(value) => setValue("phone", value || "")}
                  className="mt-1"
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.phone.message}</p>
                )}
              </div>
            )}

            {/* User Type */}
            <div>
              <Label htmlFor="userType">I am a</Label>
              <select
                id="userType"
                {...register("userType")}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
              >
                <option value="student">Student seeking help</option>
                <option value="tutor">Tutor offering help</option>
              </select>
            </div>

            {/* Password with Strength Indicator */}
            <div>
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a strong password"
                  {...register("password")}
                  className={errors.password ? "border-red-500 pr-20" : "pr-20"}
                />
                <div className="absolute inset-y-0 right-0 flex items-center space-x-1 pr-3">
                  <HoverCard>
                    <HoverCardTrigger asChild>
                      <button type="button" className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                        <AlertCircle className="h-4 w-4" />
                      </button>
                    </HoverCardTrigger>
                    <HoverCardContent className="w-80">
                      <div className="space-y-2">
                        <h4 className="text-sm font-semibold">Password Requirements</h4>
                        <div className="space-y-1 text-sm">
                          <div className={cn("flex items-center space-x-2", checks.length ? "text-green-600 dark:text-green-400" : "text-gray-400")}>
                            {checks.length ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                            <span>At least 8 characters</span>
                          </div>
                          <div className={cn("flex items-center space-x-2", checks.uppercase ? "text-green-600 dark:text-green-400" : "text-gray-400")}>
                            {checks.uppercase ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                            <span>One uppercase letter</span>
                          </div>
                          <div className={cn("flex items-center space-x-2", checks.lowercase ? "text-green-600 dark:text-green-400" : "text-gray-400")}>
                            {checks.lowercase ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                            <span>One lowercase letter</span>
                          </div>
                          <div className={cn("flex items-center space-x-2", checks.number ? "text-green-600 dark:text-green-400" : "text-gray-400")}>
                            {checks.number ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                            <span>One number</span>
                          </div>
                          <div className={cn("flex items-center space-x-2", checks.special ? "text-green-600 dark:text-green-400" : "text-gray-400")}>
                            {checks.special ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                            <span>One special character</span>
                          </div>
                        </div>
                        <div className="flex space-x-1 mt-2">
                          {[1, 2, 3, 4, 5].map((level) => (
                            <div
                              key={level}
                              className={cn(
                                "h-2 w-full rounded",
                                level <= score
                                  ? score <= 2
                                    ? "bg-red-500"
                                    : score <= 4
                                    ? "bg-yellow-500"
                                    : "bg-green-500"
                                  : "bg-gray-200 dark:bg-gray-700"
                              )}
                            />
                          ))}
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Strength: {score <= 2 ? "Weak" : score <= 4 ? "Good" : "Strong"}
                        </p>
                      </div>
                    </HoverCardContent>
                  </HoverCard>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.password.message}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  {...register("confirmPassword")}
                  className={errors.confirmPassword ? "border-red-500" : ""}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.confirmPassword.message}</p>
              )}
            </div>

            {/* Terms Agreement */}
            <div className="flex items-start">
              <input
                id="agreeToTerms"
                type="checkbox"
                {...register("agreeToTerms")}
                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded mt-1"
              />
              <Label htmlFor="agreeToTerms" className="ml-2 text-sm">
                I agree to the{" "}
                <Link href="/terms" className="text-green-600 hover:text-green-500 underline font-medium">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="text-green-600 hover:text-green-500 underline font-medium">
                  Privacy Policy
                </Link>
              </Label>
            </div>
            {errors.agreeToTerms && (
              <p className="text-sm text-red-600 dark:text-red-400">{errors.agreeToTerms.message}</p>
            )}
          </div>

          {/* Social Login Options */}
          <div className="space-y-3">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-300 dark:border-gray-600" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-gray-50 dark:bg-gray-900 px-2 text-gray-500">Or continue with</span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <Button
                type="button"
                variant="outline"
                className="w-full"
              >
                <Github className="h-4 w-4 mr-2" />
                GitHub
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full"
              >
                <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Google
              </Button>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating Account..." : "Create Account"}
          </Button>

          <div className="text-center">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Sign in here
              </Link>
            </span>
          </div>
        </form>
      </div>
    </div>
  );
}
