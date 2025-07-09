import { cn } from "@/lib/utils";

interface Contact {
  id: string;
  name: string;
  lastMessage?: string;
  timestamp?: string;
  isOnline?: boolean;
}

interface ContactsListProps {
  contacts: Contact[];
  selectedContactId?: string;
  onContactSelect: (contactId: string) => void;
}

export function ContactsList({
  contacts,
  selectedContactId,
  onContactSelect,
}: ContactsListProps) {
  return (
    <div className="h-full border-2 border-black rounded-2xl p-3 sm:p-4 bg-white flex flex-col">
      <div className="flex-1 overflow-y-auto space-y-2">
        {contacts.map((contact) => (
          <div
            key={contact.id}
            className={cn(
              "border-2 border-black rounded-lg p-2 sm:p-3 cursor-pointer transition-colors hover:bg-gray-50 flex-shrink-0",
              selectedContactId === contact.id && "bg-gray-100",
            )}
            onClick={() => onContactSelect(contact.id)}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium text-sm text-black truncate">
                    {contact.name}
                  </h3>
                  {contact.isOnline && (
                    <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                  )}
                </div>
                {contact.lastMessage && (
                  <p className="text-xs text-gray-600 truncate mt-1">
                    {contact.lastMessage}
                  </p>
                )}
              </div>
              {contact.timestamp && (
                <span className="text-xs text-gray-500 ml-2 flex-shrink-0">
                  {contact.timestamp}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
