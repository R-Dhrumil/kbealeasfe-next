"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Lock, Mail, User, Phone, CheckCircle2, ShieldCheck, ArrowRight, Eye, EyeOff, KeyRound, RotateCw, Sparkles } from "lucide-react";
import { useCustomer } from "@/context/CustomerContext";
import { Button } from "@/components/ui/Button";

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/account";

  const { login, registerWithOtp, sendRegistrationOtp, customer, isLoggedIn, logout } = useCustomer();

  const [mode, setMode] = useState<"signin" | "register">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // OTP Registration States
  const [registerStep, setRegisterStep] = useState<1 | 2>(1);
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [otpTimer, setOtpTimer] = useState<number>(60);
  const [debugOtp, setDebugOtp] = useState<string | null>(null);
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Timer countdown for resending OTP
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (mode === "register" && registerStep === 2 && otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [mode, registerStep, otpTimer]);

  // If already logged in, show status & option to proceed or switch
  if (isLoggedIn && customer) {
    const isAdmin = customer.memberTier === "Admin" || customer.role === "Admin";
    const isAdminTarget = redirectUrl.startsWith("/admin");

    return (
      <div className="max-w-md mx-auto bg-white rounded-3xl border border-stone-200/80 p-8 shadow-2xs text-center space-y-6">
        <div className={`h-16 w-16 mx-auto rounded-full flex items-center justify-center ${
          isAdminTarget && !isAdmin ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700"
        }`}>
          {isAdminTarget && !isAdmin ? <ShieldCheck className="h-8 w-8" /> : <CheckCircle2 className="h-8 w-8" />}
        </div>
        <div>
          <h2 className="font-serif text-2xl font-bold text-[#143425]">
            Already Signed In
          </h2>
          <p className="text-xs text-stone-500 mt-1">
            You are currently logged in as <strong className="text-stone-800">{customer.fullName}</strong> ({customer.email}).
          </p>
          {isAdminTarget && !isAdmin && (
            <p className="text-xs text-amber-700 font-medium mt-2 bg-amber-50 p-2.5 rounded-xl border border-amber-200/60">
              Note: This account does not have administrator privileges required to access the Operations Portal.
            </p>
          )}
        </div>

        <div className="space-y-3 pt-2">
          {(!isAdminTarget || isAdmin) && (
            <Button
              variant="primary"
              size="lg"
              className="w-full gap-2 justify-center"
              onClick={() => router.push(redirectUrl)}
            >
              <span>
                Proceed to {redirectUrl === "/checkout" ? "Checkout" : isAdminTarget ? "Admin Portal" : "My Account"}
              </span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          )}

          <Button
            variant={isAdminTarget && !isAdmin ? "primary" : "outline"}
            size={isAdminTarget && !isAdmin ? "lg" : "md"}
            className="w-full"
            onClick={() => {
              logout();
              setEmail("");
              setPassword("");
            }}
          >
            {isAdminTarget && !isAdmin ? "Sign In as Admin" : "Switch / Sign Out"}
          </Button>
        </div>
      </div>
    );
  }

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }
    setError("");
    setSuccessMessage("");
    setIsLoading(true);

    try {
      const role = await login(email, password);
      if (role === "Admin") {
        router.push(redirectUrl.startsWith("/admin") ? redirectUrl : "/admin");
      } else {
        if (redirectUrl.startsWith("/admin")) {
          setError("This account does not have administrator privileges. Please sign in with an Admin account.");
          setIsLoading(false);
          return;
        }
        router.push(redirectUrl);
      }
    } catch {
      setError("Failed to sign in. Please verify your credentials.");
      setIsLoading(false);
    }
  };

  // Step 1: Send OTP to Email
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim() || !phone.trim()) {
      setError("Please provide your full name, email, and phone number.");
      return;
    }
    if (password && password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }
    setError("");
    setSuccessMessage("");
    setIsLoading(true);

    try {
      const res = await sendRegistrationOtp(email.trim(), fullName.trim());
      setRegisterStep(2);
      setOtpTimer(60);
      setOtp(["", "", "", "", "", ""]);
      setSuccessMessage(res?.message || "A 6-digit verification code has been sent to your email.");
      if (res?.debugOtp) {
        setDebugOtp(res.debugOtp);
      }
      setTimeout(() => {
        otpInputRefs.current[0]?.focus();
      }, 100);
    } catch (err: any) {
      setError(err?.message || "Failed to send verification code. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Resend OTP
  const handleResendOtp = async () => {
    if (otpTimer > 0 || isLoading) return;
    setError("");
    setSuccessMessage("");
    setIsLoading(true);

    try {
      const res = await sendRegistrationOtp(email.trim(), fullName.trim());
      setOtpTimer(60);
      setSuccessMessage("A fresh verification code has been sent to your email.");
      if (res?.debugOtp) {
        setDebugOtp(res.debugOtp);
      }
    } catch (err: any) {
      setError(err?.message || "Failed to resend verification code.");
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: OTP Input change handler
  const handleOtpChange = (index: number, val: string) => {
    const clean = val.replace(/\D/g, "");
    if (!clean) {
      const next = [...otp];
      next[index] = "";
      setOtp(next);
      return;
    }

    if (clean.length > 1) {
      const digits = clean.slice(0, 6).split("");
      const next = [...otp];
      digits.forEach((d, i) => {
        if (index + i < 6) next[index + i] = d;
      });
      setOtp(next);
      const focusIdx = Math.min(index + digits.length, 5);
      otpInputRefs.current[focusIdx]?.focus();
      return;
    }

    const next = [...otp];
    next[index] = clean;
    setOtp(next);
    if (index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  // Step 2: Verify OTP & Complete Registration
  const handleVerifyOtpAndRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    const fullOtp = otp.join("").trim();
    if (fullOtp.length < 6) {
      setError("Please enter the complete 6-digit verification code.");
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      await registerWithOtp({
        fullName: fullName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        password: password || "Password@123",
        otp: fullOtp
      });

      if (redirectUrl.startsWith("/admin")) {
        router.push("/account");
      } else {
        router.push(redirectUrl);
      }
    } catch (err: any) {
      setError(err?.message || "Verification failed. Please check the code and try again.");
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setIsLoading(true);
    const role = await login("aarav.sharma@example.com");
    if (role === "Admin") {
      router.push("/admin");
    } else {
      router.push(redirectUrl);
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white rounded-3xl border border-stone-200/80 p-6 sm:p-8 shadow-2xs space-y-6">

      {redirectUrl.startsWith("/admin") && (
        <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E8DED1] flex items-start gap-3">
          <ShieldCheck className="h-5 w-5 text-[#A87E28] shrink-0 mt-0.5" />
          <div className="text-xs">
            <p className="font-bold text-[#143425]">Admin Operations Login</p>
            <p className="text-[11px] text-stone-500 mt-0.5 leading-relaxed">
              Please sign in with administrator credentials (default: <span className="font-mono font-semibold text-[#143425]">admin@kbealeas.com</span>) to access the operations dashboard.
            </p>
          </div>
        </div>
      )}

      {/* Mode Tabs */}
      <div className="flex border-b border-stone-200">
        <button
          type="button"
          onClick={() => {
            setMode("signin");
            setError("");
            setSuccessMessage("");
          }}
          className={`flex-1 py-3 text-sm font-semibold border-b-2 transition-all ${
            mode === "signin"
              ? "border-[#143425] text-[#143425]"
              : "border-transparent text-stone-400 hover:text-stone-700"
          }`}
        >
          Sign In
        </button>
        <button
          type="button"
          onClick={() => {
            setMode("register");
            setRegisterStep(1);
            setError("");
            setSuccessMessage("");
          }}
          className={`flex-1 py-3 text-sm font-semibold border-b-2 transition-all ${
            mode === "register"
              ? "border-[#143425] text-[#143425]"
              : "border-transparent text-stone-400 hover:text-stone-700"
          }`}
        >
          Create Account
        </button>
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-800">
          {error}
        </div>
      )}

      {successMessage && (
        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800 flex items-start gap-2">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 mt-0.5" />
          <span>{successMessage}</span>
        </div>
      )}

      {mode === "signin" ? (
        <form onSubmit={handleSignIn} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="aarav.sharma@example.com"
                className="w-full h-11 pl-10 pr-3 rounded-xl border border-stone-200 text-xs text-stone-900 focus:outline-none focus:border-[#143425] focus:ring-1 focus:ring-[#143425] transition-colors"
              />
              <Mail className="h-4 w-4 text-stone-400 absolute left-3.5 top-3.5 pointer-events-none" />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-stone-700 uppercase tracking-wider">
                Password
              </label>
              <span className="text-[11px] text-stone-400 cursor-pointer hover:underline">
                Forgot password?
              </span>
            </div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full h-11 pl-10 pr-10 rounded-xl border border-stone-200 text-xs text-stone-900 focus:outline-none focus:border-[#143425] focus:ring-1 focus:ring-[#143425] transition-colors"
              />
              <Lock className="h-4 w-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ left: "14px", top: "50%", transform: "translateY(-50%)" }} />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute text-stone-400 hover:text-stone-600 focus:outline-none transition-colors cursor-pointer"
                style={{ right: "14px", top: "50%", transform: "translateY(-50%)" }}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            <p className="text-[11px] text-stone-400 mt-1">
              For testing, any password or leaving it empty will sign in.
            </p>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            disabled={isLoading}
            className="w-full justify-center mt-2"
          >
            {isLoading ? "Signing In..." : "Sign In to KB Account"}
          </Button>
        </form>
      ) : registerStep === 1 ? (
        /* Registration Step 1: Input Details */
        <form onSubmit={handleSendOtp} className="space-y-4">
          <div className="flex items-center gap-2 p-2.5 bg-[#FAF7F2] rounded-xl border border-[#E8DED1] text-xs text-[#143425]">
            <KeyRound className="h-4 w-4 text-[#A87E28] shrink-0" />
            <span>We will send a 6-digit verification code to your email.</span>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
              Full Name
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Aarav Sharma"
                className="w-full h-11 pl-10 pr-3 rounded-xl border border-stone-200 text-xs text-stone-900 focus:outline-none focus:border-[#143425] focus:ring-1 focus:ring-[#143425] transition-colors"
              />
              <User className="h-4 w-4 text-stone-400 absolute left-3.5 top-3.5 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full h-11 pl-10 pr-3 rounded-xl border border-stone-200 text-xs text-stone-900 focus:outline-none focus:border-[#143425] focus:ring-1 focus:ring-[#143425] transition-colors"
              />
              <Mail className="h-4 w-4 text-stone-400 absolute left-3.5 top-3.5 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
              Phone Number
            </label>
            <div className="relative">
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98200 12345"
                className="w-full h-11 pl-10 pr-3 rounded-xl border border-stone-200 text-xs text-stone-900 focus:outline-none focus:border-[#143425] focus:ring-1 focus:ring-[#143425] transition-colors"
              />
              <Phone className="h-4 w-4 text-stone-400 absolute left-3.5 top-3.5 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
              Set Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="•••••••••••• (min 6 characters)"
                className="w-full h-11 pl-10 pr-10 rounded-xl border border-stone-200 text-xs text-stone-900 focus:outline-none focus:border-[#143425] focus:ring-1 focus:ring-[#143425] transition-colors"
              />
              <Lock className="h-4 w-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ left: "14px", top: "50%", transform: "translateY(-50%)" }} />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute text-stone-400 hover:text-stone-600 focus:outline-none transition-colors cursor-pointer"
                style={{ right: "14px", top: "50%", transform: "translateY(-50%)" }}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            disabled={isLoading}
            className="w-full justify-center mt-2 gap-2"
          >
            <span>{isLoading ? "Sending Verification Code..." : "Send Verification Code"}</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </form>
      ) : (
        /* Registration Step 2: Enter & Verify OTP */
        <form onSubmit={handleVerifyOtpAndRegister} className="space-y-5">
          <div className="text-center space-y-1.5">
            <div className="h-12 w-12 mx-auto rounded-full bg-[#143425]/10 text-[#143425] flex items-center justify-center mb-2">
              <KeyRound className="h-6 w-6 text-[#143425]" />
            </div>
            <h3 className="font-serif text-lg font-bold text-[#143425]">
              Verify Your Email
            </h3>
            <p className="text-xs text-stone-500 leading-relaxed">
              We sent a 6-digit verification code to <br/>
              <span className="font-semibold text-stone-800">{email}</span>{" "}
              <button
                type="button"
                onClick={() => {
                  setRegisterStep(1);
                  setError("");
                  setSuccessMessage("");
                }}
                className="text-[#143425] underline font-semibold hover:text-[#A87E28] ml-1 text-xs"
              >
                (Edit)
              </button>
            </p>
          </div>

          {debugOtp && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-center">
              <p className="text-[11px] text-amber-700 font-medium">
                Testing OTP (Development Mode): <span className="font-mono font-bold text-amber-900 tracking-wider text-sm">{debugOtp}</span>
              </p>
            </div>
          )}

          {/* 6 Individual Digit Inputs */}
          <div>
            <label className="block text-center text-xs font-bold text-stone-700 uppercase tracking-wider mb-2.5">
              Enter 6-Digit Code
            </label>
            <div className="flex justify-center gap-2 sm:gap-3">
              {otp.map((digit, idx) => (
                <input
                  key={idx}
                  ref={(el) => { otpInputRefs.current[idx] = el; }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(idx, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                  className="w-10 h-12 sm:w-12 sm:h-14 text-center font-mono font-bold text-xl text-[#143425] bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:border-[#143425] focus:bg-white focus:ring-2 focus:ring-[#143425]/20 transition-all"
                />
              ))}
            </div>
          </div>

          {/* Resend Code Section */}
          <div className="flex items-center justify-between text-xs pt-1 px-1">
            <span className="text-stone-500">Didn&apos;t get the email?</span>
            {otpTimer > 0 ? (
              <span className="text-stone-400 font-medium font-mono text-[11px]">
                Resend in {otpTimer}s
              </span>
            ) : (
              <button
                type="button"
                disabled={isLoading}
                onClick={handleResendOtp}
                className="text-[#143425] font-bold hover:underline flex items-center gap-1 cursor-pointer"
              >
                <RotateCw className="h-3 w-3" />
                <span>Resend Code</span>
              </button>
            )}
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            disabled={isLoading || otp.join("").length < 6}
            className="w-full justify-center gap-2"
          >
            <CheckCircle2 className="h-4 w-4" />
            <span>{isLoading ? "Verifying..." : "Verify & Create Account"}</span>
          </Button>

          <button
            type="button"
            onClick={() => {
              setRegisterStep(1);
              setError("");
              setSuccessMessage("");
            }}
            className="w-full text-center text-xs text-stone-500 hover:text-stone-800 flex items-center justify-center gap-1.5 pt-1"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to account details</span>
          </button>
        </form>
      )}

      {/* Security note */}
      <div className="pt-2 flex items-center justify-center gap-2 text-[11px] text-stone-400">
        <ShieldCheck className="h-3.5 w-3.5 text-emerald-700" />
        <span>Your personal data and order history are securely encrypted</span>
      </div>
    </div>
  );
}

export default function AccountLoginPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 space-y-6">
      <div>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs text-stone-500 hover:text-[#143425] mb-4"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Home</span>
        </Link>
        <div className="text-center max-w-md mx-auto">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#A87E28]">
            Customer Portal
          </span>
          <h1 className="text-3xl font-serif font-bold text-[#143425] mt-1">
            Access Your KB Account
          </h1>
          <p className="text-xs text-stone-500 mt-1.5">
            Manage your orders, save delivery addresses, and track real-time dispatch progress.
          </p>
        </div>
      </div>

      <Suspense fallback={<div className="text-center py-10 text-xs text-stone-400">Loading portal...</div>}>
        <LoginFormContent />
      </Suspense>
    </div>
  );
}
