import { useState } from "react";
import { ArrowLeft, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Password reset requested for:", email);
    setIsSubmitted(true);
    // TODO: Implement actual password reset logic
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4">
        <div className="w-full max-w-md text-center">
          {/* Success Icon */}
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
            <Mail className="h-8 w-8 text-green-600" />
          </div>

          {/* Header */}
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Check Your Email
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            We've sent a password reset link to{" "}
            <span className="font-medium text-gray-900">{email}</span>
          </p>

          {/* Actions */}
          <div className="space-y-4">
            <Link to="/">
              <Button className="w-full h-12 bg-blue-500 hover:bg-blue-600 text-white font-medium text-base rounded-none border-0 transition-colors">
                Back to Login
              </Button>
            </Link>
            <button
              onClick={() => setIsSubmitted(false)}
              className="text-gray-600 hover:text-gray-900 text-sm underline"
            >
              Didn't receive the email? Try again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4">
      <div className="w-full max-w-md">
        {/* Back Button */}
        <Link
          to="/"
          className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-8 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Login
        </Link>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Forgot Password?
          </h1>
          <p className="text-lg text-gray-600">
            No worries! Enter your email and we'll send you reset instructions.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
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
              placeholder="Enter your email address"
              className="w-full h-12 text-base border-2 border-gray-900 rounded-none focus:ring-0 focus:border-gray-900 focus-visible:ring-0 focus-visible:ring-offset-0"
              required
            />
          </div>

          {/* Submit Button */}
          <div className="pt-6">
            <Button
              type="submit"
              className="w-full h-12 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-medium text-base rounded-none border-2 border-gray-900 transition-colors"
            >
              Send Reset Instructions
            </Button>
          </div>
        </form>

        {/* Additional Help */}
        <div className="mt-8 text-center text-sm text-gray-600">
          <p>
            Remember your password?{" "}
            <Link
              to="/"
              className="text-blue-600 hover:text-blue-800 font-medium underline"
            >
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
