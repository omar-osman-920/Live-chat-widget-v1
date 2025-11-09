import { useState } from "react";
import { Sidebar } from "./components/Sidebar";
import { TopNav } from "./components/TopNav";
import { MessagingContent } from "./components/MessagingContent";
import { ChatInterface } from "./components/ChatInterface";
import { ConversationsPage } from "./components/ConversationsPage";
import { TestWebsitePage } from "./components/TestWebsitePage";

export default function App() {
  const [activeSection, setActiveSection] =
    useState("messaging");
  const [activeSubSection, setActiveSubSection] = useState(
    "live-chat-widget",
  );
  const [currentPage, setCurrentPage] = useState<
    "settings" | "chat" | "conversations" | "test-website"
  >("settings");

  return (
    <div className="flex h-screen bg-gray-50">
      {currentPage === "settings" ? (
        <>
          {/* Left Settings Sidebar */}
          <Sidebar
            activeSection={activeSection}
            activeSubSection={activeSubSection}
            onSectionChange={setActiveSection}
            onSubSectionChange={setActiveSubSection}
          />

          {/* Main Content */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <TopNav
              onChatClick={() => setCurrentPage("chat")}
              onConversationsClick={() =>
                setCurrentPage("conversations")
              }
              onTestWebsiteClick={() =>
                setCurrentPage("test-website")
              }
              currentPage={currentPage}
            />
            <main className="flex-1 overflow-y-auto">
              <MessagingContent activeTab={activeSubSection} />
            </main>
          </div>
        </>
      ) : currentPage === "chat" ? (
        <div className="flex-1 flex flex-col overflow-hidden">
          <TopNav
            onChatClick={() => setCurrentPage("chat")}
            onConversationsClick={() =>
              setCurrentPage("conversations")
            }
            onTestWebsiteClick={() =>
              setCurrentPage("test-website")
            }
            currentPage={currentPage}
          />
          <main className="flex-1 overflow-hidden bg-white">
            <ChatInterface />
          </main>
        </div>
      ) : currentPage === "conversations" ? (
        <div className="flex-1 flex flex-col overflow-hidden">
          <TopNav
            onChatClick={() => setCurrentPage("chat")}
            onConversationsClick={() =>
              setCurrentPage("conversations")
            }
            onTestWebsiteClick={() =>
              setCurrentPage("test-website")
            }
            currentPage={currentPage}
          />
          <main className="flex-1 overflow-hidden">
            <ConversationsPage />
          </main>
        </div>
      ) : (
        <div className="flex-1 flex flex-col overflow-hidden">
          <TopNav
            onChatClick={() => setCurrentPage("chat")}
            onConversationsClick={() =>
              setCurrentPage("conversations")
            }
            onTestWebsiteClick={() =>
              setCurrentPage("test-website")
            }
            currentPage={currentPage}
          />
          <main className="flex-1 overflow-hidden">
            <TestWebsitePage />
          </main>
        </div>
      )}
    </div>
  );
}
