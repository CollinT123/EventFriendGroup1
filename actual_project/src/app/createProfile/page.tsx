"use client"

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Camera, Plus, Edit2, X } from "lucide-react";
import { useRouter } from "next/navigation";


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
                {eventPreferences.map((event) => (
                  <Button
                    key={event.id}
                    onClick={() => toggleEventPreference(event.id)}
                    className={`
                        ${event.color}
                        ${selectedEvents.includes(event.id) ? "opacity-50 line-through" : "opacity-100"}
                        text-white font-medium border-0 rounded-none h-12 text-sm
                        hover:opacity-75 transition-opacity
                      `}
                    variant="secondary"
                  >
                    {event.label}
                  </Button>
                ))}
                <Button
                  onClick={startAddingEvent}
                  className="bg-gray-500 hover:bg-gray-600 text-white font-medium border-0 rounded-none h-12 text-sm"
                  variant="secondary"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Other events...
                </Button>
              </div>

              {/* Custom Events List */}
              {customEvents.length > 0 && (
                <div className="mt-4 space-y-2">
                  <h4 className="text-white font-medium text-sm">
                    Custom Events:
                  </h4>
                  {customEvents.map((event, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 bg-gray-700 p-2 rounded"
                    >
                      {editingEventIndex === index ? (
                        <div className="flex items-center gap-2 flex-1">
                          <Input
                            value={editEventInput}
                            onChange={(e) => setEditEventInput(e.target.value)}
                            className="flex-1 h-8 text-sm border-gray-500"
                            onKeyPress={(e) => {
                              if (e.key === "Enter") {
                                handleEditEvent(index, editEventInput);
                              }
                            }}
                          />
                          <Button
                            onClick={() =>
                              handleEditEvent(index, editEventInput)
                            }
                            className="h-8 w-8 p-0 bg-green-600 hover:bg-green-700"
                            size="sm"
                          >
                            ✓
                          </Button>
                          <Button
                            onClick={() => {
                              setEditingEventIndex(null);
                              setEditEventInput("");
                            }}
                            className="h-8 w-8 p-0 bg-gray-600 hover:bg-gray-700"
                            size="sm"
                          >
                            ✕
                          </Button>
                        </div>
                      ) : (
                        <>
                          <span className="text-white text-sm flex-1">
                            {event}
                          </span>
                          <Button
                            onClick={() => {
                              setEditingEventIndex(index);
                              setEditEventInput(event);
                            }}
                            className="h-8 w-8 p-0 bg-blue-600 hover:bg-blue-700"
                            size="sm"
                          >
                            <Edit2 className="w-3 h-3" />
                          </Button>
                          <Button
                            onClick={() => handleDeleteCustomEvent(index)}
                            className="h-8 w-8 p-0 bg-red-600 hover:bg-red-700"
                            size="sm"
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Add New Event Input */}
              {isAddingEvent && (
                <div className="mt-4 flex items-center gap-2">
                  <Input
                    value={newEventInput}
                    onChange={(e) => setNewEventInput(e.target.value)}
                    placeholder="What event would you like to add?"
                    className="flex-1 h-10 border-gray-500"
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        handleAddCustomEvent();
                      }
                    }}
                  />
                  <Button
                    onClick={handleAddCustomEvent}
                    className="bg-green-600 hover:bg-green-700 text-white h-10"
                  >
                    Add
                  </Button>
                  <Button
                    onClick={() => {
                      setIsAddingEvent(false);
                      setNewEventInput("");
                    }}
                    className="bg-gray-600 hover:bg-gray-700 text-white h-10"
                  >
                    Cancel
                  </Button>
                </div>
              )}
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

        {/* Save Button */}
        <div className="mt-8 text-center">
          <Button className="bg-black text-white hover:bg-gray-800 px-8 py-3 text-lg font-medium rounded-none border-0">
            Save Profile
          </Button>
        </div>
      </div>
    </div>
  );
}
