"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AnimatedEye } from "@/components/ui/animated-eye";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/firebase/firebaseConfig";

export default function HomePage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/user-home");
    } catch (err) {
      alert("Incorrect login information");
    }
  };

  const handleSignUp = () => {
    router.push("/signup");
  };

  const handleForgotPassword = () => {
    router.push("/forgot-password");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Event Friend
          </h1>
          <p className="text-lg text-gray-600">
            Where events don't need to be done alone...
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-6">
          {/* Email Input */}
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-900"
            >
              Email:
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full h-12 text-base border-2 border-gray-900 rounded-none focus:ring-0 focus:border-gray-900 focus-visible:ring-0 focus-visible:ring-offset-0"
              required
            />
          </div>

          {/* Password Input */}
          <div className="space-y-2">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-900"
            >
              Password:
            </label>
            <div className="flex gap-0">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="flex-1 h-12 text-base border-2 border-gray-900 border-r-0 rounded-none focus:ring-0 focus:border-gray-900 focus-visible:ring-0 focus-visible:ring-offset-0"
                required
              />
              <AnimatedEye
                isOpen={showPassword}
                onClick={() => setShowPassword(!showPassword)}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4 pt-6">
            {/* Login Button */}
            <Button
              type="submit"
              className="w-full h-12 bg-green-500 hover:bg-green-600 text-white font-medium text-base rounded-none border-0 transition-colors"
            >
              Log In
            </Button>

            {/* Forgot Password Button */}
            <Button
              type="button"
              onClick={handleForgotPassword}
              variant="outline"
              className="w-full h-12 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-medium text-base rounded-none border-2 border-gray-900 transition-colors"
            >
              Forgot Password
            </Button>
          </div>
        </form>

        {/* Additional Links */}
        <div className="mt-8 text-center text-sm text-gray-600">
          <p>
            New to Event Friend?{" "}
            <Link
              href="/signup"
              className="text-blue-600 hover:text-blue-800 font-medium underline"
            >
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
} 