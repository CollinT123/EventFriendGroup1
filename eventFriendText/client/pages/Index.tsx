import { useState } from "react";
import { ContactsList } from "@/components/ContactsList";
import { ChatArea } from "@/components/ChatArea";

interface Contact {
  id: string;
  name: string;
  lastMessage?: string;
  timestamp?: string;
  isOnline?: boolean;
}

interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
  isOwn: boolean;
}

// Mock data
const mockContacts: Contact[] = [
  {
    id: "1",
    name: "Alex Thompson",
    lastMessage: "Hey! Are you coming to the event tonight?",
    timestamp: "2:30 PM",
    isOnline: true,
  },
  {
    id: "2",
    name: "Sarah Johnson",
    lastMessage: "Thanks for the concert tickets!",
    timestamp: "1:45 PM",
    isOnline: false,
  },
  {
    id: "3",
    name: "Mike Chen",
    lastMessage: "The party was amazing last night",
    timestamp: "12:15 PM",
    isOnline: true,
  },
  {
    id: "4",
    name: "Emma Davis",
    lastMessage: "Can't wait for the festival this weekend",
    timestamp: "11:30 AM",
    isOnline: false,
  },
  {
    id: "5",
    name: "Ryan Wilson",
    lastMessage: "Just bought tickets for the concert!",
    timestamp: "10:45 AM",
    isOnline: true,
  },
  {
    id: "6",
    name: "Lisa Brown",
    lastMessage: "The event was so much fun",
    timestamp: "Yesterday",
    isOnline: false,
  },
  {
    id: "7",
    name: "David Garcia",
    lastMessage: "Looking forward to next week's meetup",
    timestamp: "Yesterday",
    isOnline: true,
  },
  {
    id: "8",
    name: "Ashley Miller",
    lastMessage: "Great event organization!",
    timestamp: "2 days ago",
    isOnline: false,
  },
];

const mockMessages: Record<string, Message[]> = {
  "1": [
    {
      id: "1",
      senderId: "1",
      text: "Hey there! How are you doing?",
      timestamp: "2:25 PM",
      isOwn: false,
    },
    {
      id: "2",
      senderId: "me",
      text: "Hi Alex! I'm doing great, thanks for asking!",
      timestamp: "2:26 PM",
      isOwn: true,
    },
    {
      id: "3",
      senderId: "1",
      text: "Hey! Are you coming to the event tonight?",
      timestamp: "2:30 PM",
      isOwn: false,
    },
  ],
  "2": [
    {
      id: "1",
      senderId: "2",
      text: "Thanks for the concert tickets!",
      timestamp: "1:45 PM",
      isOwn: false,
    },
  ],
  "3": [
    {
      id: "1",
      senderId: "3",
      text: "The party was amazing last night",
      timestamp: "12:15 PM",
      isOwn: false,
    },
  ],
};

export default function Index() {
  const [selectedContactId, setSelectedContactId] = useState<string>();
  const [messages, setMessages] =
    useState<Record<string, Message[]>>(mockMessages);

  const selectedContact = mockContacts.find((c) => c.id === selectedContactId);
  const currentMessages = selectedContactId
    ? messages[selectedContactId] || []
    : [];

  const handleSendMessage = (text: string) => {
    if (!selectedContactId) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: "me",
      text,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      isOwn: true,
    };

    setMessages((prev) => ({
      ...prev,
      [selectedContactId]: [...(prev[selectedContactId] || []), newMessage],
    }));
  };

  return (
    <div className="min-h-screen bg-white p-3 sm:p-6">
      {/* Header */}
      <div className="text-center mb-4 sm:mb-8">
        <h1 className="text-2xl sm:text-4xl font-bold text-black mb-2">
          Event Friend
        </h1>
        <p className="text-sm sm:text-base text-gray-600">
          Connect with friends and plan events together
        </p>
      </div>

      {/* Main Chat Interface */}
      <div className="max-w-7xl mx-auto h-[calc(100vh-140px)] sm:h-[700px] border-4 border-black rounded-2xl sm:rounded-3xl p-3 sm:p-6 bg-gray-50">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-3 sm:gap-6 h-full">
          {/* Contacts List - Left Side */}
          <div
            className={`lg:col-span-2 ${selectedContactId ? "hidden lg:block" : "block"}`}
          >
            <ContactsList
              contacts={mockContacts}
              selectedContactId={selectedContactId}
              onContactSelect={setSelectedContactId}
            />
          </div>

          {/* Chat Area - Right Side */}
          <div
            className={`lg:col-span-3 ${selectedContactId ? "block" : "hidden lg:block"}`}
          >
            <ChatArea
              selectedContactId={selectedContactId}
              selectedContactName={selectedContact?.name}
              messages={currentMessages}
              onSendMessage={handleSendMessage}
              onBack={() => setSelectedContactId(undefined)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
