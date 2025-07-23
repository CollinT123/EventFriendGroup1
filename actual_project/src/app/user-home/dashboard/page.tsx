"use client"
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import { db } from "@/firebase/firebaseConfig";
import { collection, getDocs, query, where, doc, getDoc, updateDoc, arrayUnion, arrayRemove, setDoc, addDoc } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { deleteDoc } from "firebase/firestore";

// MatchCard component
const MatchCard = ({ match, event, otherUserId, onUnmatch }: { match: any; event: any; otherUserId: string; onUnmatch: (matchId: string, otherUserId: string, eventId: string) => void }) => {
  const [otherUser, setOtherUser] = useState<any>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const loadOtherUser = async () => {
      try {
        const userRef = doc(db, "users", otherUserId);
        const userSnap = await getDoc(userRef);
        
        if (userSnap.exists()) {
          setOtherUser({ id: otherUserId, ...userSnap.data() });
        } else {
          setOtherUser({ id: otherUserId, name: "Unknown User" });
        }
      } catch (err) {
        console.error("Error loading other user:", err);
        setOtherUser({ id: otherUserId, name: "Unknown User" });
      } finally {
        setLoadingUser(false);
      }
    };

    loadOtherUser();
  }, [otherUserId]);

  // Get first name from full name
  const getFirstName = (fullName: string) => {
    return fullName.split(' ')[0] || fullName;
  };

  return (
    <div className="border rounded-lg p-4 bg-white shadow">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-12 h-12 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full flex items-center justify-center">
          <span className="text-white font-bold text-lg">💕</span>
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-lg">
            {event ? event.title : "Unknown Event"}
          </h3>
          <p className="text-sm text-gray-600">
            {event ? `${event.date} • ${event.location}` : "Event details unavailable"}
          </p>
          <p className="text-xs text-green-600 font-medium">
            ✓ Matched with {loadingUser ? "..." : getFirstName(otherUser?.name || "Unknown")}
          </p>
        </div>
      </div>
      
      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
        <p className="text-sm text-gray-700">
          You and {loadingUser ? "someone" : getFirstName(otherUser?.name || "Unknown")} are both interested in each other for this event!
        </p>
      </div>
      
      <div className="flex gap-2 mt-4">
        <Button
          className="flex-1 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white"
          onClick={() => {
            router.push(`/user-home/chat?matchId=${match.id}`);
          }}
        >
          💬 Start Chat
        </Button>
        <Button
          variant="outline"
          className="flex-1 border-red-300 text-red-600 hover:bg-red-50"
          onClick={() => {
            if (confirm("Are you sure you want to unmatch with this person? This action cannot be undone.")) {
              onUnmatch(match.id, otherUserId, match.eventId);
            }
          }}
        >
          ❌ Unmatch
        </Button>
      </div>
    </div>
  );
};

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
  const [matches, setMatches] = useState<any[]>([]);
  const [loadingMatches, setLoadingMatches] = useState(false);

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

  useEffect(() => {
    fetchMyEvents();
    loadMyInterests();
    loadMatches();
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
              
              // Check if current user is interested in this person
              const myInterestQuery = query(
                collection(db, "interests"),
                where("fromUser", "==", currentUser?.uid),
                where("toUser", "==", userId),
                where("eventId", "==", eventId)
              );
              const myInterestSnap = await getDocs(myInterestQuery);
              const iAmInterestedInThem = !myInterestSnap.empty;

              // If current user has already expressed interest in this person, return null to filter out
              if (iAmInterestedInThem) {
                return null;
              }

              // Check if this person is interested in current user
              const theirInterestQuery = query(
                collection(db, "interests"),
                where("fromUser", "==", userId),
                where("toUser", "==", currentUser?.uid),
                where("eventId", "==", eventId)
              );
              const theirInterestSnap = await getDocs(theirInterestQuery);
              const isInterestedInMe = !theirInterestSnap.empty;
              
              if (userData) {
                return { 
                  id: userId, 
                  ...userData,
                  hasProfile: true,
                  isInterestedInMe: isInterestedInMe,
                  iAmInterestedInThem: iAmInterestedInThem
                };
              } else {
                // If we can't access the profile due to permissions, show a generic message
                return { 
                  id: userId, 
                  name: `User ${userId.slice(0, 8)}...`, 
                  bio: "Profile information is not publicly available. This user may have privacy settings enabled.",
                  isInterestedInMe: isInterestedInMe,
                  iAmInterestedInThem: iAmInterestedInThem,
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
                iAmInterestedInThem: false,
                hasProfile: false
              };
            }
          })
        );
        
        // Filter out null values (users we've already expressed interest in)
        const filteredProfiles = peopleProfiles.filter(profile => profile !== null);
        setPeopleInterested(filteredProfiles);
      }
    } catch (err) {
      console.error("Error fetching people interested:", err);
    }
    setLoadingPeople(false);
  };

  const handleRemoveEventInterest = async (eventId: string) => {
    try {
      const auth = getAuth();
      const currentUser = auth.currentUser;
      
      if (!currentUser) {
        alert("You must be signed in to remove event interest.");
        return;
      }

      console.log("Removing interest for event:", eventId, "User:", currentUser.uid);

      if (confirm("Are you sure you want to remove your interest in this event?")) {
        // Remove user from event's peopleInterested array
        const eventRef = doc(db, "events", String(eventId));
        const eventSnap = await getDoc(eventRef);
        
        if (eventSnap.exists()) {
          const eventData = eventSnap.data();
          const currentPeopleInterested = eventData.peopleInterested || [];
          
          console.log("Current people interested:", currentPeopleInterested);
          
          // Remove the current user from the array
          const updatedPeopleInterested = currentPeopleInterested.filter(
            (userId: string) => userId !== currentUser.uid
          );
          
          console.log("Updated people interested:", updatedPeopleInterested);
          
          // Update the event document
          await updateDoc(eventRef, {
            peopleInterested: updatedPeopleInterested
          });
          
          // Remove all matches for this event involving the current user
          const matchesQuery1 = query(
            collection(db, "matches"),
            where("eventId", "==", eventId),
            where("userA", "==", currentUser.uid)
          );
          const matchesSnap1 = await getDocs(matchesQuery1);
          const deleteMatchPromises1 = matchesSnap1.docs.map(doc => deleteDoc(doc.ref));
          await Promise.all(deleteMatchPromises1);
          
          // Also check for matches where userB is the current user
          const matchesQuery2 = query(
            collection(db, "matches"),
            where("eventId", "==", eventId),
            where("userB", "==", currentUser.uid)
          );
          const matchesSnap2 = await getDocs(matchesQuery2);
          const deleteMatchPromises2 = matchesSnap2.docs.map(doc => deleteDoc(doc.ref));
          await Promise.all(deleteMatchPromises2);
          
          console.log(`Removed ${matchesSnap1.docs.length + matchesSnap2.docs.length} matches for this event`);
          
          // Refresh the events list and matches
          await fetchMyEvents();
          await loadMatches();
          
          alert("Event interest removed successfully! All matches for this event have also been removed.");
        } else {
          console.error("Event not found:", eventId);
          alert("Event not found. Please try again.");
        }
      }
    } catch (err) {
      console.error("Error removing event interest:", err);
      console.error("Event ID:", eventId);
      console.error("Error details:", err);
      alert("Failed to remove event interest. Please try again.");
    }
  };

  const handleExpressInterest = async (targetUserId: string, isInterested: boolean, eventId: string) => {
    try {
      const auth = getAuth();
      const currentUser = auth.currentUser;
      
      if (!currentUser) {
        alert("You must be signed in to express interest.");
        return;
      }

      if (isInterested) {
        // Check if interest already exists
        const existingInterestQuery = query(
          collection(db, "interests"),
          where("fromUser", "==", currentUser.uid),
          where("toUser", "==", targetUserId),
          where("eventId", "==", eventId)
        );
        
        const existingInterestSnap = await getDocs(existingInterestQuery);
        
        if (!existingInterestSnap.empty) {
          alert("You've already expressed interest in this person for this event!");
          return;
        }
        
        // Create interest document
        const interestData = {
          fromUser: currentUser.uid,
          toUser: targetUserId,
          eventId: eventId,
          timestamp: new Date().toISOString()
        };
        
        await addDoc(collection(db, "interests"), interestData);
        
        // Check for mutual interest and create match
        const mutualInterestQuery = query(
          collection(db, "interests"),
          where("fromUser", "==", targetUserId),
          where("toUser", "==", currentUser.uid),
          where("eventId", "==", eventId)
        );
        
        const mutualInterestSnap = await getDocs(mutualInterestQuery);
        if (!mutualInterestSnap.empty) {
          // Mutual interest detected! Create a match
          await createMatch(currentUser.uid, targetUserId, eventId);
          alert("🎉 It's a match! You both are interested in each other!");
          
          // Refresh matches list to show the new match
          await loadMatches();
        }
        
        // Refresh the people interested list to remove the person from the list
        if (selectedEvent) {
          await fetchPeopleInterested(String(selectedEvent.id));
        }
      } else {
        // For now, we don't allow removing interest to prevent confusion
        // Users can only express interest once per person per event
        alert("Interest cannot be removed once expressed.");
        return;
      }

      // Update local state
      setMyInterests(prev => 
        isInterested 
          ? [...prev, targetUserId]
          : prev.filter(id => id !== targetUserId)
      );

      // Remove the person from the people interested list since we've expressed interest
      setPeopleInterested(prev => 
        prev.filter(person => person.id !== targetUserId)
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

      // Get all interests where current user is the fromUser
      const interestsQuery = query(
        collection(db, "interests"),
        where("fromUser", "==", currentUser.uid)
      );
      
      const interestsSnap = await getDocs(interestsQuery);
      const interestUserIds = interestsSnap.docs.map(doc => doc.data().toUser);
      
      setMyInterests(interestUserIds);
    } catch (err) {
      console.error("Error loading my interests:", err);
    }
  };

  const handleViewProfile = (person: any) => {
    setSelectedProfile(person);
    setIsProfileModalOpen(true);
  };

  const createMatch = async (userA: string, userB: string, eventId: string) => {
    try {
      const auth = getAuth();
      const currentUser = auth.currentUser;
      
      if (!currentUser) return;

      // Create a unique match ID (ensure consistent ordering)
      const sortedUsers = [userA, userB].sort();
      const matchId = `${sortedUsers[0]}_${sortedUsers[1]}_${eventId}`;
      
      // Check if match already exists
      const existingMatchRef = doc(db, "matches", matchId);
      const existingMatchSnap = await getDoc(existingMatchRef);
      
      if (existingMatchSnap.exists()) {
        console.log("Match already exists:", matchId);
        return; // Don't create duplicate
      }
      
      // Create the match document
      const matchData = {
        userA: userA,
        userB: userB,
        eventId: eventId,
        status: "pending",
        createdAt: new Date().toISOString(),
        lastActivity: new Date().toISOString()
      };

      await setDoc(doc(db, "matches", matchId), matchData);
      console.log("Match created:", matchId);
      
      // Refresh matches
      loadMatches();
    } catch (err) {
      console.error("Error creating match:", err);
    }
  };

  const unmatchUser = async (matchId: string, otherUserId: string, eventId: string) => {
    try {
      const auth = getAuth();
      const currentUser = auth.currentUser;
      
      if (!currentUser) {
        alert("You must be signed in to unmatch.");
        return;
      }

      console.log("Starting unmatch process...");
      console.log("Match ID:", matchId);
      console.log("Other User ID:", otherUserId);
      console.log("Event ID:", eventId);

      // Delete the match document first
      console.log("Deleting match document...");
      const matchRef = doc(db, "matches", matchId);
      await deleteDoc(matchRef);
      console.log("Match document deleted successfully");

      // Remove the match from local state immediately
      setMatches(prev => prev.filter(match => match.id !== matchId));
      console.log("Match removed from local state");

      // Delete interests from both users for this event
      try {
        console.log("Deleting interests from both users...");
        console.log("Event ID type:", typeof eventId, "Value:", eventId);
        console.log("Current User ID:", currentUser.uid);
        console.log("Other User ID:", otherUserId);
        
        // First, let's just try to get all interests to see if the query works
        console.log("Attempting to query interests collection...");
        const interestsQuery = query(collection(db, "interests"));
        
        try {
          const interestsSnap = await getDocs(interestsQuery);
          console.log("Successfully queried interests collection. Found", interestsSnap.docs.length, "total documents");
          
          // Now filter for our specific interests
          const relevantInterests = interestsSnap.docs.filter(doc => {
            const data = doc.data();
            console.log("Interest document:", data);
            const isBetweenUsers = (
              (data.fromUser === currentUser.uid && data.toUser === otherUserId) ||
              (data.fromUser === otherUserId && data.toUser === currentUser.uid)
            );
            const isSameEvent = data.eventId === eventId;
            console.log("Is between users:", isBetweenUsers, "Is same event:", isSameEvent);
            return isBetweenUsers && isSameEvent;
          });
          
          console.log("Found", relevantInterests.length, "relevant interest documents to delete");
          
          if (relevantInterests.length > 0) {
            const deletePromises = relevantInterests.map(doc => deleteDoc(doc.ref));
            await Promise.all(deletePromises);
            console.log("All relevant interest documents deleted successfully");
          } else {
            console.log("No relevant interest documents found to delete");
          }
        } catch (queryError: any) {
          console.log("Error querying interests collection:", queryError);
          console.log("Query error details:", queryError.message, queryError.code);
        }
      } catch (interestError) {
        console.log("Interest deletion failed (this is optional):", interestError);
        console.log("Error details:", interestError);
        // Don't fail the whole unmatch if interest deletion fails
      }

      console.log("Unmatched successfully");
    } catch (error) {
      console.error("Error unmatching:", error);
      alert("Failed to unmatch. Please try again.");
    }
  };

  const loadMatches = async () => {
    try {
      const auth = getAuth();
      const currentUser = auth.currentUser;
      
      if (!currentUser) return;

      setLoadingMatches(true);
      
      // Get matches where current user is either userA or userB
      const matchesQuery = query(
        collection(db, "matches"),
        where("userA", "==", currentUser.uid)
      );
      
      const matchesQuery2 = query(
        collection(db, "matches"),
        where("userB", "==", currentUser.uid)
      );

      const [snapshot1, snapshot2] = await Promise.all([
        getDocs(matchesQuery),
        getDocs(matchesQuery2)
      ]);

      const allMatches = [
        ...snapshot1.docs.map(doc => ({ id: doc.id, ...doc.data() })),
        ...snapshot2.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      ];

      setMatches(allMatches);
    } catch (err) {
      console.error("Error loading matches:", err);
    } finally {
      setLoadingMatches(false);
    }
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
                <div className="mt-3 space-y-2">
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
                  <Button
                    onClick={() => {
                      console.log("Event object:", event);
                      console.log("Event ID:", event.id, "Type:", typeof event.id);
                      handleRemoveEventInterest(event.id);
                    }}
                    variant="outline"
                    className="w-full border-red-500 text-red-600 hover:bg-red-50 hover:border-red-600"
                  >
                    ❌ Remove Event Interest
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Matches Section */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold">My Matches</h2>
          {matches.length > 0 && (
            <span className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-3 py-1 rounded-full text-sm font-medium">
              {matches.length} match{matches.length !== 1 ? 'es' : ''}
            </span>
          )}
        </div>
        {loadingMatches ? (
          <div>Loading your matches...</div>
        ) : matches.length === 0 ? (
          <div className="text-gray-500">No matches yet. Express interest in people to create matches!</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {matches.map((match) => {
              // Find the event details for this match
              const event = myEvents.find(e => String(e.id) === String(match.eventId));
              
              // Determine the other user's ID (not the current user)
              const auth = getAuth();
              const currentUser = auth.currentUser;
              const otherUserId = currentUser?.uid === match.userA ? match.userB : match.userA;
              
                              return (
                  <MatchCard 
                    key={match.id} 
                    match={match} 
                    event={event} 
                    otherUserId={otherUserId}
                    onUnmatch={unmatchUser}
                  />
                );
            })}
          </div>
        )}
      </section>

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
                            <span className="text-gray-500 text-lg">👤</span>
                          </div>
                        )}
                        <div className="flex-1">
                          <h3 className="font-semibold">{person.name}</h3>
                          <p className="text-sm text-gray-600">
                            {person.age && `${person.age} years old`}
                            {person.location && ` • ${person.location}`}
                          </p>
                        </div>
                      </div>
                      
                      {person.bio && (
                        <p className="text-sm text-gray-700 mt-2 line-clamp-2">
                          {person.bio}
                        </p>
                      )}
                      
                      <div className="flex gap-2 mt-3">
                        <Button
                          className={`flex-1 ${
                            person.iAmInterestedInThem 
                              ? 'bg-gray-500 cursor-not-allowed' 
                              : 'bg-green-500 hover:bg-green-600'
                          } text-white`}
                          onClick={() => handleExpressInterest(person.id, !person.iAmInterestedInThem, selectedEvent?.id || '')}
                          disabled={person.iAmInterestedInThem}
                        >
                          {person.iAmInterestedInThem ? 'Already Interested' : 'Show Interest'}
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
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Profile Details</DialogTitle>
          </DialogHeader>
          
          {selectedProfile && (
            <div className="space-y-6">
              {/* Profile Header */}
              <div className="flex items-center gap-4">
                {selectedProfile.profileImage && (
                  <img
                    src={selectedProfile.profileImage}
                    alt={selectedProfile.name}
                    className="w-20 h-20 rounded-full object-cover"
                  />
                )}
                {!selectedProfile.profileImage && (
                  <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center">
                    <span className="text-gray-500 text-2xl">👤</span>
                  </div>
                )}
                <div>
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
                      ? 'bg-gray-500 cursor-not-allowed' 
                      : 'bg-green-500 hover:bg-green-600'
                  } text-white px-8 py-2`}
                  onClick={() => {
                    if (!selectedProfile.iAmInterestedInThem) {
                      handleExpressInterest(selectedProfile.id, true, selectedEvent?.id);
                    }
                    setIsProfileModalOpen(false);
                  }}
                  disabled={selectedProfile.iAmInterestedInThem}
                >
                  {selectedProfile.iAmInterestedInThem ? 'Already Interested' : 'Show Interest'}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}