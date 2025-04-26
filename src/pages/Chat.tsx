
import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { mockChats } from "@/data/mockChats";
import { ArrowRight } from "lucide-react";

interface Message {
  id: string;
  text: string;
  sender: "user" | "other";
  timestamp: string;
}

interface ChatContact {
  id: string;
  name: string;
  lastMessage: string;
  lastMessageTime: string;
  unread: boolean;
  avatar: string;
  messages: Message[];
}

const Chat = () => {
  const [contacts] = useState<ChatContact[]>(mockChats);
  const [selectedContactId, setSelectedContactId] = useState<string | null>(
    contacts.length > 0 ? contacts[0].id : null
  );
  const [messageText, setMessageText] = useState("");

  const selectedContact = contacts.find(
    (contact) => contact.id === selectedContactId
  );

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!messageText.trim() || !selectedContactId) return;
    
    // In a real app, we would send this message to a backend
    console.log("Sending message:", messageText);
    
    // Clear the input
    setMessageText("");
  };

  return (
    <Layout>
      <div className="page-container max-w-6xl mx-auto">
        <h1 className="section-heading">Messages</h1>

        <div className="bg-white border border-border rounded-lg overflow-hidden min-h-[500px]">
          <div className="grid grid-cols-1 md:grid-cols-3 h-full">
            {/* Contact list sidebar */}
            <div className="md:col-span-1 border-r border-border">
              <div className="p-4 border-b border-border">
                <h2 className="font-medium">Your Conversations</h2>
              </div>
              
              <div className="divide-y divide-border">
                {contacts.length > 0 ? (
                  contacts.map((contact) => (
                    <div
                      key={contact.id}
                      className={`p-4 cursor-pointer transition-colors ${
                        selectedContactId === contact.id
                          ? "bg-muted"
                          : "hover:bg-muted/50"
                      }`}
                      onClick={() => setSelectedContactId(contact.id)}
                    >
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-bookswap-blue text-bookswap-darkblue flex items-center justify-center font-bold text-lg mr-3">
                          {contact.name.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-center">
                            <h3 className="font-medium truncate">
                              {contact.name}
                            </h3>
                            <span className="text-xs text-muted-foreground whitespace-nowrap ml-1">
                              {contact.lastMessageTime}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground truncate">
                            {contact.lastMessage}
                          </p>
                        </div>
                        {contact.unread && (
                          <div className="w-2 h-2 bg-bookswap-darkblue rounded-full ml-2"></div>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-6 text-center">
                    <p className="text-muted-foreground">
                      No conversations yet
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Chat area */}
            <div className="md:col-span-2 flex flex-col h-full">
              {selectedContact ? (
                <>
                  <div className="p-4 border-b border-border">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-bookswap-blue text-bookswap-darkblue flex items-center justify-center font-bold text-sm mr-3">
                        {selectedContact.name.charAt(0)}
                      </div>
                      <h2 className="font-medium">{selectedContact.name}</h2>
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {selectedContact.messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${
                          message.sender === "user" ? "justify-end" : "justify-start"
                        }`}
                      >
                        <div
                          className={`max-w-[80%] rounded-lg px-4 py-2 ${
                            message.sender === "user"
                              ? "bg-bookswap-darkblue text-white"
                              : "bg-muted"
                          }`}
                        >
                          <p>{message.text}</p>
                          <p className={`text-xs mt-1 ${
                            message.sender === "user"
                              ? "text-white/80"
                              : "text-muted-foreground"
                          }`}>
                            {message.timestamp}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="p-4 border-t border-border">
                    <form onSubmit={handleSendMessage} className="flex gap-2">
                      <Input
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1"
                      />
                      <Button 
                        type="submit" 
                        disabled={!messageText.trim()} 
                        className="bg-bookswap-darkblue hover:bg-bookswap-darkblue/90"
                      >
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </form>
                    <p className="text-xs text-muted-foreground mt-2">
                      Keep communication focused on book swaps and meeting arrangements.
                    </p>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center p-6">
                    <p className="text-muted-foreground mb-3">
                      Select a conversation or start a new one from your matches
                    </p>
                    <Button asChild className="bg-bookswap-darkblue hover:bg-bookswap-darkblue/90">
                      <Link to="/matches">Find Matches</Link>
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Chat;
