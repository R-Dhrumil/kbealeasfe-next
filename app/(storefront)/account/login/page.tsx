"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Lock, Mail, User, Phone, CheckCircle2, ShieldCheck, ArrowRight, Eye, EyeOff } from "lucide-react";
import { useCustomer } from "@/context/CustomerContext";
import { Button } from "@/components/ui/Button";

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/account";

  const { login, register, customer, isLoggedIn, logout } = useCustomer();

  const [mode, setMode] = useState<"signin" | "register">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // If already logged in, show status & option to proceed or switch
  if (isLoggedIn && customer) {
    return (
      <div className="max-w-md mx-auto bg-white rounded-3xl border border-stone-200/80 p-8 shadow-2xs text-center space-y-6">
        <div className="h-16 w-16 mx-auto rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700">
          <CheckCircle2 className="h-8 w-8" />
        </div>
        <div>
          <h2 className="font-serif text-2xl font-bold text-[#143425]">
            Already Signed In
          </h2>
          <p className="text-xs text-stone-500 mt-1">
            You are currently logged in as <strong className="text-stone-800">{customer.fullName}</strong> ({customer.email}).
          </p>
        </div>

        <div className="space-y-3 pt-2">
          <Button
            variant="primary"
            size="lg"
            className="w-full gap-2 justify-center"
            onClick={() => router.push(redirectUrl)}
          >
            <span>Proceed to {redirectUrl === "/checkout" ? "Checkout" : "My Account"}</span>
            <ArrowRight className="h-4 w-4" />
          </Button>

          <Button
            variant="outline"
            size="md"
            className="w-full"
            onClick={() => {
              logout();
              setEmail("");
              setPassword("");
            }}
          >
            Switch / Sign Out
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
    setIsLoading(true);

    try {
      const role = await login(email, password);
      if (role === "Admin") {
        router.push("/admin");
      } else {
        router.push(redirectUrl);
      }
    } catch {
      setError("Failed to sign in. Please verify your credentials.");
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim() || !phone.trim()) {
      setError("Please provide your full name, email, and phone number.");
      return;
    }
    setError("");
    setIsLoading(true);

    try {
      await register({ fullName, email, phone, password });
      router.push(redirectUrl);
    } catch {
      setError("Registration failed. Please try again.");
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

      {/* Mode Tabs */}
      <div className="flex border-b border-stone-200">
        <button
          type="button"
          onClick={() => {
            setMode("signin");
            setError("");
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
            setError("");
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
      ) : (
        <form onSubmit={handleRegister} className="space-y-4">
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
              Password
            </label>
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
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            disabled={isLoading}
            className="w-full justify-center mt-2"
          >
            {isLoading ? "Creating Account..." : "Create KB Account"}
          </Button>
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
