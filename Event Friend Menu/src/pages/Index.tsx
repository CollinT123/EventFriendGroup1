import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Facebook, Twitter, Instagram, Linkedin, X } from "lucide-react";
import { useState } from "react";

const Index = () => {
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Generate consistent random people counts
  const generatePeopleCounts = () => {
    return Array.from({ length: 12 }, () => Math.floor(Math.random() * 15) + 1);
  };

  const [peopleCounts] = useState(generatePeopleCounts);
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
      location: "Location, Georgia",
      dateTime: "Saturday, Dec 21, 2024 at 2:00 PM",
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
      location: "Location, Georgia",
      dateTime: "Tuesday, Dec 31, 2024 at 9:00 PM",
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
      location: "Location, Georgia",
      dateTime: "Sunday, Dec 22, 2024 at 10:00 AM",
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
      location: "Location, Georgia",
      dateTime: "Friday, Dec 20, 2024 at 3:00 PM",
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
      location: "Location, Georgia",
      dateTime: "Saturday, Dec 28, 2024 at 7:00 AM",
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
      location: "Location, Georgia",
      dateTime: "Saturday, Dec 21, 2024 at 11:00 AM",
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
      location: "Location, Georgia",
      dateTime: "Sunday, Dec 29, 2024 at 9:00 AM",
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
      location: "Location, Georgia",
      dateTime: "Friday, Dec 27, 2024 at 7:00 PM",
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
      location: "Location, Georgia",
      dateTime: "Monday, Dec 23, 2024 at 6:00 PM",
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
      location: "Location, Georgia",
      dateTime: "Wednesday, Dec 25, 2024 at 1:00 PM",
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
      location: "Location, Georgia",
      dateTime: "Thursday, Dec 26, 2024 at 12:00 PM",
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
      location: "Location, Georgia",
      dateTime: "Saturday, Dec 28, 2024 at 2:00 PM",
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
  const sidebarItems = ["Calendar", "Post", "Chat", "Profile"];

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
          {categories.map((category) => {
            const getThemeColor = (theme: string) => {
              const colors: { [key: string]: string } = {
                Party: "bg-party",
                Outdoors: "bg-outdoors",
                Wellness: "bg-wellness",
                Educational: "bg-educational",
                Food: "bg-food",
                Shopping: "bg-shopping",
                Community: "bg-community",
              };
              return colors[theme] || "bg-gray-500";
            };

            return (
              <Button
                key={category}
                className={`${getThemeColor(category)} hover:opacity-80 text-white font-medium px-6 py-2 text-sm`}
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
            {sidebarItems.map((item) => (
              <Button
                key={item}
                className="h-16 bg-blue-900 hover:bg-blue-800 text-white font-medium text-sm"
              >
                {item}
              </Button>
            ))}
          </div>

          {/* Events Grid */}
          <div className="flex-1">
            <div className="grid grid-cols-4 gap-4 mb-8">
              {events.map((event, index) => (
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
                    <div className="p-2 bg-white text-left">
                      <div className="text-sm font-medium text-black">
                        Date and Time
                      </div>
                      <div className="text-xs text-gray-600">
                        Location, Georgia
                      </div>
                    </div>
                  </div>
                </Button>
              ))}
            </div>

            {/* Bottom Action Buttons */}
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

            {/* Social Media Icons */}
            <div className="flex justify-center gap-4">
              <Button className="w-16 h-16 bg-blue-500 hover:bg-blue-600 rounded-lg p-0">
                <Facebook className="w-8 h-8 text-white" />
              </Button>
              <Button className="w-16 h-16 bg-blue-500 hover:bg-blue-600 rounded-lg p-0">
                <Twitter className="w-8 h-8 text-white" />
              </Button>
              <Button className="w-16 h-16 bg-blue-500 hover:bg-blue-600 rounded-lg p-0">
                <Instagram className="w-8 h-8 text-white" />
              </Button>
              <Button className="w-16 h-16 bg-blue-500 hover:bg-blue-600 rounded-lg p-0">
                <Linkedin className="w-8 h-8 text-white" />
              </Button>
            </div>
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
                    <Input value="" readOnly className="bg-gray-50" />
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
                    <Input value="" readOnly className="bg-gray-50" />
                  </div>

                  {/* Event Description */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Event Description:
                    </label>
                    <Textarea
                      value=""
                      readOnly
                      className="bg-gray-50 h-32 resize-none"
                    />
                  </div>

                  {/* Interest Button */}
                  <Button className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3">
                    I'm Interested
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Index;
