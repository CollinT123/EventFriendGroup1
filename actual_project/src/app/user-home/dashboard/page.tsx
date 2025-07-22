"use client"
import MiniProfileCard from "@/components/ui/MiniProfileCard";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import { db } from "@/firebase/firebaseConfig";
import { collection, getDocs, query, where, doc, getDoc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function Dashboard() {
  const router = useRouter();
  const [myEvents, setMyEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [isPeopleModalOpen, setIsPeopleModalOpen] = useState(false);
  const [peopleInterested, setPeopleInterested] = useState<any[]>([]);
  const [loadingPeople, setLoadingPeople] = useState(false);
  const [myInterests, setMyInterests] = useState<string[]>([]);
  const [selectedProfile, setSelectedProfile] = useState<any>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

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
    loadMyInterests();
  }, []);

  const fetchPeopleInterested = async (eventId: string) => {
    setLoadingPeople(true);
    setPeopleInterested([]);
    try {
      const auth = getAuth();
      const currentUser = auth.currentUser;
      
      const eventRef = doc(db, "events", eventId);
      const eventSnap = await getDoc(eventRef);
      
      if (eventSnap.exists()) {
        const eventData = eventSnap.data();
        const peopleIds = eventData.peopleInterested || [];

        
        // Fetch user profiles for each person interested (excluding current user)
        const peopleProfiles = await Promise.all(
          peopleIds
            .filter((userId: string) => userId !== currentUser?.uid) // Filter out current user
            .map(async (userId: string) => {
            try {
              // Try to get public profile data first
              let userData = null;
              let hasProfile = false;
              
              try {
                const userRef = doc(db, "users", userId);
                const userSnap = await getDoc(userRef);
                if (userSnap.exists()) {
                  userData = userSnap.data();
                  hasProfile = true;
                }
              } catch (permissionErr) {
                // If permission denied, we'll handle it gracefully
              }
              
              if (userData) {
                return { 
                  id: userId, 
                  ...userData,
                  hasProfile: true,
                  isInterestedInMe: userData.peopleInterestedInMe?.includes(currentUser?.uid) || false,
                  iAmInterestedInThem: myInterests.includes(userId)
                };
              } else {
                // If we can't access the profile due to permissions, show a generic message
                return { 
                  id: userId, 
                  name: `User ${userId.slice(0, 8)}...`, 
                  bio: "Profile information is not publicly available. This user may have privacy settings enabled.",
                  isInterestedInMe: false,
                  iAmInterestedInThem: myInterests.includes(userId),
                  hasProfile: false
                };
              }
            } catch (err) {
              console.error(`Error fetching profile for ${userId}:`, err);
              return { 
                id: userId, 
                name: `User ${userId.slice(0, 8)}...`, 
                bio: "Error loading profile",
                isInterestedInMe: false,
                iAmInterestedInThem: myInterests.includes(userId),
                hasProfile: false
              };
            }
          })
        );
        
        setPeopleInterested(peopleProfiles);
      }
    } catch (err) {
      console.error("Error fetching people interested:", err);
    }
    setLoadingPeople(false);
  };

  const handleExpressInterest = async (targetUserId: string, isInterested: boolean) => {
    try {
      const auth = getAuth();
      const currentUser = auth.currentUser;
      
      if (!currentUser) {
        alert("You must be signed in to express interest.");
        return;
      }

      // Update the target user's document
      const targetUserRef = doc(db, "users", targetUserId);
      if (isInterested) {
        await updateDoc(targetUserRef, {
          peopleInterestedInMe: arrayUnion(currentUser.uid)
        });
      } else {
        await updateDoc(targetUserRef, {
          peopleInterestedInMe: arrayRemove(currentUser.uid)
        });
      }

      // Update local state
      setMyInterests(prev => 
        isInterested 
          ? [...prev, targetUserId]
          : prev.filter(id => id !== targetUserId)
      );

      // Update the people interested list
      setPeopleInterested(prev => 
        prev.map(person => 
          person.id === targetUserId 
            ? { ...person, iAmInterestedInThem: isInterested }
            : person
        )
      );

    } catch (err) {
      console.error("Error expressing interest:", err);
      alert("Failed to express interest. Please try again.");
    }
  };

  const loadMyInterests = async () => {
    try {
      const auth = getAuth();
      const currentUser = auth.currentUser;
      
      if (!currentUser) return;

      const userRef = doc(db, "users", currentUser.uid);
      const userSnap = await getDoc(userRef);
      
      if (userSnap.exists()) {
        const userData = userSnap.data();
        setMyInterests(userData.peopleInterestedInMe || []);
      }
    } catch (err) {
      console.error("Error loading my interests:", err);
    }
  };

  const handleViewProfile = (person: any) => {
    setSelectedProfile(person);
    setIsProfileModalOpen(true);
  };

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
                <div className="mt-3">
                  <Button
                    onClick={() => {
                      setSelectedEvent(event);
                      fetchPeopleInterested(String(event.id));
                      setIsPeopleModalOpen(true);
                    }}
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white"
                  >
                    View People Interested ({event.peopleInterested?.length || 0})
                  </Button>

                </div>
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
      
      {/* People Interested Modal */}
      <Dialog open={isPeopleModalOpen} onOpenChange={setIsPeopleModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              People Interested in {selectedEvent?.title}
            </DialogTitle>
          </DialogHeader>
          


          <div className="p-4">
            {loadingPeople ? (
              <div className="text-center py-8">
                <p className="text-gray-500">Loading people interested...</p>
              </div>
            ) : peopleInterested.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No one has expressed interest yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-sm text-gray-600 mb-4">
                  {peopleInterested.length} person{peopleInterested.length !== 1 ? 's' : ''} interested in this event:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {peopleInterested.map((person) => (
                    <div key={person.id} className="border rounded-lg p-4 bg-gray-50">
                      <div className="flex items-center gap-3">
                        {person.profileImage && (
                          <img
                            src={person.profileImage}
                            alt={person.name}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                        )}
                        {!person.profileImage && (
                          <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                            <span className="text-gray-500">👤</span>
                          </div>
                        )}
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-lg">{person.name}</h3>
                            {person.hasProfile === false && (
                              <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs">
                                Private Profile
                              </span>
                            )}
                          </div>
                          {person.age && (
                            <p className="text-sm text-gray-600">Age: {person.age}</p>
                          )}
                          {person.location && (
                            <p className="text-sm text-gray-600">Location: {person.location}</p>
                          )}
                          {person.bio && (
                            <p className="text-sm text-gray-700 mt-2 line-clamp-2">{person.bio}</p>
                          )}
                        </div>
                      </div>
                      
                      {/* Interest Status Indicators */}
                      <div className="mt-3 flex gap-2">
                        {person.isInterestedInMe && (
                          <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                            ✓ Interested in you
                          </span>
                        )}
                        {person.iAmInterestedInThem && (
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                            ✓ You're interested
                          </span>
                        )}
                      </div>
                      
                      {person.eventPreferences && person.eventPreferences.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-3">
                          {person.eventPreferences.map((pref: string, i: number) => (
                            <span key={i} className="bg-blue-500 text-white px-2 py-1 rounded text-xs">
                              {pref}
                            </span>
                          ))}
                        </div>
                      )}
                      
                      <div className="mt-3 flex gap-2">
                        <Button
                          className={`flex-1 ${
                            person.iAmInterestedInThem 
                              ? 'bg-red-500 hover:bg-red-600' 
                              : 'bg-green-500 hover:bg-green-600'
                          } text-white`}
                          onClick={() => handleExpressInterest(person.id, !person.iAmInterestedInThem)}
                        >
                          {person.iAmInterestedInThem ? 'Remove Interest' : 'Show Interest'}
                        </Button>
                        <Button
                          variant="outline"
                          className="flex-1"
                          onClick={() => handleViewProfile(person)}
                        >
                          View Profile
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
                  </DialogContent>
        </Dialog>

        {/* Profile Modal */}
        <Dialog open={isProfileModalOpen} onOpenChange={setIsProfileModalOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">
                {selectedProfile?.name}'s Profile
              </DialogTitle>
            </DialogHeader>

            {selectedProfile && (
              <div className="p-6">
                <div className="flex flex-col items-center mb-6">
                  {selectedProfile.profileImage && (
                    <img
                      src={selectedProfile.profileImage}
                      alt={selectedProfile.name}
                      className="w-32 h-32 rounded-full object-cover border-4 border-gray-200 mb-4"
                    />
                  )}
                  {!selectedProfile.profileImage && (
                    <div className="w-32 h-32 rounded-full border-4 border-gray-200 mb-4 bg-gray-100 flex items-center justify-center">
                      <span className="text-gray-500 text-2xl">👤</span>
                    </div>
                  )}
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {selectedProfile.name}
                  </h2>
                  {selectedProfile.hasProfile === false && (
                    <div className="bg-yellow-100 border border-yellow-400 text-yellow-800 px-3 py-2 rounded mb-4">
                      ⚠️ Profile information is not publicly available. This user may have privacy settings enabled.
                    </div>
                  )}
                  <div className="flex items-center gap-4 text-gray-600 mb-4">
                    {selectedProfile.age && (
                      <span className="flex items-center gap-1">
                        <span className="text-sm">Age: {selectedProfile.age}</span>
                      </span>
                    )}
                    {selectedProfile.location && (
                      <span className="flex items-center gap-1">
                        <span className="text-sm">📍 {selectedProfile.location}</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Bio Section */}
                {selectedProfile.bio && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">About</h3>
                    <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                      {selectedProfile.bio}
                    </p>
                  </div>
                )}

                {/* Event Preferences */}
                {selectedProfile.eventPreferences && selectedProfile.eventPreferences.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Event Preferences</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedProfile.eventPreferences.map((pref: string, i: number) => (
                        <span
                          key={i}
                          className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium"
                        >
                          {pref}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Interest Status */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Connection Status</h3>
                  <div className="space-y-2">
                    {selectedProfile.isInterestedInMe && (
                      <div className="flex items-center gap-2 text-green-600">
                        <span className="text-lg">✓</span>
                        <span>They are interested in you</span>
                      </div>
                    )}
                    {selectedProfile.iAmInterestedInThem && (
                      <div className="flex items-center gap-2 text-blue-600">
                        <span className="text-lg">✓</span>
                        <span>You are interested in them</span>
                      </div>
                    )}
                    {!selectedProfile.isInterestedInMe && !selectedProfile.iAmInterestedInThem && (
                      <div className="text-gray-500">
                        No mutual interest yet
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-center pt-4 border-t border-gray-200">
                  <Button
                    className={`${
                      selectedProfile.iAmInterestedInThem 
                        ? 'bg-red-500 hover:bg-red-600' 
                        : 'bg-green-500 hover:bg-green-600'
                    } text-white px-8 py-2`}
                    onClick={() => {
                      handleExpressInterest(selectedProfile.id, !selectedProfile.iAmInterestedInThem);
                      setIsProfileModalOpen(false);
                    }}
                  >
                    {selectedProfile.iAmInterestedInThem ? 'Remove Interest' : 'Show Interest'}
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    );
  }