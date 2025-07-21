"use client"
import MiniProfileCard from "@/components/ui/MiniProfileCard";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import { db } from "@/firebase/firebaseConfig";
import { collection, getDocs, query, where } from "firebase/firestore";

export default function Dashboard() {
  const router = useRouter();
  const [myEvents, setMyEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyEvents = async () => {
      setLoading(true);
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) {
        setMyEvents([]);
        setLoading(false);
        return;
      }
      try {
        const q = query(
          collection(db, "events"),
          where("peopleInterested", "array-contains", user.uid)
        );
        const querySnapshot = await getDocs(q);
        const events = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setMyEvents(events);
      } catch (err) {
        setMyEvents([]);
      }
      setLoading(false);
    };
    fetchMyEvents();
  }, []);

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
        {loading ? (
          <div>Loading your events...</div>
        ) : myEvents.length === 0 ? (
          <div className="text-gray-500">You have not expressed interest in any events yet.</div>
        ) : (
          <div className="grid grid-cols-4 gap-4 mb-8">
            {myEvents.map((event) => (
              <div key={event.id} className="bg-white shadow rounded p-4">
                <h3 className="font-semibold text-lg">{event.title}</h3>
                <p className="text-sm text-gray-600">{event.date}</p>
                <p className="text-sm text-gray-600">{event.location}</p>
              </div>
            ))}
          </div>
        )}
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