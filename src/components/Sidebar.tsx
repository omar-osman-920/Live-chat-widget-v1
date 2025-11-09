import { ChevronDown, ChevronRight, Settings, User, Smartphone, Building2, UserCog, Clock, CreditCard, MessageSquare, Boxes, Hash, Key, BookOpen, Bell } from 'lucide-react';
import { useState } from 'react';

interface SidebarProps {
  activeSection: string;
  activeSubSection: string;
  onSectionChange: (section: string) => void;
  onSubSectionChange: (subSection: string) => void;
}

export function Sidebar({ activeSection, activeSubSection, onSectionChange, onSubSectionChange }: SidebarProps) {
  const [expandedSections, setExpandedSections] = useState<string[]>(['account-settings', 'messaging']);

  const toggleSection = (section: string) => {
    if (expandedSections.includes(section)) {
      setExpandedSections(expandedSections.filter(s => s !== section));
    } else {
      setExpandedSections([...expandedSections, section]);
    }
  };

  const sections = [
    {
      id: 'user-settings',
      icon: User,
      label: 'User Settings',
      items: [
        { id: 'general', label: 'General' },
        { id: 'mobile-app', label: 'Mobile App' },
      ],
    },
    {
      id: 'account-settings',
      icon: Settings,
      label: 'Account Settings',
      items: [
        { id: 'general', label: 'General' },
        { id: 'user-roles', label: 'User Roles' },
        { id: 'working-hours', label: 'Working Hours' },
        { id: 'billing', label: 'Billing' },
      ],
    },
    {
      id: 'messaging',
      icon: MessageSquare,
      label: 'Messaging',
      items: [
        { id: 'whatsapp-templates', label: 'WhatsApp Templates' },
        { id: 'auto-replies', label: 'Auto-Replies' },
        { id: 'live-chat-widget', label: 'Live Chat Widget' },
      ],
    },
    {
      id: 'integrations',
      icon: Boxes,
      label: 'Integrations',
      items: [],
    },
    {
      id: 'numbers',
      icon: Hash,
      label: 'Numbers',
      items: [],
    },
    {
      id: 'api-credentials',
      icon: Key,
      label: 'API Credentials',
      items: [],
    },
    {
      id: 'knowledge-hub',
      icon: BookOpen,
      label: 'Knowledge Hub',
      items: [],
    },
    {
      id: 'keyword-alerts',
      icon: Bell,
      label: 'Keyword Alerts',
      items: [],
    },
  ];

  return (
    <div className="w-64 bg-white border-r border-gray-200 overflow-y-auto">
      <div className="p-4">
        {sections.map((section) => (
          <div key={section.id} className="mb-1">
            <button
              onClick={() => {
                if (section.items.length > 0) {
                  toggleSection(section.id);
                }
                onSectionChange(section.id);
              }}
              className="flex items-center justify-between w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded"
            >
              <div className="flex items-center gap-2">
                <section.icon className="w-4 h-4" />
                <span>{section.label}</span>
              </div>
              {section.items.length > 0 && (
                expandedSections.includes(section.id) ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )
              )}
            </button>
            {expandedSections.includes(section.id) && section.items.length > 0 && (
              <div className="ml-6 mt-1">
                {section.items.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      onSectionChange(section.id);
                      onSubSectionChange(item.id);
                    }}
                    className={`block w-full text-left px-3 py-2 text-sm rounded ${
                      activeSubSection === item.id && activeSection === section.id
                        ? 'text-blue-600 bg-blue-50'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
