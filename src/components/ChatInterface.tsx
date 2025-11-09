import image_0b483ab378990d6b7852796f11dfd191d147df6c from 'figma:asset/0b483ab378990d6b7852796f11dfd191d147df6c.png';
import { useState } from 'react';
import { Search, Copy, MoreVertical, Paperclip, Smile, Send, FileText, Image as ImageIcon, File, MessagesSquare, ArrowUpDown, SquarePen, Inbox, ChevronDown } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import svgPaths from '../imports/svg-iv1v05isbh';
import liveChatIcon from 'figma:asset/563f9a48b16c8856a2d99e4f5a334face3833177.png';

interface Conversation {
  id: string;
  name: string;
  phoneNumber?: string;
  email?: string;
  lastMessage: string;
  time: string;
  hasAlert: boolean;
  unreadCount: number;
  isClaimed: boolean;
  hasBoldName?: boolean;
  source: 'whatsapp' | 'livechat';
  chatWidgetName?: string;
}

interface Message {
  id: string;
  text?: string;
  time: string;
  isSent: boolean;
  hasCheck?: boolean;
  isFile?: boolean;
  fileName?: string;
  fileSize?: string;
  fileType?: string;
  fileIcon?: 'pdf' | 'image' | 'csv';
}

const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: '7686470850',
    name: '7686470850',
    lastMessage: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.',
    time: '8 hours ago',
    hasAlert: true,
    unreadCount: 21,
    isClaimed: false,
    source: 'whatsapp',
  },
  {
    id: '10001',
    name: 'Hisham Alshabaan',
    email: 'hisham.alshabaan@example.com',
    phoneNumber: '+966501234567',
    lastMessage: 'Ghadeer:  يعطيك العافيه 👋',
    time: '8 hours ago',
    hasAlert: false,
    unreadCount: 0,
    isClaimed: true,
    hasBoldName: true,
    source: 'livechat',
    chatWidgetName: 'Support Widget',
  },
  {
    id: '10002',
    name: 'Adam Zain',
    lastMessage: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.',
    time: '8 hours ago',
    hasAlert: false,
    unreadCount: 0,
    isClaimed: true,
    source: 'whatsapp',
  },
  {
    id: '10003',
    name: 'Moe Mohsen',
    phoneNumber: '+966505555555',
    lastMessage: 'Lorem Ipsum is simply dummy text of the printing.',
    time: '8 hours ago',
    hasAlert: true,
    unreadCount: 21,
    isClaimed: false,
    source: 'livechat',
    chatWidgetName: 'Sales Chat Widget',
  },
  {
    id: '10004',
    name: 'Lamis Qabil',
    lastMessage: 'Lorem Ipsum is simply dummy',
    time: '8 hours ago',
    hasAlert: false,
    unreadCount: 0,
    isClaimed: true,
    hasCheck: true,
    source: 'whatsapp',
  },
  {
    id: '10005',
    name: 'Ahmed Ayman',
    email: 'ahmed.ayman@example.com',
    phoneNumber: '+966507777777',
    lastMessage: 'Ghadeer: Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.',
    time: '8 hours ago',
    hasAlert: false,
    unreadCount: 0,
    isClaimed: true,
    hasBoldName: true,
    source: 'livechat',
    chatWidgetName: 'Customer Service Widget',
  },
  {
    id: '12345',
    name: 'id:12345',
    lastMessage: 'Hi, I need help with my order',
    time: '2 hours ago',
    hasAlert: true,
    unreadCount: 3,
    isClaimed: false,
    source: 'livechat',
    chatWidgetName: 'Support Widget',
  },
  {
    id: '67890',
    name: 'id:67890',
    phoneNumber: '+966508888888',
    lastMessage: 'Can you tell me more about your pricing?',
    time: '3 hours ago',
    hasAlert: false,
    unreadCount: 0,
    isClaimed: true,
    source: 'livechat',
    chatWidgetName: 'Sales Chat Widget',
  },
  {
    id: '54321',
    name: 'id:54321',
    email: 'customer@example.com',
    lastMessage: 'I have a question about delivery',
    time: '4 hours ago',
    hasAlert: true,
    unreadCount: 1,
    isClaimed: false,
    source: 'livechat',
    chatWidgetName: 'Support Widget',
  },
  {
    id: '10006',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@example.com',
    phoneNumber: '+966509999999',
    lastMessage: 'Thank you for your help!',
    time: '5 hours ago',
    hasAlert: false,
    unreadCount: 0,
    isClaimed: true,
    hasBoldName: true,
    source: 'livechat',
    chatWidgetName: 'Customer Service Widget',
  },
  {
    id: '10007',
    name: 'Michael Chen',
    email: 'michael.chen@example.com',
    lastMessage: 'When will my package arrive?',
    time: '6 hours ago',
    hasAlert: true,
    unreadCount: 2,
    isClaimed: false,
    hasBoldName: true,
    source: 'livechat',
    chatWidgetName: 'Support Widget',
  },
];

const MOCK_MESSAGES: Message[] = [
  {
    id: '1',
    isFile: true,
    fileName: 'ProductGuide',
    fileSize: '402 KB',
    fileType: 'Jpg',
    fileIcon: 'image',
    time: 'May 6, 2022  1:10 PM',
    isSent: false,
  },
  {
    id: '2',
    text: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since',
    time: 'May 6, 2022  1:10 PM',
    isSent: true,
    hasCheck: true,
  },
  {
    id: '3',
    isFile: true,
    fileName: 'Screenshot',
    fileSize: '402 KB',
    fileType: 'PNG',
    fileIcon: 'image',
    time: 'May 6, 2022  1:10 PM',
    isSent: true,
    hasCheck: true,
  },
  {
    id: '4',
    text: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since',
    time: 'May 6, 2022  1:10 PM',
    isSent: false,
  },
  {
    id: '5',
    text: 'One',
    time: '8 hours ago',
    isSent: false,
  },
  {
    id: '6',
    isFile: true,
    fileName: 'Sales-Report-2nd Quarter 2-2024-',
    fileSize: '402 KB',
    fileType: 'CSV',
    fileIcon: 'csv',
    time: 'May 6, 2022',
    isSent: true,
    hasCheck: true,
  },
];

function WhatsAppIcon() {
  return (
    <div className="relative shrink-0 w-4 h-4 bg-[rgba(0,0,0,0)] p-[0px]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15 15">
        <g>
          <path clipRule="evenodd" d={svgPaths.p3db9dd00} fill="#42C152" fillRule="evenodd" />
          <path clipRule="evenodd" d={svgPaths.p2ec25100} fill="#42C152" fillRule="evenodd" />
        </g>
      </svg>
    </div>
  );
}

function LiveChatIcon() {
  return (
    <div className="relative shrink-0 w-5 h-5 flex items-center justify-center">
      <MessagesSquare className="w-6 h-6 text-[#1677ff]" />
    </div>
  );
}

export function ChatInterface() {
  const [selectedConversation, setSelectedConversation] = useState<string>('10001');
  const [messageInput, setMessageInput] = useState('');
  const [activeTab, setActiveTab] = useState<'unclaimed' | 'claimed' | 'marketing'>('unclaimed');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
  const [selectedInbox, setSelectedInbox] = useState<'all' | 'whatsapp' | 'livechat'>('all');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const activeConversation = MOCK_CONVERSATIONS.find(c => c.id === selectedConversation);

  const handleSortToggle = () => {
    setSortOrder(prev => prev === 'newest' ? 'oldest' : 'newest');
  };

  const handleCreateConversation = () => {
    // Does nothing when clicked
  };

  const handleInboxSelect = (inbox: 'all' | 'whatsapp' | 'livechat') => {
    setSelectedInbox(inbox);
    setIsDropdownOpen(false);
  };

  const filteredConversations = MOCK_CONVERSATIONS.filter(conv => {
    if (selectedInbox === 'all') return true;
    if (selectedInbox === 'whatsapp') return conv.source === 'whatsapp';
    if (selectedInbox === 'livechat') return conv.source === 'livechat';
    return true;
  });

  const getCustomerInfo = (conversation: Conversation) => {
    const parts = [];
    if (conversation.name && !conversation.name.startsWith('id:')) {
      parts.push(`Name: ${conversation.name}`);
    }
    if (conversation.email) {
      parts.push(`Email: ${conversation.email}`);
    }
    if (conversation.phoneNumber) {
      parts.push(`Phone: ${conversation.phoneNumber}`);
    }
    parts.push(`ID: ${conversation.id}`);
    return parts.join('\n');
  };

  const handleCopyCustomerInfo = async (conversation: Conversation) => {
    const parts = [];
    if (conversation.name && !conversation.name.startsWith('id:')) {
      parts.push(`Name: ${conversation.name}`);
    }
    if (conversation.email) {
      parts.push(`Email: ${conversation.email}`);
    }
    if (conversation.phoneNumber) {
      parts.push(`Phone: ${conversation.phoneNumber}`);
    }
    parts.push(`ID: ${conversation.id}`);
    
    const textToCopy = parts.join('\n');
    
    // Try modern Clipboard API first
    if (navigator.clipboard && navigator.clipboard.writeText) {
      try {
        await navigator.clipboard.writeText(textToCopy);
        return;
      } catch (err) {
        // Fall through to fallback method
      }
    }
    
    // Fallback method using textarea
    try {
      const textarea = document.createElement('textarea');
      textarea.value = textToCopy;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="flex h-full bg-white">
      {/* Left Sidebar */}
      <div className="w-[360px] border-r border-gray-200 flex flex-col bg-white">
        {/* WhatsApp Header */}
        <div className="px-4 py-3 border-b border-gray-200">
          <div className="flex items-center gap-2 justify-between">
            <div className="relative flex items-center gap-2">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 hover:bg-gray-50 px-2 py-1 rounded transition-colors"
              >
                {selectedInbox === 'all' && <Inbox className="w-6 h-6 text-gray-700" />}
                {selectedInbox === 'whatsapp' && (
                  <svg className="w-6 h-6" viewBox="0 0 48 48" fill="none">
                    <rect width="48" height="48" rx="8" fill="#25D366"/>
                    <path d="M24 12C17.372 12 12 17.373 12 24C12 26.251 12.654 28.346 13.774 30.125L12.384 35.616L18.062 34.249C19.777 35.245 21.815 35.827 24 35.827C30.628 35.827 36 30.454 36 23.827C36 17.2 30.628 12 24 12ZM24 14.4C29.348 14.4 33.6 18.652 33.6 24C33.6 29.348 29.348 33.6 24 33.6C22.162 33.6 20.448 33.072 19.005 32.169L18.639 31.95L15.471 32.673L16.209 29.597L15.963 29.214C14.937 27.714 14.4 25.921 14.4 24C14.4 18.652 18.652 14.4 24 14.4ZM20.281 18.75C20.079 18.75 19.748 18.822 19.468 19.135C19.188 19.448 18.45 20.139 18.45 21.549C18.45 22.959 19.494 24.321 19.644 24.522C19.794 24.723 21.66 27.675 24.624 28.875C27.012 29.85 27.588 29.631 28.2 29.579C28.812 29.526 29.976 28.888 30.226 28.224C30.476 27.56 30.476 26.996 30.4 26.87C30.325 26.744 30.125 26.669 29.819 26.519C29.513 26.369 28.112 25.678 27.838 25.578C27.564 25.478 27.363 25.428 27.162 25.734C26.961 26.04 26.42 26.681 26.244 26.881C26.068 27.082 25.893 27.108 25.587 26.958C25.281 26.808 24.294 26.493 23.119 25.44C22.2 24.619 21.579 23.604 21.404 23.298C21.229 22.992 21.384 22.831 21.534 22.681C21.667 22.549 21.84 22.331 21.99 22.156C22.14 22.981 22.19 21.856 22.275 21.655C22.36 21.454 22.31 21.279 22.235 21.129C22.16 20.979 21.579 19.569 21.344 18.963C21.127 18.406 20.904 18.475 20.719 18.465C20.535 18.455 20.334 18.453 20.133 18.453L20.281 18.75Z" fill="white"/>
                  </svg>
                )}
                {selectedInbox === 'livechat' && (
                  <MessagesSquare className="w-6 h-6 text-[#1677ff]" />
                )}
                <span className="text-sm text-gray-900">
                  {selectedInbox === 'all' && 'All Inboxes'}
                  {selectedInbox === 'whatsapp' && 'WhatsApp'}
                  {selectedInbox === 'livechat' && 'Live Chat'}
                </span>
                <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {isDropdownOpen && (
                <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                  <button
                    onClick={() => handleInboxSelect('all')}
                    className="w-full flex items-center gap-2 px-3 py-2 hover:bg-gray-50 text-left"
                  >
                    <span className="text-sm text-gray-900">All Inboxes</span>
                  </button>
                  <button
                    onClick={() => handleInboxSelect('whatsapp')}
                    className="w-full flex items-center gap-2 px-3 py-2 hover:bg-gray-50 text-left"
                  >
                    <span className="text-sm text-gray-900">WhatsApp</span>
                  </button>
                  <button
                    onClick={() => handleInboxSelect('livechat')}
                    className="w-full flex items-center gap-2 px-3 py-2 hover:bg-gray-50 text-left rounded-b-lg"
                  >
                    <span className="text-sm text-gray-900">Live Chat</span>
                  </button>
                </div>
              )}
            </div>
            <div className="flex items-center gap-1">
              <button 
                onClick={handleSortToggle}
                className="p-1.5 hover:bg-gray-100 rounded"
                title={`Sort ${sortOrder === 'newest' ? 'oldest first' : 'newest first'}`}
              >
                <ArrowUpDown className="w-4 h-4 text-gray-500" />
              </button>
              {selectedInbox !== 'livechat' && (
                <button 
                  onClick={handleCreateConversation}
                  className="p-1.5 bg-[#1677ff] hover:bg-[#1677ff]/90 rounded"
                  title="Create new conversation"
                >
                  <SquarePen className="w-4 h-4 text-white" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-6 px-4 py-3 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('unclaimed')}
            className={`pb-2 text-sm relative ${
              activeTab === 'unclaimed' ? 'text-[#1677ff]' : 'text-gray-600'
            }`}
          >
            Unclaimed
            {activeTab === 'unclaimed' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#1677ff]" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('claimed')}
            className={`pb-2 text-sm relative ${
              activeTab === 'claimed' ? 'text-[#1677ff]' : 'text-gray-600'
            }`}
          >
            Claimed
            {activeTab === 'claimed' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#1677ff]" />
            )}
          </button>
          {selectedInbox !== 'livechat' && (
            <button
              onClick={() => setActiveTab('marketing')}
              className={`pb-2 text-sm relative ${
                activeTab === 'marketing' ? 'text-[#1677ff]' : 'text-gray-600'
              }`}
            >
              Marketing
              {activeTab === 'marketing' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#1677ff]" />
              )}
            </button>
          )}
          <button className="ml-auto p-1">
            <Search className="w-4 h-4 text-gray-400" />
          </button>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto">
          {filteredConversations.map((conversation) => (
            <div
              key={conversation.id}
              className={`px-4 py-3 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
                selectedConversation === conversation.id ? 'bg-blue-50' : ''
              }`}
              onClick={() => setSelectedConversation(conversation.id)}
            >
              <div className="flex items-start gap-2">
                {conversation.source === 'whatsapp' ? <WhatsAppIcon /> : <LiveChatIcon />}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1 mb-1">
                    <span className={`text-sm truncate ${conversation.hasBoldName ? 'font-semibold' : ''}`}>
                      {conversation.name}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 line-clamp-1">
                    {conversation.lastMessage}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1 flex-shrink-0 ml-2">
                  <div className="flex items-center gap-1">
                    {(conversation as any).hasCheck && (
                      <svg className="w-3 h-3 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                    <span className="text-xs text-gray-400">{conversation.time}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {conversation.hasAlert && conversation.unreadCount > 0 && (
                      <Badge className="bg-[#ff4d4f] hover:bg-[#ff4d4f] text-white text-xs px-1.5 h-5 rounded-full">
                        {conversation.unreadCount}
                      </Badge>
                    )}
                    {!conversation.isClaimed && (
                      <Badge className="bg-[#389e0d] hover:bg-[#389e0d] text-white text-xs px-2 h-5">
                        Claim
                      </Badge>
                    )}
                    <button className="p-0.5">
                      <MoreVertical className="w-3.5 h-3.5 text-gray-400" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        {activeConversation && (
          <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between bg-white">
            <TooltipProvider>
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  {activeConversation.source === 'livechat' ? (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="font-semibold text-sm cursor-help">{activeConversation.name}</span>
                      </TooltipTrigger>
                      <TooltipContent className="whitespace-pre-line">
                        {getCustomerInfo(activeConversation)}
                      </TooltipContent>
                    </Tooltip>
                  ) : (
                    <span className="font-semibold text-sm">{activeConversation.name}</span>
                  )}
                  {activeConversation.source === 'livechat' ? (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button 
                          className="p-1 hover:bg-gray-100 rounded"
                          onClick={() => handleCopyCustomerInfo(activeConversation)}
                        >
                          <Copy className="w-3.5 h-3.5 text-gray-400" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent className="whitespace-pre-line">
                        {getCustomerInfo(activeConversation)}
                      </TooltipContent>
                    </Tooltip>
                  ) : (
                    <button className="p-1 hover:bg-gray-100 rounded">
                      <Copy className="w-3.5 h-3.5 text-gray-400" />
                    </button>
                  )}
                </div>
                {activeConversation.source === 'livechat' && activeConversation.chatWidgetName ? (
                  <span className="text-xs text-gray-500">Chat Widget: {activeConversation.chatWidgetName}</span>
                ) : (
                  <span className="text-xs text-gray-500">Sender: 96279508736</span>
                )}
              </div>
            </TooltipProvider>

            <div className="flex items-center gap-2">
              <Button className="bg-[#ff4d4f] hover:bg-[#ff4d4f]/90 text-white px-4 h-8 text-sm">
                Close
              </Button>
              <button className="p-1 hover:bg-gray-100 rounded">
                <MoreVertical className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        )}

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
          <div className="max-w-full space-y-3">
            {MOCK_MESSAGES.map((message) => (
              <div key={message.id} className={`flex ${message.isSent ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[60%] ${message.isSent ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
                  {message.isFile ? (
                    <div className="bg-white border border-gray-200 rounded-lg p-3 flex items-center gap-3">
                      <div className="w-8 h-8 flex items-center justify-center">
                        {message.fileIcon === 'image' && (
                          <div className="w-8 h-8 bg-orange-500 rounded flex items-center justify-center">
                            <ImageIcon className="w-5 h-5 text-white" />
                          </div>
                        )}
                        {message.fileIcon === 'csv' && (
                          <div className="w-8 h-8 bg-green-600 rounded flex items-center justify-center">
                            <FileText className="w-5 h-5 text-white" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate">{message.fileName}</p>
                        <p className="text-xs text-gray-400">{message.fileSize} . {message.fileType}</p>
                      </div>
                    </div>
                  ) : (
                    <div
                      className={`rounded-lg px-4 py-2 ${
                        message.isSent
                          ? 'bg-[#e6f7ff] text-gray-900'
                          : 'bg-white text-gray-900 border border-gray-200'
                      }`}
                    >
                      <p className="text-sm">{message.text}</p>
                    </div>
                  )}
                  <div className={`flex items-center gap-1 text-xs text-gray-400 px-2 ${message.isSent ? 'justify-end' : 'justify-start'}`}>
                    <span>{message.time}</span>
                    {message.hasCheck && message.isSent && (
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Message Input Area */}
        <div className="border-t border-gray-200 bg-white p-4">
          <div className="max-w-full">
            <div className="flex items-center gap-2 mb-2">
              <button className="p-2 hover:bg-gray-100 rounded">
                <Paperclip className="w-5 h-5 text-gray-400" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded">
                <Smile className="w-5 h-5 text-gray-400" />
              </button>
              <Input
                placeholder="Type your message here"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                className="flex-1 bg-gray-50 text-[rgb(0,0,0)] text-[14px]"
              />
            </div>
            <div className="text-xs text-gray-400 text-center">
              Press Shift + Enter to insert a line break
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}