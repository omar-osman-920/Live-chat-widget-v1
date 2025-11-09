import { LayoutDashboard, Radio, Phone, PhoneMissed, MessageSquare, Users, UsersRound, BarChart3, BookUser, Workflow, Megaphone, HelpCircle, Video, ChevronDown } from 'lucide-react';
import { Button } from './ui/button';
import exampleImage from 'figma:asset/afa3cd76f8e9bbcdc4d706ec91d2a19a96d1ab88.png';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface TopNavProps {
  onChatClick?: () => void;
  onConversationsClick?: () => void;
  currentPage?: 'settings' | 'chat' | 'conversations';
}

export function TopNav({ onChatClick, onConversationsClick, currentPage }: TopNavProps) {
  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', onClick: undefined },
    { icon: Radio, label: 'Live', onClick: undefined },
    { icon: Phone, label: 'Calls', onClick: undefined },
    { icon: PhoneMissed, label: 'Unanswered Calls', onClick: undefined },
    { icon: MessageSquare, label: 'Conversations', onClick: onConversationsClick },
    { icon: Users, label: 'Users', onClick: undefined },
    { icon: UsersRound, label: 'Groups', onClick: undefined },
    { icon: BarChart3, label: 'Reports', onClick: undefined },
    { icon: BookUser, label: 'Phonebook', onClick: undefined },
    { icon: Workflow, label: 'IVR', onClick: undefined },
    { icon: Megaphone, label: 'Campaigns', onClick: undefined },
    { icon: HelpCircle, label: 'Inquiries', onClick: undefined },
    { icon: Video, label: 'Conferences', onClick: undefined },
  ];

  return (
    <div className="bg-white border-b border-gray-200">
      {/* Logo and Header */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M3 3L10.5 3C11.88 3 13 4.12 13 5.5V10.5C13 11.88 11.88 13 10.5 13H3V3Z" fill="#EF4444"/>
            <path d="M3 13H10.5C11.88 13 13 14.12 13 15.5V20.5C13 21.88 11.88 23 10.5 23H3V13Z" fill="#EF4444"/>
            <path d="M13 3L20.5 3C21.88 3 23 4.12 23 5.5V10.5C23 11.88 21.88 13 20.5 13H13V3Z" fill="#EF4444"/>
          </svg>
          <span className="font-semibold">Maqsam</span>
          <span className="text-gray-400">maqsam</span>
        </div>
        <div className="flex items-center gap-2">
          {currentPage !== 'chat' && (
            <Button 
              variant="default" 
              className="bg-blue-500 hover:bg-blue-600"
              onClick={onChatClick}
            >
              Chat
            </Button>
          )}
          <div className="flex items-center gap-2 ml-2">
            <div className="w-8 h-8 rounded-full bg-purple-200 flex items-center justify-center">
              <span className="text-purple-600">G</span>
            </div>
            <span className="text-sm">Ghadeer E</span>
            <ChevronDown className="w-4 h-4 text-gray-600" />
          </div>
        </div>
      </div>

      {/* Main Navigation - Only show on settings page */}
      {currentPage !== 'chat' && (
        <div className="flex items-center gap-1 px-6 overflow-x-auto">
          {navItems.map((item, index) => (
            <button
              key={index}
              onClick={item.onClick}
              className={`flex items-center gap-2 px-3 py-3 text-sm whitespace-nowrap ${
                currentPage === 'conversations' && item.label === 'Conversations'
                  ? 'text-blue-500 border-b-2 border-blue-500'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <item.icon className="w-4 h-4" />
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}