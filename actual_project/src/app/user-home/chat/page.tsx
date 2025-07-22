"use client"
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { getAuth } from "firebase/auth";
import { db } from "@/firebase/firebaseConfig";
import { doc, getDoc, addDoc, collection, query, orderBy, onSnapshot, serverTimestamp } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";

export default function ChatPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const matchId = searchParams.get('matchId');
  const [match, setMatch] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [otherUser, setOtherUser] = useState<any>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadMatch = async () => {
      if (!matchId) {
        setError("No match ID provided");
        setLoading(false);
        return;
      }

      try {
        const auth = getAuth();
        const currentUser = auth.currentUser;
        
        if (!currentUser) {
          setError("You must be signed in to view this chat");
          setLoading(false);
          return;
        }

        // Get the match document
        const matchRef = doc(db, "matches", matchId);
        const matchSnap = await getDoc(matchRef);
        
        if (!matchSnap.exists()) {
          setError("Match not found");
          setLoading(false);
          return;
        }

        const matchData = matchSnap.data();
        
        // Verify the current user is part of this match
        if (matchData.userA !== currentUser.uid && matchData.userB !== currentUser.uid) {
          setError("You don't have permission to view this chat");
          setLoading(false);
          return;
        }

        setMatch({ id: matchId, ...matchData });
        
        // Determine the other user's ID and load their profile
        const otherUserId = matchData.userA === currentUser.uid ? matchData.userB : matchData.userA;
        
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
      } catch (err) {
        console.error("Error loading match:", err);
        setError("Failed to load match");
      } finally {
        setLoading(false);
      }
    };

    loadMatch();
  }, [matchId]);

  // Subscribe to messages for this match
  useEffect(() => {
    if (!match?.id) return;

    const messagesQuery = query(
      collection(db, `matches/${match.id}/messages`),
      orderBy('timestamp', 'asc')
    );

    const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
      const messageList: any[] = [];
      snapshot.forEach((doc) => {
        messageList.push({ id: doc.id, ...doc.data() });
      });
      setMessages(messageList);
    });

    return () => unsubscribe();
  }, [match?.id]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!newMessage.trim() || !match?.id || sending) return;

    setSending(true);
    try {
      const auth = getAuth();
      const currentUser = auth.currentUser;
      
      if (!currentUser) {
        alert('You must be signed in to send messages.');
        return;
      }

      await addDoc(collection(db, `matches/${match.id}/messages`), {
        senderId: currentUser.uid,
        text: newMessage.trim(),
        timestamp: serverTimestamp(),
        senderName: currentUser.displayName || 'You'
      });

      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message. Please try again.');
    } finally {
      setSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (timestamp: any) => {
    if (!timestamp) return '';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const isMyMessage = (message: any) => {
    const auth = getAuth();
    const currentUser = auth.currentUser;
    return message.senderId === currentUser?.uid;
  };

  // Get first name from full name
  const getFirstName = (fullName: string) => {
    return fullName.split(' ')[0] || fullName;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading chat...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <p className="font-bold">Error</p>
            <p>{error}</p>
          </div>
          <Link href="/user-home/dashboard">
            <Button className="bg-blue-500 hover:bg-blue-600 text-white">
              ← Back to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/user-home/dashboard">
                <Button variant="outline" size="sm">
                  ← Back to Dashboard
                </Button>
              </Link>
              <div>
                <h1 className="text-xl font-semibold">
                  {loadingUser ? "Loading..." : (otherUser ? `Chat with ${getFirstName(otherUser.name)}` : "Chat")}
                </h1>
                <p className="text-sm text-gray-600">
                  {loadingUser ? "Loading user details..." : (otherUser ? `Matched on ${match?.eventId ? "an event" : "an event"}` : "Match details")}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Avatar className="w-8 h-8">
                <AvatarImage src={otherUser?.profilePicture} alt={otherUser?.name || "User"} />
                <AvatarFallback className="bg-gradient-to-r from-gray-400 to-gray-500 text-white text-xs">
                  {otherUser?.name ? otherUser.name.charAt(0).toUpperCase() : "?"}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Container */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="bg-white rounded-lg shadow-sm border">
          {/* Chat Header */}
          <div className="border-b p-4">
            <div className="flex items-center gap-3">
              <Avatar className="w-12 h-12">
                <AvatarImage src={otherUser?.profilePicture} alt={otherUser?.name || "User"} />
                <AvatarFallback className="bg-gradient-to-r from-gray-400 to-gray-500 text-white">
                  {otherUser?.name ? otherUser.name.charAt(0).toUpperCase() : "?"}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="font-semibold text-lg">
                  {loadingUser ? "Loading..." : (otherUser ? `Chat with ${getFirstName(otherUser.name)}` : "Match Chat")}
                </h2>
                <p className="text-sm text-gray-600">
                  {match?.eventId ? "Event details" : "Event details unavailable"}
                </p>
                <p className="text-xs text-green-600 font-medium">✓ Mutual Interest Confirmed</p>
              </div>
            </div>
          </div>

          {/* Messages Area */}
          <div className="h-96 p-4 overflow-y-auto">
            {messages.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">👤</span>
                </div>
                <p className="text-lg font-medium mb-2">Start the conversation!</p>
                <p className="text-sm">Send your first message to begin chatting</p>
              </div>
            ) : (
              <div className="space-y-3">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${isMyMessage(message) ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className="max-w-xs lg:max-w-md">
                      <p className="text-sm text-gray-900 mb-1">{message.text}</p>
                      <p className="text-xs text-gray-500">
                        {formatTime(message.timestamp)}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* Message Input */}
          <div className="border-t p-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={sending}
              />
              <Button 
                onClick={sendMessage}
                disabled={!newMessage.trim() || sending}
                className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white"
              >
                {sending ? 'Sending...' : 'Send'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 