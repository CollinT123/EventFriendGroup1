"use client"

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Camera, Plus, Edit2, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { getAuth } from "firebase/auth";
import { db } from "@/firebase/firebaseConfig";
import { doc, setDoc } from "firebase/firestore";
import ImageKit from "imagekit-javascript";


const eventPreferences = [
  { id: "party", label: "Party", color: "bg-event-party" },
  { id: "outdoors", label: "Outdoors", color: "bg-event-outdoors" },
  { id: "wellness", label: "Wellness", color: "bg-event-wellness" },
  { id: "educational", label: "Educational", color: "bg-event-educational" },
  { id: "food", label: "Food", color: "bg-event-food" },
  { id: "shopping", label: "Shopping", color: "bg-event-shopping" },
  { id: "community", label: "Community", color: "bg-event-community" },
];

export default function Page() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [location, setLocation] = useState(""); // New location state
  const [age, setAge] = useState(""); // Age state
  const [bio, setBio] = useState("");
  const [distancePreference, setDistancePreference] = useState([0]);
  const [agePreference, setAgePreference] = useState([21]);
  const [selectedEvents, setSelectedEvents] = useState<string[]>([]);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [customEvents, setCustomEvents] = useState<string[]>([]);
  const [isAddingEvent, setIsAddingEvent] = useState(false);
  const [newEventInput, setNewEventInput] = useState("");
  const [editingEventIndex, setEditingEventIndex] = useState<number | null>(
    null,
  );
  const [editEventInput, setEditEventInput] = useState("");
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);

  const toggleEventPreference = (eventId: string) => {
    setSelectedEvents((prev) =>
      prev.includes(eventId)
        ? prev.filter((id) => id !== eventId)
        : [...prev, eventId],
    );
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setProfileImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddCustomEvent = () => {
    if (newEventInput.trim()) {
      setCustomEvents((prev) => [...prev, newEventInput.trim()]);
      setNewEventInput("");

      // Ask if they want to add another event
      const addAnother = window.confirm("Would you like to add another event?");
      if (!addAnother) {
        setIsAddingEvent(false);
      }
    }
  };

  const handleEditEvent = (index: number, newValue: string) => {
    if (newValue.trim()) {
      setCustomEvents((prev) => {
        const updated = [...prev];
        updated[index] = newValue.trim();
        return updated;
      });
    }
    setEditingEventIndex(null);
    setEditEventInput("");
  };

  const handleDeleteCustomEvent = (index: number) => {
    setCustomEvents((prev) => prev.filter((_, i) => i !== index));
  };

  const startAddingEvent = () => {
    setIsAddingEvent(true);
    setNewEventInput("");
  };

  const wordCount = bio
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0).length;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) {
      alert("You must be signed in to create a profile.");
      return;
    }
    let profileImageUrl = "";
    try {
      if (profileImageFile) {
        // 1. Get ImageKit authentication parameters from your API
        const authRes = await fetch("/api/imagekit-auth");
        const { signature, expire, token } = await authRes.json();
        // 2. Upload to ImageKit
        const ik = new ImageKit({
          publicKey: "public_+ANrQ6VCgQdV8HcsnyVZJASccUQ=",
          urlEndpoint: "https://ik.imagekit.io/kzg8aohm0",
        });
        const uploadRes = await ik.upload({
          file: profileImageFile,
          fileName: `${user.uid}_profile_image`,
          signature,
          expire,
          token,
        });
        profileImageUrl = uploadRes.url;
      }
      await setDoc(doc(db, "users", user.uid), {
        name,
        location, // Save location
        age, // Save age
        bio,
        profileImage: profileImageUrl,
        eventPreferences: selectedEvents,
        distancePreference: distancePreference[0],
        agePreference: agePreference[0],
        updatedAt: new Date().toISOString(),
      });
      alert("Profile saved successfully!");
      router.push("/user-home");
    } catch (err: any) {
      alert("Failed to save profile: " + err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-black tracking-wide">
            PROFILE:
          </h1>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-black tracking-wide mt-1">
            EVENT FRIEND IN THE MAKING...
          </h2>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Main Content Grid */}
          <div className="space-y-6">
            {/* Top Section: Profile Photo, Name, and Bio */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Profile Photo */}
              <div className="relative w-full max-w-sm">
                <div
                  className="w-full aspect-square border-4 border-black bg-blue-200 flex items-center justify-center cursor-pointer hover:bg-blue-300 transition-colors"
                  onClick={() => document.getElementById("photo-upload")?.click()}
                >
                  {profileImage ? (
                    <img
                      src={profileImage}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-center">
                      <Camera className="w-12 h-12 mx-auto mb-2 text-black" />
                      <p className="text-black font-medium text-sm">
                        Insert Image
                      </p>
                      <p className="text-black text-xs">(.PNG and .JPEG)</p>
                    </div>
                  )}
                </div>
                <input
                  id="photo-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>

              {/* Name and Bio Column */}
              <div className="space-y-4">
                {/* Name Input */}
                <div>
                  <label className="block text-black font-medium mb-2">
                    Name:
                  </label>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="border-2 border-black rounded-none h-12 text-base"
                    placeholder="Enter your name"
                  />
                </div>

                {/* Location Input */}
                <div>
                  <label className="block text-black font-medium mb-2">
                    Location:
                  </label>
                  <Input
                    value={location}
                    onChange={e => setLocation(e.target.value)}
                    className="border-2 border-black rounded-none h-12 text-base"
                    placeholder="Enter your location"
                  />
                </div>

                {/* Age Input */}
                <div>
                  <label className="block text-black font-medium mb-2">
                    Age:
                  </label>
                  <Input
                    value={age}
                    onChange={e => setAge(e.target.value.replace(/[^0-9]/g, ""))}
                    className="border-2 border-black rounded-none h-12 text-base"
                    placeholder="Enter your age"
                    maxLength={3}
                  />
                </div>

                {/* Bio */}
                <div>
                  <label className="block text-black font-medium mb-2">
                    Bio:
                  </label>
                  <div className="relative">
                    <Textarea
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      className="border-4 border-black rounded-none min-h-[200px] resize-none text-base"
                      placeholder="(Text goes here)"
                      maxLength={1000} // Rough character limit for ~200 words
                    />
                    <div className="absolute bottom-2 right-2 text-xs text-gray-600">
                      {wordCount}/200 words
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Event Preferences */}
            <div>
              <label className="block text-black font-medium mb-4">
                Event Preferences:
              </label>
              <div className="border-4 border-black p-4 bg-gray-800">
                <div className="grid grid-cols-3 gap-3 mb-4">
                  {eventPreferences.map((event, idx) => (
                    idx === eventPreferences.length - 1 && eventPreferences.length % 3 !== 0 ? (
                      <div key={event.id} className="col-span-3 flex justify-center">
                        <label className="flex items-center gap-2 text-white font-medium text-sm cursor-pointer">
                          <input
                            type="checkbox"
                            checked={selectedEvents.includes(event.id)}
                            onChange={() => toggleEventPreference(event.id)}
                            className="accent-black w-4 h-4"
                          />
                          {event.label}
                        </label>
                      </div>
                    ) : (
                      <div key={event.id} className="flex justify-center">
                        <label className="flex items-center gap-2 text-white font-medium text-sm cursor-pointer">
                          <input
                            type="checkbox"
                            checked={selectedEvents.includes(event.id)}
                            onChange={() => toggleEventPreference(event.id)}
                            className="accent-black w-4 h-4"
                          />
                          {event.label}
                        </label>
                      </div>
                    )
                  ))}
                </div>
              </div>
            </div>

            {/* Preferences Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Distance Preference */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <label className="text-black font-medium">
                    Distance Preference
                  </label>
                  <span className="text-black font-medium">
                    {distancePreference[0]} Miles
                  </span>
                </div>
                <Slider
                  value={distancePreference}
                  onValueChange={setDistancePreference}
                  max={50}
                  min={0}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-600 mt-1">
                  <span>0</span>
                  <span>50</span>
                </div>
              </div>

              {/* Age Preference */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <label className="text-black font-medium">Age Preference</label>
                  <span className="text-black font-medium">
                    {agePreference[0]} Years
                  </span>
                </div>
                <Slider
                  value={agePreference}
                  onValueChange={setAgePreference}
                  max={30}
                  min={21}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-600 mt-1">
                  <span>21</span>
                  <span>30</span>
                </div>
              </div>
            </div>
          </div>
          {/* Submit Button */}
          <div className="flex justify-center mt-8">
            <Button type="submit" className="bg-green-500 hover:bg-green-600 text-black font-bold px-12 py-4 text-xl transition-colors duration-200">
              Save Profile
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
