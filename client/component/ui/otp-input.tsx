"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface OTPInputProps {
  length?: number
  onComplete?: (otp: string) => void
  onChange?: (otp: string) => void
  disabled?: boolean
  className?: string
}

export const OTPInput = React.forwardRef<HTMLDivElement, OTPInputProps>(
  ({ length = 6, onComplete, onChange, disabled = false, className }, ref) => {
    const [otp, setOtp] = React.useState<string[]>(new Array(length).fill(""))
    const inputRefs = React.useRef<(HTMLInputElement | null)[]>([])

    const handleChange = (value: string, index: number) => {
      if (disabled) return

      // Only allow single digit
      if (value.length > 1) return

      const newOtp = [...otp]
      newOtp[index] = value
      setOtp(newOtp)

      // Call onChange callback
      const otpString = newOtp.join("")
      onChange?.(otpString)

      // Auto focus next input
      if (value && index < length - 1) {
        inputRefs.current[index + 1]?.focus()
      }

      // Call onComplete when all fields are filled
      if (otpString.length === length) {
        onComplete?.(otpString)
      }
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
      if (disabled) return

      // Handle backspace
      if (e.key === "Backspace") {
        e.preventDefault()
        const newOtp = [...otp]
        
        if (otp[index]) {
          newOtp[index] = ""
        } else if (index > 0) {
          newOtp[index - 1] = ""
          inputRefs.current[index - 1]?.focus()
        }
        
        setOtp(newOtp)
        onChange?.(newOtp.join(""))
      }
      
      // Handle paste
      else if (e.key === "ArrowLeft" && index > 0) {
        inputRefs.current[index - 1]?.focus()
      } else if (e.key === "ArrowRight" && index < length - 1) {
        inputRefs.current[index + 1]?.focus()
      }
    }

    const handlePaste = (e: React.ClipboardEvent) => {
      if (disabled) return

      e.preventDefault()
      const pastedData = e.clipboardData.getData("text/plain").slice(0, length)
      const newOtp = [...otp]

      for (let i = 0; i < pastedData.length; i++) {
        if (/^\d$/.test(pastedData[i])) {
          newOtp[i] = pastedData[i]
        }
      }

      setOtp(newOtp)
      const otpString = newOtp.join("")
      onChange?.(otpString)

      // Focus the next empty field or the last field
      const nextEmptyIndex = newOtp.findIndex(val => val === "")
      if (nextEmptyIndex !== -1) {
        inputRefs.current[nextEmptyIndex]?.focus()
      } else {
        inputRefs.current[length - 1]?.focus()
      }

      if (otpString.length === length) {
        onComplete?.(otpString)
      }
    }

    return (
      <div 
        ref={ref}
        className={cn("flex gap-2", className)}
      >
        {otp.map((digit, index) => (
          <input
            key={index}
            ref={(el) => {
              inputRefs.current[index] = el
            }}
            type="text"
            inputMode="numeric"
            pattern="\d{1}"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(e.target.value.replace(/\D/g, ""), index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            onPaste={handlePaste}
            disabled={disabled}
            className={cn(
              "w-12 h-12 text-center text-lg font-semibold border-2 rounded-md",
              "focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              "transition-colors duration-200",
              digit ? "border-primary bg-primary/5" : "border-border",
              className
            )}
            aria-label={`OTP digit ${index + 1}`}
          />
        ))}
      </div>
    )
  }
)

OTPInput.displayName = "OTPInput"
