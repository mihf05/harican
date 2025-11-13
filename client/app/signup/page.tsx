"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { authAPI } from "@/lib/api";
import { Button } from "@/component/ui/button";
import { Input } from "@/component/ui/input";
import { Label } from "@/component/ui/label";
import { PhoneInput } from "@/component/ui/phone-input";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/component/ui/hover-card";
import { cn } from "@/lib/utils";
import { BookOpen, Eye, EyeOff, Check, X, AlertCircle, User, GraduationCap, Briefcase, Target } from "lucide-react";
import Link from "next/link";

const signupSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address").optional().or(z.literal("")),
  phone: z.string().optional().or(z.literal("")),
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, 
      "Password must contain uppercase, lowercase, number and special character"),
  confirmPassword: z.string(),
  educationLevel: z.string().optional().or(z.literal("")),
  department: z.string().optional().or(z.literal("")),
  experienceLevel: z.enum(['Fresher', 'Junior', 'Mid', 'Senior']).optional(),
  preferredCareerTrack: z.string().optional().or(z.literal("")),
  agreeToTerms: z.boolean().refine(val => val === true, "You must agree to the terms"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
}).refine((data) => data.email || data.phone, {
  message: "Either email or phone is required",
  path: ["email"],
});

type SignupFormData = z.infer<typeof signupSchema>;

const PasswordStrengthIndicator = ({ password }: { password: string }) => {
  const checks = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /\d/.test(password),
    special: /[@$!%*?&]/.test(password),
  };
  
  const score = Object.values(checks).filter(Boolean).length;

  return (
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
            {Object.entries({
              length: "At least 8 characters",
              uppercase: "One uppercase letter",
              lowercase: "One lowercase letter",
              number: "One number",
              special: "One special character (@$!%*?&)"
            }).map(([key, label]) => (
              <div key={key} className={cn("flex items-center space-x-2", 
                checks[key as keyof typeof checks] ? "text-green-600 dark:text-green-400" : "text-gray-400")}>
                {checks[key as keyof typeof checks] ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                <span>{label}</span>
              </div>
            ))}
          </div>
          <div className="flex space-x-1 mt-2">
            {[1, 2, 3, 4, 5].map((level) => (
              <div
                key={level}
                className={cn("h-2 w-full rounded", level <= score
                  ? score <= 2 ? "bg-red-500" : score <= 4 ? "bg-yellow-500" : "bg-green-500"
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
  );
};

export default function SignupPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      agreeToTerms: false,
    }
  });

  const password = watch("password");

  const onSubmit = async (data: SignupFormData) => {
    setError("");
    
    try {
      const registerData: any = {
        fullName: data.fullName,
        password: data.password,
      };

      // Add fields only if they have values
      if (data.email) registerData.email = data.email;
      if (data.phone) registerData.phone = data.phone;
      if (data.educationLevel) registerData.educationLevel = data.educationLevel;
      if (data.department) registerData.department = data.department;
      if (data.experienceLevel) registerData.experienceLevel = data.experienceLevel;
      if (data.preferredCareerTrack) registerData.preferredCareerTrack = data.preferredCareerTrack;

      const response = await authAPI.register(registerData);

      if (response.success) {
        if (data.phone) {
          router.push(`/verify-otp?method=phone&contact=${data.phone}`);
        } else {
          router.push("/");
        }
      }
    } catch (err: any) {
      setError(err.message || "Registration failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-600 rounded-lg flex items-center justify-center">
              <BookOpen className="h-10 w-10 text-white" />
            </div>
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
            Create Your Account
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Join our mission to make quality education accessible for all
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {error && (
            <div className="rounded-md bg-red-50 dark:bg-red-900/20 p-4">
              <p className="text-sm text-red-800 dark:text-red-200 flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                {error}
              </p>
            </div>
          )}
          
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 space-y-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center gap-2">
              <User className="h-5 w-5" />
              Basic Information
            </h3>

            {/* Full Name */}
            <div>
              <Label htmlFor="fullName">Full Name *</Label>
              <Input
                id="fullName"
                type="text"
                placeholder="Enter your full name"
                {...register("fullName")}
                className={cn(errors.fullName && "border-red-500")}
              />
              {errors.fullName && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.fullName.message}</p>
              )}
            </div>

            {/* Email and Phone - Both visible */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  {...register("email")}
                  className={cn(errors.email && "border-red-500")}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <PhoneInput
                  defaultCountry="BD"
                  placeholder="Enter phone number"
                  onChange={(value) => setValue("phone", value || "")}
                  className={cn(errors.phone && "border-red-500")}
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.phone.message}</p>
                )}
              </div>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">* At least one contact method is required</p>
          </div>

          {/* Optional Information */}
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 space-y-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center gap-2">
              <GraduationCap className="h-5 w-5" />
              Educational Background <span className="text-sm text-gray-500 font-normal">(Optional)</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="educationLevel">Education Level</Label>
                <Input
                  id="educationLevel"
                  type="text"
                  placeholder="e.g., Bachelor's, Master's"
                  {...register("educationLevel")}
                />
              </div>

              <div>
                <Label htmlFor="department">Department/Major</Label>
                <Input
                  id="department"
                  type="text"
                  placeholder="e.g., Computer Science"
                  {...register("department")}
                />
              </div>
            </div>
          </div>

          {/* Career Information */}
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 space-y-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center gap-2">
              <Briefcase className="h-5 w-5" />
              Career Information <span className="text-sm text-gray-500 font-normal">(Optional)</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="experienceLevel">Experience Level</Label>
                <select
                  id="experienceLevel"
                  {...register("experienceLevel")}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                >
                  <option value="">Select level</option>
                  <option value="Fresher">Fresher</option>
                  <option value="Junior">Junior (1-3 years)</option>
                  <option value="Mid">Mid-level (3-5 years)</option>
                  <option value="Senior">Senior (5+ years)</option>
                </select>
              </div>

              <div>
                <Label htmlFor="preferredCareerTrack">Preferred Career Track</Label>
                <Input
                  id="preferredCareerTrack"
                  type="text"
                  placeholder="e.g., Software Development, Data Science"
                  {...register("preferredCareerTrack")}
                />
              </div>
            </div>
          </div>

          {/* Security */}
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 space-y-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center gap-2">
              <Target className="h-5 w-5" />
              Security
            </h3>

            {/* Password */}
            <div>
              <Label htmlFor="password">Password *</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a strong password"
                  {...register("password")}
                  className={cn(errors.password && "border-red-500", "pr-20")}
                />
                <div className="absolute inset-y-0 right-0 flex items-center space-x-1 pr-3">
                  <PasswordStrengthIndicator password={password || ""} />
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
              <Label htmlFor="confirmPassword">Confirm Password *</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  {...register("confirmPassword")}
                  className={cn(errors.confirmPassword && "border-red-500")}
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
