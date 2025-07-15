"use client"
import MiniProfileCard from "@/components/ui/MiniProfileCard";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Dashboard() {
  const router = useRouter();
  return (
    <div className="p-6 space-y-10">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      <Link
  href="/user-home"
  className="text-blue-600 underline hover:text-blue-800 font-medium"
>
  ← Back to Main Menu
</Link>

      {/* Interested Events Section */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">My Events</h2>
        <div className="grid grid-cols-4 gap-4 mb-8">
          {[1, 2, 3].map((event) => (
            <div key={event} className="bg-white shadow rounded p-4">
              <div className="h-32 bg-gray-200 rounded mb-2" />
              <h3 className="font-semibold text-lg">Sample Event #{event}</h3>
              <p className="text-sm text-gray-600">Time · Location · Type</p>
            </div>
          ))}
        </div>
      </section>

      {/* Matches Section */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">My Matches</h2>
        <div className="flex flex-wrap gap-4">
          {[1, 2].map((match) => (
            <div key={match} className="flex flex-col items-center">
              <MiniProfileCard
                name={`Match ${match}`}
                photoUrl="/placeholder.svg"
                interests={["Music", "Food"]}
              />
              <button className="mt-2 bg-green-500 text-white px-4 py-1 rounded">
                Chat
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Active Conversations Section */}
      
    </div>
  );
}