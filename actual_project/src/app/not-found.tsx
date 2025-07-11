"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function NotFoundPage() {
  const router = useRouter();

  const handleGoHome = () => {
    router.push("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4">
      <div className="w-full max-w-md text-center">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            Page Not Found
          </h2>
          <p className="text-lg text-gray-600">
            The page you're looking for doesn't exist.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <Button
            onClick={handleGoHome}
            className="w-full h-12 bg-green-500 hover:bg-green-600 text-white font-medium text-base rounded-none border-0 transition-colors"
          >
            Go Home
          </Button>

          <Link href="/">
            <Button
              variant="outline"
              className="w-full h-12 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-medium text-base rounded-none border-2 border-gray-900 transition-colors"
            >
              Back to Login
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
} 