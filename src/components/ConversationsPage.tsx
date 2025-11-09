import { Filter, Download, AlertCircle, Check, MoreVertical } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

interface ConversationLog {
  id: string;
  agents: { name: string; color: string }[];
  createdAt: string;
  number: string;
  recipient: string;
  lastActivity: string;
  recentMessage: string;
  state: 'unclaimed' | 'claimed' | 'closed';
}

interface LiveChatLog {
  id: string;
  agents: { name: string; color: string; isMe?: boolean }[];
  createdAt: string;
  widgetName: string;
  name?: string;
  email?: string;
  phoneNumber?: string;
  lastActivity: string;
  recentMessage: string;
  state: 'unclaimed' | 'claimed' | 'closed';
}

const MOCK_CONVERSATION_LOGS: ConversationLog[] = [
  {
    id: '74691',
    agents: [{ name: 'A', color: 'bg-orange-500' }],
    createdAt: 'Nov 05, 2025',
    number: '+96282220834',
    recipient: '+201019568797',
    lastActivity: 'Nov 05, 2025',
    recentMessage: 'Hey',
    state: 'unclaimed',
  },
  {
    id: 'bjbbe7',
    agents: [
      { name: 'A', color: 'bg-gray-700' },
      { name: 'B', color: 'bg-yellow-500' },
    ],
    createdAt: 'Oct 02, 2025',
    number: '+96282220834',
    recipient: '+962778197817',
    lastActivity: 'Oct 23, 2025',
    recentMessage: 'السلام عليكم ورحمة الل وبركاته كيف بساعدك اليوم',
    state: 'closed',
  },
  {
    id: '5618p',
    agents: [{ name: 'A', color: 'bg-orange-400' }],
    createdAt: 'Oct 02, 2025',
    number: '+96282220834',
    recipient: '+971117575441',
    lastActivity: 'Oct 12, 2025',
    recentMessage: 'Hi',
    state: 'claimed',
  },
  {
    id: '5623f',
    agents: [{ name: 'B', color: 'bg-yellow-500' }],
    createdAt: 'Sep 26, 2025',
    number: '+96282220834',
    recipient: '+962770988924',
    lastActivity: 'Sep 28, 2025',
    recentMessage: '',
    state: 'unclaimed',
  },
  {
    id: '54710',
    agents: [
      { name: 'A', color: 'bg-green-500' },
      { name: 'B', color: 'bg-gray-700' },
    ],
    createdAt: 'Sep 26, 2025',
    number: '+96282220834',
    recipient: '+962779286842',
    lastActivity: 'Oct 02, 2025',
    recentMessage: '',
    state: 'closed',
  },
  {
    id: '4278d',
    agents: [{ name: 'C', color: 'bg-red-500' }],
    createdAt: 'Sep 19, 2025',
    number: '+96282220834',
    recipient: '+962777148555',
    lastActivity: 'Sep 19, 2025',
    recentMessage: 'fizz',
    state: 'closed',
  },
  {
    id: '998bb',
    agents: [{ name: 'D', color: 'bg-green-500' }],
    createdAt: 'Sep 15, 2025',
    number: '+96282220834',
    recipient: '+962788338625',
    lastActivity: 'Oct 12, 2025',
    recentMessage: 'Welcome to Maqsam!',
    state: 'claimed',
  },
  {
    id: 'Q8E13',
    agents: [
      { name: 'A', color: 'bg-red-500' },
      { name: 'B', color: 'bg-green-500' },
      { name: 'C', color: 'bg-gray-400' },
    ],
    createdAt: 'Sep 10, 2025',
    number: '+96282220834',
    recipient: '+962791733169',
    lastActivity: 'Oct 23, 2025',
    recentMessage: 'تست',
    state: 'closed',
  },
  {
    id: '41akla',
    agents: [{ name: 'E', color: 'bg-green-500' }],
    createdAt: 'Aug 28, 2025',
    number: '+96282220834',
    recipient: '+962798279138',
    lastActivity: 'Oct 12, 2025',
    recentMessage: 'اشكرا لاتصالك وتفضيلك لنا ضيتا اهلا وسهلا بك مدير منى تحدث الجيمة الاستاذ هاني مرحبا بك نريد ان نستفيد من خدمتكم المجانية',
    state: 'unclaimed',
  },
  {
    id: 'dk055',
    agents: [{ name: 'F', color: 'bg-green-500' }],
    createdAt: 'Aug 26, 2025',
    number: '+96282220834',
    recipient: '+962770356475',
    lastActivity: 'Oct 12, 2025',
    recentMessage: '',
    state: 'claimed',
  },
];

const MOCK_LIVECHAT_LOGS: LiveChatLog[] = [
  {
    id: '12345',
    agents: [{ name: 'G', color: 'bg-purple-500', isMe: false }],
    createdAt: 'Nov 06, 2025',
    widgetName: 'Widget 1',
    name: 'Hisham Alshabaan',
    email: 'hisham.alshabaan@example.com',
    phoneNumber: '+966501234567',
    lastActivity: 'Nov 06, 2025',
    recentMessage: 'Thank you for your help!',
    state: 'closed',
  },
  {
    id: '67890',
    agents: [
      { name: 'A', color: 'bg-blue-500', isMe: true },
      { name: 'B', color: 'bg-green-500', isMe: false },
    ],
    createdAt: 'Nov 05, 2025',
    widgetName: 'Widget 2',
    name: 'Sarah Johnson',
    email: 'sarah.j@example.com',
    lastActivity: 'Nov 05, 2025',
    recentMessage: 'Can you tell me more about your pricing?',
    state: 'claimed',
  },
  {
    id: '54321',
    agents: [{ name: 'C', color: 'bg-orange-500', isMe: false }],
    createdAt: 'Nov 04, 2025',
    widgetName: 'Widget 3',
    phoneNumber: '+966508888888',
    lastActivity: 'Nov 04, 2025',
    recentMessage: 'I need help with my order',
    state: 'unclaimed',
  },
  {
    id: '98765',
    agents: [{ name: 'D', color: 'bg-red-500', isMe: false }],
    createdAt: 'Nov 03, 2025',
    widgetName: 'Widget 4',
    name: 'Ahmed Ayman',
    email: 'ahmed.ayman@example.com',
    phoneNumber: '+966507777777',
    lastActivity: 'Nov 04, 2025',
    recentMessage: 'Hello, I have a question',
    state: 'closed',
  },
  {
    id: '11223',
    agents: [{ name: 'E', color: 'bg-yellow-500', isMe: false }],
    createdAt: 'Nov 02, 2025',
    widgetName: 'Widget 5',
    email: 'customer@example.com',
    lastActivity: 'Nov 03, 2025',
    recentMessage: 'When will my package arrive?',
    state: 'claimed',
  },
  {
    id: '44556',
    agents: [
      { name: 'F', color: 'bg-green-500', isMe: false },
      { name: 'G', color: 'bg-purple-500', isMe: false },
    ],
    createdAt: 'Nov 01, 2025',
    widgetName: 'Widget 6',
    name: 'Michael Chen',
    phoneNumber: '+966509999999',
    lastActivity: 'Nov 02, 2025',
    recentMessage: 'مرحبا، كيف يمكنني المساعدة؟',
    state: 'closed',
  },
  {
    id: '77889',
    agents: [{ name: 'A', color: 'bg-blue-500', isMe: false }],
    createdAt: 'Oct 31, 2025',
    widgetName: 'Widget 7',
    lastActivity: 'Nov 01, 2025',
    recentMessage: 'I have a question about delivery',
    state: 'unclaimed',
  },
  {
    id: '99001',
    agents: [{ name: 'B', color: 'bg-green-500', isMe: true }],
    createdAt: 'Oct 30, 2025',
    widgetName: 'Widget 8',
    name: 'Fatima Al-Rashid',
    email: 'fatima@example.com',
    phoneNumber: '+966501112222',
    lastActivity: 'Oct 31, 2025',
    recentMessage: 'شكراً جزيلاً',
    state: 'claimed',
  },
];

export function ConversationsPage() {
  const [activeTab, setActiveTab] = useState<'livechat' | 'conversations' | 'marketing'>('livechat');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const totalItems = activeTab === 'livechat' ? MOCK_LIVECHAT_LOGS.length : MOCK_CONVERSATION_LOGS.length;
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="h-full bg-white flex flex-col">
      {/* Header */}
      <div className="px-6 py-6 border-b border-gray-200">
        <h1 className="text-2xl mb-2">Conversations</h1>
        <p className="text-sm text-gray-600">
          Manage conversations and improve response time by using saved templates.{' '}
          <a href="#" className="text-blue-500 hover:underline">
            Create a new template.
          </a>
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center justify-between px-6 bg-gray-50">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setActiveTab('livechat')}
            className={`px-5 py-4 text-sm rounded-t-lg ${
              activeTab === 'livechat' ? 'text-blue-500 bg-white' : 'text-gray-900 bg-transparent'
            }`}
          >
            Live Chat
          </button>
          <button
            onClick={() => setActiveTab('conversations')}
            className={`px-5 py-4 text-sm rounded-t-lg ${
              activeTab === 'conversations' ? 'text-blue-500 bg-white' : 'text-gray-900 bg-transparent'
            }`}
          >
            Conversations
          </button>
          <button
            onClick={() => setActiveTab('marketing')}
            className={`px-5 py-4 text-sm rounded-t-lg ${
              activeTab === 'marketing' ? 'text-blue-500 bg-white' : 'text-gray-900 bg-transparent'
            }`}
          >
            Marketing
          </button>
        </div>
        <div className="flex items-center gap-2 py-2">
          <Button variant="outline" size="sm" className="gap-2">
            <Filter className="w-4 h-4" />
            Filter
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="w-4 h-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto px-6 py-[0px] px-[24px]">
        <table className="w-full">
          <thead className="border-b border-gray-200 sticky top-0 bg-white">
            <tr>
              <th className="text-left py-3 px-2 text-sm text-gray-600">ID</th>
              <th className="text-left py-3 px-2 text-sm text-gray-600">Agents</th>
              <th className="text-left py-3 px-2 text-sm text-gray-600">Created at</th>
              {activeTab === 'livechat' ? (
                <>
                  <th className="text-left py-3 px-2 text-sm text-gray-600">Widget Name</th>
                  <th className="text-left py-3 px-2 text-sm text-gray-600">Name</th>
                  <th className="text-left py-3 px-2 text-sm text-gray-600">Email</th>
                  <th className="text-left py-3 px-2 text-sm text-gray-600">Phone Number</th>
                </>
              ) : (
                <>
                  <th className="text-left py-3 px-2 text-sm text-gray-600">Number</th>
                  <th className="text-left py-3 px-2 text-sm text-gray-600">Recipient</th>
                </>
              )}
              <th className="text-left py-3 px-2 text-sm text-gray-600">Last Activity</th>
              <th className="text-left py-3 px-2 text-sm text-gray-600">Recent Message</th>
              <th className="text-left py-3 px-2 text-sm text-gray-600">State</th>
              {activeTab === 'livechat' && (
                <th className="text-left py-3 px-2 text-sm text-gray-600 w-[50px]">Actions</th>
              )}
            </tr>
          </thead>
          <tbody>
            {activeTab === 'livechat'
              ? MOCK_LIVECHAT_LOGS.map((log) => (
                  <tr key={log.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-2">
                      <a href="#" className="text-sm text-blue-500 hover:underline">
                        {log.id}
                      </a>
                    </td>
                    <td className="py-3 px-2">
                      <div className="flex items-center -space-x-2">
                        {log.agents.map((agent, index) => (
                          <div
                            key={index}
                            className={`w-6 h-6 rounded-full ${agent.color} flex items-center justify-center text-white text-xs border-2 border-white`}
                          >
                            {agent.name}
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="py-3 px-2 text-sm text-gray-900">{log.createdAt}</td>
                    <td className="py-3 px-2 text-sm text-gray-900">{log.widgetName}</td>
                    <td className="py-3 px-2 text-sm text-gray-900">{log.name || '-'}</td>
                    <td className="py-3 px-2 text-sm text-gray-900">{log.email || '-'}</td>
                    <td className="py-3 px-2 text-sm text-gray-900">{log.phoneNumber || '-'}</td>
                    <td className="py-3 px-2 text-sm text-gray-900">{log.lastActivity}</td>
                    <td className="py-3 px-2">
                      <span className="text-sm text-gray-900 line-clamp-1 max-w-xs">
                        {log.recentMessage}
                      </span>
                    </td>
                    <td className="py-3 px-2">
                      <Badge
                        className={
                          log.state === 'unclaimed'
                            ? 'bg-orange-100 text-orange-600 hover:bg-orange-100 gap-1'
                            : log.state === 'claimed'
                            ? 'bg-green-100 text-green-600 hover:bg-green-100 gap-1'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-100 gap-1'
                        }
                      >
                        {log.state === 'unclaimed' ? (
                          <>
                            <AlertCircle className="w-3 h-3" />
                            Unclaimed
                          </>
                        ) : log.state === 'claimed' ? (
                          <>
                            <Check className="w-3 h-3" />
                            Claimed
                          </>
                        ) : (
                          <>
                            <Check className="w-3 h-3" />
                            Closed
                          </>
                        )}
                      </Badge>
                    </td>
                    {activeTab === 'livechat' && (
                      <td className="py-3 px-2">
                        {log.state !== 'closed' && (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="w-8 h-8">
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-40">
                              {log.state === 'unclaimed' ? (
                                <>
                                  <DropdownMenuItem>Transfer</DropdownMenuItem>
                                </>
                              ) : log.state === 'claimed' ? (
                                log.agents.some((agent) => agent.isMe) ? (
                                  <>
                                    <DropdownMenuItem>Transfer</DropdownMenuItem>
                                    <DropdownMenuItem>Unclaim</DropdownMenuItem>
                                    <DropdownMenuItem>Close</DropdownMenuItem>
                                  </>
                                ) : (
                                  <>
                                    <DropdownMenuItem>Release</DropdownMenuItem>
                                    <DropdownMenuItem>Transfer</DropdownMenuItem>
                                  </>
                                )
                              ) : null}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}
                      </td>
                    )}
                  </tr>
                ))
              : MOCK_CONVERSATION_LOGS.map((log) => (
                  <tr key={log.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-2">
                      <a href="#" className="text-sm text-blue-500 hover:underline">
                        {log.id}
                      </a>
                    </td>
                    <td className="py-3 px-2">
                      <div className="flex items-center -space-x-2">
                        {log.agents.map((agent, index) => (
                          <div
                            key={index}
                            className={`w-6 h-6 rounded-full ${agent.color} flex items-center justify-center text-white text-xs border-2 border-white`}
                          >
                            {agent.name}
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="py-3 px-2 text-sm text-gray-900">{log.createdAt}</td>
                    <td className="py-3 px-2">
                      <div className="flex items-center gap-1">
                        <img
                          src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 16 16'%3E%3Crect width='16' height='11' y='2.5' fill='%23000' rx='1'/%3E%3Crect width='16' height='11' y='2.5' fill='%23D80027' rx='1'/%3E%3Crect width='16' height='5.5' y='2.5' fill='%23FFDA44' rx='1'/%3E%3C/svg%3E"
                          alt="flag"
                          className="w-4 h-3"
                        />
                        <span className="text-sm text-gray-900">{log.number}</span>
                      </div>
                    </td>
                    <td className="py-3 px-2">
                      <div className="flex items-center gap-1">
                        <img
                          src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 16 16'%3E%3Crect width='16' height='11' y='2.5' fill='%23000' rx='1'/%3E%3Crect width='16' height='5.5' y='2.5' fill='%23fff' rx='1'/%3E%3Crect width='16' height='5.5' y='8' fill='%23D80027' rx='1'/%3E%3Cpath fill='%23496E2D' d='M0 2.5h5.3v11H0z'/%3E%3C/svg%3E"
                          alt="flag"
                          className="w-4 h-3"
                        />
                        <span className="text-sm text-gray-900">{log.recipient}</span>
                      </div>
                    </td>
                    <td className="py-3 px-2 text-sm text-gray-900">{log.lastActivity}</td>
                    <td className="py-3 px-2">
                      <span className="text-sm text-gray-900 line-clamp-1 max-w-xs">
                        {log.recentMessage}
                      </span>
                    </td>
                    <td className="py-3 px-2">
                      <Badge
                        className={
                          log.state === 'unclaimed'
                            ? 'bg-orange-100 text-orange-600 hover:bg-orange-100 gap-1'
                            : log.state === 'claimed'
                            ? 'bg-green-100 text-green-600 hover:bg-green-100 gap-1'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-100 gap-1'
                        }
                      >
                        {log.state === 'unclaimed' ? (
                          <>
                            <AlertCircle className="w-3 h-3" />
                            Unclaimed
                          </>
                        ) : log.state === 'claimed' ? (
                          <>
                            <Check className="w-3 h-3" />
                            Claimed
                          </>
                        ) : (
                          <>
                            <Check className="w-3 h-3" />
                            Closed
                          </>
                        )}
                      </Badge>
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
        <div className="text-sm text-gray-600">
          Showing {startItem}-{endItem} of {totalItems} items
        </div>
        <div className="flex items-center gap-2">
          <button className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50">
            1
          </button>
          <span className="text-sm text-gray-600">/ 10 / page</span>
        </div>
      </div>
    </div>
  );
}