import { LiveChatWidgetTable } from './LiveChatWidgetTable';
import { AutoRepliesTable } from './AutoRepliesTable';

interface MessagingContentProps {
  activeTab: string;
}

export function MessagingContent({ activeTab }: MessagingContentProps) {
  if (activeTab === 'live-chat-widget') {
    return <LiveChatWidgetTable />;
  }

  if (activeTab === 'auto-replies') {
    return <AutoRepliesTable />;
  }

  return (
    <div className="p-8">
      <h1>WhatsApp Templates</h1>
      <p className="text-gray-600">Manage your WhatsApp message templates.</p>
    </div>
  );
}
