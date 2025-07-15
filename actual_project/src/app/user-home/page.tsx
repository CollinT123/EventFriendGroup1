"use client"

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Facebook, Twitter, Instagram, Linkedin, X } from "lucide-react";
import { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import { db } from "@/firebase/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";

const EventDiscoveryPage = () => {
  const router = useRouter();
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [interestedEvents, setInterestedEvents] = useState<any[]>([]);
  const [customEvents, setCustomEvents] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState({
    hour: 12,
    minute: 0,
    period: "PM",
  });
  const [clockType, setClockType] = useState<"digital" | "analog">("digital");
  const [maxPeople, setMaxPeople] = useState(5);
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null);
  const [showProfile, setShowProfile] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [profileLoading, setProfileLoading] = useState(false);

  // Generate consistent random people counts
  const generatePeopleCounts = () => {
    return Array.from({ length: 12 }, () => Math.floor(Math.random() * 15) + 1);
  };

  const [peopleCounts] = useState(generatePeopleCounts);

  // Helper function to convert MM/DD/YYYY to display format
  const formatDateForDisplay = (dateString: string) => {
    const [month, day, year] = dateString.split("/");
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const monthName = monthNames[parseInt(month) - 1];
    return `${monthName} ${parseInt(day)}, ${year}`;
  };

  // Event data with theme-appropriate images
  const events = [
    {
      theme: "Food",
      color: "bg-food",
      image:
        "https://images.pexels.com/photos/32641367/pexels-photo-32641367.jpeg",
      alt: "Chef preparing grilled fish",
      name: "Gourmet Cooking Workshop",
      description:
        "Learn to prepare exquisite dishes with our professional chef. Perfect for food enthusiasts who want to enhance their culinary skills.",
      location: "Atlanta, Georgia",
      dateTime: "Saturday, Dec 21, 2024 at 2:00 PM",
      dayOfWeek: "Saturday",
      date: "Dec 21, 2024",
      time: "2:00 PM",
      peopleCount: peopleCounts[0],
    },
    {
      theme: "Party",
      color: "bg-party",
      image:
        "https://images.pexels.com/photos/5805085/pexels-photo-5805085.jpeg",
      alt: "Friends dancing and celebrating",
      name: "New Year's Dance Party",
      description:
        "Ring in the new year with an unforgettable dance party! DJ, drinks, and great company guaranteed.",
      location: "Savannah, Georgia",
      dateTime: "Tuesday, Dec 31, 2024 at 9:00 PM",
      dayOfWeek: "Tuesday",
      date: "Dec 31, 2024",
      time: "9:00 PM",
      peopleCount: peopleCounts[1],
    },
    {
      theme: "Wellness",
      color: "bg-wellness",
      image:
        "https://images.pexels.com/photos/9165672/pexels-photo-9165672.jpeg",
      alt: "Women in spa environment",
      name: "Spa & Wellness Retreat",
      description:
        "Relax and rejuvenate with our comprehensive wellness experience including massage, meditation, and healthy refreshments.",
      location: "Augusta, Georgia",
      dateTime: "Sunday, Dec 22, 2024 at 10:00 AM",
      dayOfWeek: "Sunday",
      date: "Dec 22, 2024",
      time: "10:00 AM",
      peopleCount: peopleCounts[2],
    },
    {
      theme: "Educational",
      color: "bg-educational",
      image:
        "https://images.pexels.com/photos/5212345/pexels-photo-5212345.jpeg",
      alt: "Teacher explaining geometry to students",
      name: "Mathematics Workshop",
      description:
        "Interactive learning session covering advanced geometry concepts. Perfect for students and math enthusiasts.",
      location: "Athens, Georgia",
      dateTime: "Friday, Dec 20, 2024 at 3:00 PM",
      dayOfWeek: "Friday",
      date: "Dec 20, 2024",
      time: "3:00 PM",
      peopleCount: peopleCounts[3],
    },
    {
      theme: "Outdoors",
      color: "bg-outdoors",
      image:
        "https://images.pexels.com/photos/19013057/pexels-photo-19013057.jpeg",
      alt: "Mountain lake reflection at dawn",
      name: "Mountain Hiking Adventure",
      description:
        "Explore beautiful mountain trails and enjoy breathtaking lake views. All skill levels welcome!",
      location: "Helen, Georgia",
      dateTime: "Saturday, Dec 28, 2024 at 7:00 AM",
      dayOfWeek: "Saturday",
      date: "Dec 28, 2024",
      time: "7:00 AM",
      peopleCount: peopleCounts[4],
    },
    {
      theme: "Shopping",
      color: "bg-shopping",
      image:
        "https://images.pexels.com/photos/5868127/pexels-photo-5868127.jpeg",
      alt: "Colorful shopping bags",
      name: "Holiday Shopping Tour",
      description:
        "Join us for a guided shopping experience at the best local boutiques and markets. Great deals guaranteed!",
      location: "Macon, Georgia",
      dateTime: "Saturday, Dec 21, 2024 at 11:00 AM",
      dayOfWeek: "Saturday",
      date: "Dec 21, 2024",
      time: "11:00 AM",
      peopleCount: peopleCounts[5],
    },
    {
      theme: "Community",
      color: "bg-community",
      image:
        "https://images.pexels.com/photos/6994831/pexels-photo-6994831.jpeg",
      alt: "Volunteers sorting clothes for charity",
      name: "Community Volunteer Day",
      description:
        "Make a difference in your community! Help us sort donations and prepare care packages for local families in need.",
      location: "Columbus, Georgia",
      dateTime: "Sunday, Dec 29, 2024 at 9:00 AM",
      dayOfWeek: "Sunday",
      date: "Dec 29, 2024",
      time: "9:00 AM",
      peopleCount: peopleCounts[6],
    },
    {
      theme: "Party",
      color: "bg-party",
      image:
        "https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg",
      alt: "Energetic music concert with crowd",
      name: "Live Music Concert",
      description:
        "Experience amazing live music with local bands and artists. Food trucks and drinks available on-site.",
      location: "Valdosta, Georgia",
      dateTime: "Friday, Dec 27, 2024 at 7:00 PM",
      dayOfWeek: "Friday",
      date: "Dec 27, 2024",
      time: "7:00 PM",
      peopleCount: peopleCounts[7],
    },
    {
      theme: "Wellness",
      color: "bg-wellness",
      image:
        "https://images.pexels.com/photos/32627103/pexels-photo-32627103.jpeg",
      alt: "Energetic dance class with adults",
      name: "Dance Fitness Class",
      description:
        "Get moving with our high-energy dance fitness class! Fun choreography meets great workout in a supportive environment.",
      location: "Albany, Georgia",
      dateTime: "Monday, Dec 23, 2024 at 6:00 PM",
      dayOfWeek: "Monday",
      date: "Dec 23, 2024",
      time: "6:00 PM",
      peopleCount: peopleCounts[8],
    },
    {
      theme: "Educational",
      color: "bg-educational",
      image:
        "https://images.pexels.com/photos/3184328/pexels-photo-3184328.jpeg",
      alt: "Man giving presentation to audience",
      name: "Business Presentation Workshop",
      description:
        "Learn effective presentation skills and public speaking techniques from industry professionals.",
      location: "Warner Robins, Georgia",
      dateTime: "Wednesday, Dec 25, 2024 at 1:00 PM",
      dayOfWeek: "Wednesday",
      date: "Dec 25, 2024",
      time: "1:00 PM",
      peopleCount: peopleCounts[9],
    },
    {
      theme: "Food",
      color: "bg-food",
      image: "https://images.pexels.com/photos/750952/pexels-photo-750952.jpeg",
      alt: "Fresh organic collard greens",
      name: "Farm-to-Table Experience",
      description:
        "Discover fresh, organic ingredients and learn about sustainable farming practices while enjoying a delicious meal.",
      location: "Marietta, Georgia",
      dateTime: "Thursday, Dec 26, 2024 at 12:00 PM",
      dayOfWeek: "Thursday",
      date: "Dec 26, 2024",
      time: "12:00 PM",
      peopleCount: peopleCounts[10],
    },
    {
      theme: "Shopping",
      color: "bg-shopping",
      image:
        "https://images.pexels.com/photos/3965545/pexels-photo-3965545.jpeg",
      alt: "Chic fashion boutique with plants",
      name: "Fashion Boutique Event",
      description:
        "Exclusive access to the latest fashion trends and designer pieces. Personal styling consultations available.",
      location: "Roswell, Georgia",
      dateTime: "Saturday, Dec 28, 2024 at 2:00 PM",
      dayOfWeek: "Saturday",
      date: "Dec 28, 2024",
      time: "2:00 PM",
      peopleCount: peopleCounts[11],
    },
  ];

  const categories = [
    "Party",
    "Outdoors",
    "Wellness",
    "Educational",
    "Food",
    "Shopping",
    "Community",
  ];
  const sidebarItems = ["Dashboard", "Calendar", "Post", "Chat", "Profile"];

  // Fetch profile when Profile tab is clicked
  const handleProfileClick = async () => {
    setProfileLoading(true);
    setShowProfile(true);
    setProfile(null);
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) {
        router.push("/"); // Not signed in, go to login
        return;
      }
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (!data.bio) {
          router.push("/user-home/create-profile");
          return;
        }
        setProfile(data);
      } else {
        router.push("/user-home/create-profile");
        return;
      }
    } catch (err) {
      router.push("/user-home/create-profile");
      return;
    }
    setProfileLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-5xl font-bold text-black mb-2">Event Friend</h1>
          <p className="text-xl text-gray-700">
            Where events don't need to be done alone...
          </p>
        </div>

        {/* Top Navigation Categories */}
        <div className="flex justify-center gap-4 mb-8">
          {/* All button */}
          <Button
            className={`${selectedTheme === null ? "bg-black" : "bg-gray-500"} hover:opacity-80 text-white font-medium px-6 py-2 text-sm`}
            onClick={() => setSelectedTheme(null)}
          >
            All
          </Button>
          {categories.map((category) => {
            const isSelected = selectedTheme === category;
            return (
              <Button
                key={category}
                className={`bg-black ${isSelected ? "ring-4 ring-white" : ""} hover:opacity-80 text-white font-medium px-6 py-2 text-sm`}
                onClick={() =>
                  setSelectedTheme(selectedTheme === category ? null : category)
                }
              >
                {category}
              </Button>
            );
          })}
        </div>

        {/* Main Content Area */}
        <div className="flex gap-6">
          {/* Left Sidebar */}
          <div className="flex flex-col gap-4 w-24">
            {/* Home Button */}
            <Button
              className="h-16 bg-blue-900 hover:bg-blue-800 text-white font-medium text-sm"
              onClick={() => {
                setShowProfile(false);
                setProfile(null);
                setIsModalOpen(false);
                setIsCalendarOpen(false);
                setIsPostModalOpen(false);
                setSelectedEvent(null);
              }}
            >
              Home
            </Button>
            {sidebarItems.map((item) => (
              <Button
                key={item}
                className="h-16 bg-blue-900 hover:bg-blue-800 text-white font-medium text-sm"
                onClick={() => {
                  if (item === "Calendar") {
                    setIsCalendarOpen(true);
                  } else if (item === "Post") {
                    setIsPostModalOpen(true);
                  } else if (item === "Dashboard") {
                    router.push("/user-home/dashboard")
                  } else if (item === "Profile") {
                    handleProfileClick();
                  }
                }}
              >
                {item}
              </Button>
            ))}
          </div>

          {/* Events Grid */}
          <div className="flex-1">
            {showProfile ? (
              profileLoading ? (
                <div>Loading profile...</div>
              ) : profile ? (
                <div className="flex flex-col items-center gap-4 mt-8">
                  {profile.profileImage && (
                    <img
                      src={profile.profileImage}
                      alt="Profile"
                      className="w-32 h-32 rounded-full object-cover border-4 border-black"
                    />
                  )}
                  <h2 className="text-2xl font-bold text-black">{profile.name}</h2>
                  {profile.age && (
                    <div className="text-lg text-gray-800 font-semibold">Age: {profile.age}</div>
                  )}
                  {profile.location && (
                    <div className="text-lg text-gray-800 font-semibold">Location: {profile.location}</div>
                  )}
                  <p className="text-gray-700 text-center whitespace-pre-line">{profile.bio}</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {profile.eventPreferences?.map((pref: string, i: number) => (
                      <span key={i} className="bg-blue-500 text-white px-2 py-1 rounded text-sm">{pref}</span>
                    ))}
                  </div>
                  <button
                    className="mt-6 px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded"
                    onClick={() => router.push("/user-home/create-profile")}
                  >
                    Edit Profile
                  </button>
                </div>
              ) : null
            ) : (
              <div className="grid grid-cols-4 gap-4 mb-8">
                {[...events, ...customEvents]
                  .filter(
                    (event) =>
                      selectedTheme === null || event.theme === selectedTheme,
                  )
                  .map((event, index) => (
                    <Button
                      key={index}
                      className="p-0 h-auto w-full overflow-hidden border-0 shadow-md bg-white hover:bg-white rounded-lg relative group"
                      onClick={() => {
                        setSelectedEvent(event);
                        setIsModalOpen(true);
                      }}
                    >
                      <div className="w-full">
                        {/* Hover overlay */}
                        <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-200 z-10 rounded-lg" />
                        <div className="relative h-40">
                          <img
                            src={event.image}
                            alt={event.alt}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/20" />
                          <div className="absolute bottom-2 right-2">
                            <span
                              className={`${event.color} text-white px-2 py-1 text-xs font-medium rounded`}
                            >
                              {event.theme}
                            </span>
                          </div>
                        </div>
                        <div className="p-3 bg-white text-left">
                          <div className="text-sm font-bold text-black leading-tight">
                            {event.dayOfWeek}
                          </div>
                          <div className="text-sm font-bold text-black leading-tight">
                            {event.date}
                          </div>
                          <div className="text-sm font-bold text-black leading-tight">
                            {event.time}
                          </div>
                          <div className="text-sm text-gray-700 mt-1">
                            {event.location}
                          </div>
                        </div>
                      </div>
                    </Button>
                  ))}
              </div>
            )}

            {/* Bottom Action Buttons */}
            {!showProfile && (
              <div className="flex justify-center gap-16 mb-8">
                <Button className="bg-red-800 hover:bg-red-900 text-white font-medium px-8 py-2">
                  Report
                </Button>
                <Button className="bg-white hover:bg-gray-50 text-black border border-gray-300 font-medium px-8 py-2">
                  FAQ
                </Button>
                <Button className="bg-black hover:bg-gray-900 text-white font-medium px-8 py-2">
                  Support
                </Button>
              </div>
            )}

            {/* Social Media Icons */}
            {/* REMOVED: Social media icon buttons (Facebook, Twitter, Instagram, Linkedin) */}
          </div>
        </div>

        {/* Event Details Modal */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="sr-only">Event Details</DialogTitle>
            </DialogHeader>

            {selectedEvent && (
              <div className="grid grid-cols-2 gap-6 p-4">
                {/* Left Column */}
                <div className="space-y-4">
                  {/* Event Image */}
                  <div className="bg-black h-48 rounded-lg overflow-hidden">
                    <img
                      src={selectedEvent.image}
                      alt={selectedEvent.alt}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Event Name */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Event Name:
                    </label>
                    <Input
                      value={selectedEvent.name}
                      readOnly
                      className="bg-gray-50"
                    />
                  </div>

                  {/* People List */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      People Interested ({selectedEvent.peopleCount}):
                    </label>
                    <div className="bg-black p-4 rounded-lg space-y-2">
                      {Array.from(
                        { length: selectedEvent.peopleCount },
                        (_, i) => (
                          <div
                            key={i}
                            className="bg-blue-500 h-8 w-full rounded"
                          />
                        ),
                      )}
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-4">
                  {/* Location */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Location:
                    </label>
                    <Input
                      value={selectedEvent.location}
                      readOnly
                      className="bg-gray-50"
                    />
                  </div>

                  {/* Date and Time */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Date and Time:
                    </label>
                    <Input
                      value={selectedEvent.dateTime}
                      readOnly
                      className="bg-gray-50"
                    />
                  </div>

                  {/* Event Description */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Event Description:
                    </label>
                    <Textarea
                      value={selectedEvent.description}
                      readOnly
                      className="bg-gray-50 h-32 resize-none"
                    />
                  </div>

                  {/* Interest Button */}
                  <Button
                    className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3"
                    onClick={() => {
                      if (
                        !interestedEvents.find(
                          (e) => e.name === selectedEvent.name,
                        )
                      ) {
                        setInterestedEvents([
                          ...interestedEvents,
                          selectedEvent,
                        ]);
                      }
                      setIsModalOpen(false);
                    }}
                  >
                    {interestedEvents.find((e) => e.name === selectedEvent.name)
                      ? "Already Interested"
                      : "I'm Interested"}
                  </Button>

                  {/* Delete Button for Custom Events */}
                  {selectedEvent.isCustom && (
                    <Button
                      className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3 mt-2"
                      onClick={() => {
                        setCustomEvents(
                          customEvents.filter(
                            (e) => e.name !== selectedEvent.name,
                          ),
                        );
                        setInterestedEvents(
                          interestedEvents.filter(
                            (e) => e.name !== selectedEvent.name,
                          ),
                        );
                        setIsModalOpen(false);
                      }}
                    >
                      Delete Event
                    </Button>
                  )}
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Calendar Modal */}
        <Dialog open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">
                My Interested Events
              </DialogTitle>
            </DialogHeader>

            <div className="p-4">
              {interestedEvents.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500 text-lg">No events added yet!</p>
                  <p className="text-gray-400 text-sm mt-2">
                    Click "I'm Interested" on events to see them here.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-sm text-gray-600 mb-4">
                    You have {interestedEvents.length} event
                    {interestedEvents.length !== 1 ? "s" : ""} you're interested
                    in:
                  </p>
                  {interestedEvents.map((event, index) => (
                    <div
                      key={index}
                      className="border rounded-lg p-4 bg-gray-50"
                    >
                      <div className="flex gap-4">
                        <img
                          src={event.image}
                          alt={event.alt}
                          className="w-20 h-20 object-cover rounded"
                        />
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">
                            {event.name}
                          </h3>
                          <p className="text-sm text-gray-600 mt-1">
                            {event.dateTime}
                          </p>
                          <p className="text-sm text-gray-600">
                            {event.location}
                          </p>
                          <span
                            className={`inline-block mt-2 px-2 py-1 text-xs font-medium rounded ${event.color} text-white`}
                          >
                            {event.theme}
                          </span>
                        </div>
                        <div className="flex flex-col gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setInterestedEvents(
                                interestedEvents.filter(
                                  (e) => e.name !== event.name,
                                ),
                              );
                            }}
                          >
                            Remove
                          </Button>
                          {event.isCustom && (
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => {
                                setCustomEvents(
                                  customEvents.filter(
                                    (e) => e.name !== event.name,
                                  ),
                                );
                                setInterestedEvents(
                                  interestedEvents.filter(
                                    (e) => e.name !== event.name,
                                  ),
                                );
                              }}
                            >
                              Delete
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>

        {/* Post Event Creation Modal */}
        <Dialog open={isPostModalOpen} onOpenChange={setIsPostModalOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">
                Create New Event
              </DialogTitle>
            </DialogHeader>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target as HTMLFormElement);

                if (!selectedDate) return;

                const dayNames = [
                  "Sunday",
                  "Monday",
                  "Tuesday",
                  "Wednesday",
                  "Thursday",
                  "Friday",
                  "Saturday",
                ];
                const monthNames = [
                  "Jan",
                  "Feb",
                  "Mar",
                  "Apr",
                  "May",
                  "Jun",
                  "Jul",
                  "Aug",
                  "Sep",
                  "Oct",
                  "Nov",
                  "Dec",
                ];

                const dayOfWeek = dayNames[selectedDate.getDay()];
                const formattedDate = `${monthNames[selectedDate.getMonth()]} ${selectedDate.getDate()}, ${selectedDate.getFullYear()}`;
                const timeString = `${selectedTime.hour}:${selectedTime.minute.toString().padStart(2, "0")} ${selectedTime.period}`;
                const themeValue = formData.get("theme");
                const themeString = typeof themeValue === "string" ? themeValue : "party"; // falls back to party 

                const newEvent = {
                  theme: themeString,
                  color: `bg-${themeString.toLowerCase()}`,
                  image:
                    (formData.get("imageUrl") as string) ||
                    "https://images.pexels.com/photos/2774556/pexels-photo-2774556.jpeg",
                  alt: formData.get("eventName") as string,
                  name: formData.get("eventName") as string,
                  description: formData.get("description") as string,
                  location: formData.get("location") as string,
                  dateTime: `${dayOfWeek}, ${formattedDate} at ${timeString}`,
                  dayOfWeek: dayOfWeek,
                  date: formattedDate,
                  time: timeString,
                  peopleCount: maxPeople,
                  maxPeople: maxPeople,
                  isCustom: true,
                };

                setCustomEvents([...customEvents, newEvent]);
                setInterestedEvents([...interestedEvents, newEvent]);
                setIsPostModalOpen(false);
                setSelectedDate(undefined);
                setSelectedTime({ hour: 12, minute: 0, period: "PM" });
                setMaxPeople(5);
              }}
            >
              <div className="grid grid-cols-2 gap-6 p-4">
                {/* Left Column */}
                <div className="space-y-4">
                  {/* Event Name */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Event Name:
                    </label>
                    <Input
                      name="eventName"
                      placeholder="Enter event name"
                      required
                      className="w-full"
                    />
                  </div>

                  {/* Theme Selection */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Theme:
                    </label>
                    <select
                      name="theme"
                      required
                      className="w-full p-2 border border-gray-300 rounded-md bg-white"
                    >
                      <option value="">Select a theme</option>
                      <option value="party">Party</option>
                      <option value="outdoors">Outdoors</option>
                      <option value="wellness">Wellness</option>
                      <option value="educational">Educational</option>
                      <option value="food">Food</option>
                      <option value="shopping">Shopping</option>
                      <option value="community">Community</option>
                    </select>
                  </div>

                  {/* Date Picker */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Date:
                    </label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal"
                        >
                          {selectedDate
                            ? selectedDate.toLocaleDateString()
                            : "Select date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={selectedDate}
                          onSelect={setSelectedDate}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  {/* Max People */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Max People (1-15):
                    </label>
                    <div className="flex items-center gap-4">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setMaxPeople(Math.max(1, maxPeople - 1))}
                      >
                        -
                      </Button>
                      <span className="font-medium text-lg min-w-[2rem] text-center">
                        {maxPeople}
                      </span>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setMaxPeople(Math.min(15, maxPeople + 1))
                        }
                      >
                        +
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-4">
                  {/* Location */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Location:
                    </label>
                    <Input
                      name="location"
                      placeholder="City, Georgia"
                      required
                      className="w-full"
                    />
                  </div>

                  {/* Image URL */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Image URL (optional):
                    </label>
                    <Input
                      name="imageUrl"
                      placeholder="https://example.com/image.jpg"
                      className="w-full"
                    />
                  </div>

                  {/* Time Picker */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Time:
                    </label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal"
                        >
                          {`${selectedTime.hour}:${selectedTime.minute.toString().padStart(2, "0")} ${selectedTime.period}`}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-4" align="start">
                        <div className="space-y-4">
                          {/* Clock Type Toggle */}
                          <div className="flex gap-2">
                            <Button
                              type="button"
                              variant={
                                clockType === "digital" ? "default" : "outline"
                              }
                              size="sm"
                              onClick={() => setClockType("digital")}
                            >
                              Digital
                            </Button>
                            <Button
                              type="button"
                              variant={
                                clockType === "analog" ? "default" : "outline"
                              }
                              size="sm"
                              onClick={() => setClockType("analog")}
                            >
                              Analog
                            </Button>
                          </div>

                          {clockType === "digital" ? (
                            /* Digital Clock */
                            <div className="space-y-3">
                              <div className="flex items-center justify-center gap-2">
                                <select
                                  value={selectedTime.hour}
                                  onChange={(e) =>
                                    setSelectedTime({
                                      ...selectedTime,
                                      hour: parseInt(e.target.value),
                                    })
                                  }
                                  className="p-2 border rounded"
                                >
                                  {Array.from(
                                    { length: 12 },
                                    (_, i) => i + 1,
                                  ).map((h) => (
                                    <option key={h} value={h}>
                                      {h}
                                    </option>
                                  ))}
                                </select>
                                <span>:</span>
                                <select
                                  value={selectedTime.minute}
                                  onChange={(e) =>
                                    setSelectedTime({
                                      ...selectedTime,
                                      minute: parseInt(e.target.value),
                                    })
                                  }
                                  className="p-2 border rounded"
                                >
                                  {Array.from({ length: 60 }, (_, i) => i).map(
                                    (m) => (
                                      <option key={m} value={m}>
                                        {m.toString().padStart(2, "0")}
                                      </option>
                                    ),
                                  )}
                                </select>
                              </div>
                              <div className="flex gap-2 justify-center">
                                <Button
                                  type="button"
                                  variant={
                                    selectedTime.period === "AM"
                                      ? "default"
                                      : "outline"
                                  }
                                  size="sm"
                                  onClick={() =>
                                    setSelectedTime({
                                      ...selectedTime,
                                      period: "AM",
                                    })
                                  }
                                >
                                  AM
                                </Button>
                                <Button
                                  type="button"
                                  variant={
                                    selectedTime.period === "PM"
                                      ? "default"
                                      : "outline"
                                  }
                                  size="sm"
                                  onClick={() =>
                                    setSelectedTime({
                                      ...selectedTime,
                                      period: "PM",
                                    })
                                  }
                                >
                                  PM
                                </Button>
                              </div>
                            </div>
                          ) : (
                            /* Analog Clock */
                            <div className="flex flex-col items-center space-y-3">
                              <div className="relative w-32 h-32 border-2 border-gray-300 rounded-full bg-white">
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <div
                                    className="w-1 h-12 bg-black rounded-full transform origin-bottom"
                                    style={{
                                      transform: `rotate(${(selectedTime.hour % 12) * 30 - 90}deg)`,
                                    }}
                                  ></div>
                                  <div
                                    className="w-0.5 h-16 bg-gray-600 rounded-full transform origin-bottom absolute"
                                    style={{
                                      transform: `rotate(${selectedTime.minute * 6 - 90}deg)`,
                                    }}
                                  ></div>
                                  <div className="w-2 h-2 bg-black rounded-full absolute"></div>
                                </div>
                                {Array.from({ length: 12 }, (_, i) => (
                                  <div
                                    key={i}
                                    className="absolute w-8 h-8 flex items-center justify-center text-xs font-medium cursor-pointer hover:bg-gray-100 rounded-full"
                                    style={{
                                      top: `${50 - 35 * Math.cos(((i + 1) * Math.PI) / 6)}%`,
                                      left: `${50 + 35 * Math.sin(((i + 1) * Math.PI) / 6)}%`,
                                      transform: "translate(-50%, -50%)",
                                    }}
                                    onClick={() =>
                                      setSelectedTime({
                                        ...selectedTime,
                                        hour: i + 1,
                                      })
                                    }
                                  >
                                    {i + 1}
                                  </div>
                                ))}
                              </div>
                              <div className="flex gap-4">
                                <div className="text-center">
                                  <label className="block text-xs font-medium mb-1">
                                    Minutes
                                  </label>
                                  <input
                                    type="range"
                                    min="0"
                                    max="59"
                                    value={selectedTime.minute}
                                    onChange={(e) =>
                                      setSelectedTime({
                                        ...selectedTime,
                                        minute: parseInt(e.target.value),
                                      })
                                    }
                                    className="w-20"
                                  />
                                  <div className="text-xs">
                                    {selectedTime.minute
                                      .toString()
                                      .padStart(2, "0")}
                                  </div>
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <Button
                                  type="button"
                                  variant={
                                    selectedTime.period === "AM"
                                      ? "default"
                                      : "outline"
                                  }
                                  size="sm"
                                  onClick={() =>
                                    setSelectedTime({
                                      ...selectedTime,
                                      period: "AM",
                                    })
                                  }
                                >
                                  AM
                                </Button>
                                <Button
                                  type="button"
                                  variant={
                                    selectedTime.period === "PM"
                                      ? "default"
                                      : "outline"
                                  }
                                  size="sm"
                                  onClick={() =>
                                    setSelectedTime({
                                      ...selectedTime,
                                      period: "PM",
                                    })
                                  }
                                >
                                  PM
                                </Button>
                              </div>
                            </div>
                          )}
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>

                  {/* Event Description */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Event Description:
                    </label>
                    <Textarea
                      name="description"
                      placeholder="Describe your event..."
                      required
                      className="h-24 resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex gap-4 p-4 pt-0">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    setIsPostModalOpen(false);
                    setSelectedDate(undefined);
                    setSelectedTime({ hour: 12, minute: 0, period: "PM" });
                    setMaxPeople(5);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white"
                  disabled={!selectedDate}
                >
                  Create Event
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default EventDiscoveryPage;
