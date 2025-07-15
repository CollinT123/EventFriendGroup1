"use client";


export default function Dashboard() {
  const mockEvents = [
    {
      id: "event1",
      name: "Sunset Music Festival",
      date: "July 20, 2025",
      time: "6:00 PM",
      location: "Atlanta, GA",
    },
  ];

  const mockMatches = [
    {
      id: "user1",
      name: "Jess",
      photoUrl: "/placeholder.svg",
      interests: ["Music", "Outdoors"],
    },
  ];

  return (
    <div className="p-4 space-y-10">
      <h1 className="text-3xl font-bold text-center">Dashboard</h1>

      <section>
        <h2 className="text-xl font-semibold mb-3">Your Events</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {mockEvents.map((event) => (
            <div key={event.id} className="border p-4 rounded shadow bg-white">
              <h3 className="text-lg font-bold">{event.name}</h3>
              <p className="text-sm text-gray-500">
                {event.date} at {event.time}
              </p>
              <p className="text-sm">{event.location}</p>
              <button className="mt-2 text-sm text-red-500 hover:underline">
                Remove Interest
              </button>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-3">Your Matches</h2>
        <div className="flex gap-4 flex-wrap">
          {mockMatches.map((match) => (
            <div key={match.id} className="flex flex-col items-center">
              {/* <MiniProfileCard
                name={match.name}
                photoUrl={match.photoUrl}
                interests={match.interests}
              /> */}
              <button className="mt-2 bg-green-500 px-4 py-1 text-white rounded">
                Chat
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}