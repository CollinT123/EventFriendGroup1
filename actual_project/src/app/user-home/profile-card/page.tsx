"use client";

import { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import { db } from "@/firebase/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function Page() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError("");
      try {
        const auth = getAuth();
        const user = auth.currentUser;
        if (!user) {
          setError("Not signed in");
          setLoading(false);
          return;
        }
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProfile(docSnap.data());
        } else {
          setError("Profile not found");
        }
      } catch (err: any) {
        setError(err.message || "Failed to load profile");
      }
      setLoading(false);
    };
    fetchProfile();
  }, []);

  if (loading) return <div>Loading profile...</div>;
  if (error) return <div className="text-red-600">{error}</div>;
  if (!profile) return null;

  return (
    <Card className="max-w-xl mx-auto p-6 flex flex-col items-center gap-4">
      {profile.profileImage && (
        <img
          src={profile.profileImage}
          alt="Profile"
          className="w-32 h-32 rounded-full object-cover border-4 border-black"
        />
      )}
      <h2 className="text-2xl font-bold text-black">{profile.name}</h2>
      <p className="text-gray-700 text-center whitespace-pre-line">{profile.bio}</p>
      <div className="flex flex-wrap gap-2 mt-2">
        {profile.eventPreferences?.map((pref: string, i: number) => (
          <Badge key={i} className="bg-blue-500 text-white">{pref}</Badge>
        ))}
      </div>
      <div className="flex gap-6 mt-4">
        <div>
          <span className="font-semibold">Distance:</span> {profile.distancePreference} miles
        </div>
        <div>
          <span className="font-semibold">Age:</span> {profile.agePreference}
        </div>
      </div>
    </Card>
  );
} 