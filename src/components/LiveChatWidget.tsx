import { useState, useEffect } from 'react';
import { X, MessageCircle, Send, Minimize2 } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';

interface LiveChatWidgetProps {
  widgetId: string;
  language?: string;
  config?: {
    name?: string;
    title?: string;
    welcomeHeading?: string;
    welcomeTagline?: string;
    color?: string;
    position?: 'bottom-left' | 'bottom-right';
    displayPicture?: string;
    preChatFormEnabled?: boolean;
    preChatFormFields?: string[];
  };
}

export function LiveChatWidget({ widgetId, language = 'english', config }: LiveChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [showPreChat, setShowPreChat] = useState(
    config?.preChatFormEnabled && (config?.preChatFormFields?.length ?? 0) > 0
  );
  const [messages, setMessages] = useState<Array<{ text: string; sender: 'user' | 'agent' }>>([]);
  const [inputValue, setInputValue] = useState('');
  const [preChatData, setPreChatData] = useState<Record<string, string>>({});

  const widgetColor = config?.color || '#8B5CF6';
  const position = config?.position || 'bottom-right';
  const positionClass = position === 'bottom-left' ? 'left-4' : 'right-4';

  useEffect(() => {
    if (isOpen && !showPreChat && messages.length === 0) {
      setMessages([
        {
          text: config?.welcomeTagline || 'How can we help you today?',
          sender: 'agent',
        },
      ]);
    }
  }, [isOpen, showPreChat, messages.length, config?.welcomeTagline]);

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    setMessages([...messages, { text: inputValue, sender: 'user' }]);
    setInputValue('');

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { text: 'Thank you for your message. An agent will be with you shortly.', sender: 'agent' },
      ]);
    }, 1000);
  };

  const handlePreChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowPreChat(false);
  };

  const handlePreChatChange = (field: string, value: string) => {
    setPreChatData({ ...preChatData, [field]: value });
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-4 ${positionClass} z-50 w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-transform hover:scale-110`}
        style={{ backgroundColor: widgetColor }}
        aria-label="Open chat"
      >
        <MessageCircle className="w-6 h-6 text-white" />
      </button>
    );
  }

  return (
    <div
      className={`fixed bottom-4 ${positionClass} z-50 w-[380px] h-[600px] bg-white rounded-lg shadow-2xl flex flex-col overflow-hidden ${
        isMinimized ? 'h-16' : 'h-[600px]'
      } transition-all duration-300`}
    >
      <div
        className="p-4 text-white flex items-center justify-between"
        style={{ backgroundColor: widgetColor }}
      >
        <div className="flex items-center gap-3">
          {config?.displayPicture ? (
            <img
              src={config.displayPicture}
              alt="Agent"
              className="w-10 h-10 rounded-full border-2 border-white"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-white bg-opacity-30 flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-white" />
            </div>
          )}
          <div>
            <h3 className="font-semibold">{config?.title || 'Live Chat'}</h3>
            <p className="text-xs opacity-90">Online</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMinimized(!isMinimized)}
            className="h-8 w-8 hover:bg-white hover:bg-opacity-20 text-white"
          >
            <Minimize2 className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(false)}
            className="h-8 w-8 hover:bg-white hover:bg-opacity-20 text-white"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {showPreChat ? (
            <form onSubmit={handlePreChatSubmit} className="flex-1 overflow-y-auto p-6">
              <div className="mb-4">
                <h4 className="text-lg font-semibold mb-2">
                  {config?.welcomeHeading || 'Hello! 👋'}
                </h4>
                <p className="text-sm text-gray-600">
                  Please fill in the form below to start chatting with us.
                </p>
              </div>
              <div className="space-y-4">
                {config?.preChatFormFields?.map((field) => (
                  <div key={field}>
                    <Label htmlFor={field} className="capitalize">
                      {field}
                    </Label>
                    <Input
                      id={field}
                      value={preChatData[field] || ''}
                      onChange={(e) => handlePreChatChange(field, e.target.value)}
                      required
                      className="mt-1"
                    />
                  </div>
                ))}
              </div>
              <Button
                type="submit"
                className="w-full mt-6"
                style={{ backgroundColor: widgetColor }}
              >
                Start Chat
              </Button>
            </form>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[75%] rounded-lg px-4 py-2 ${
                        message.sender === 'user'
                          ? 'text-white'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                      style={{
                        backgroundColor: message.sender === 'user' ? widgetColor : undefined,
                      }}
                    >
                      <p className="text-sm">{message.text}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 p-4">
                <div className="flex gap-2">
                  <Textarea
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    placeholder="Type your message..."
                    className="resize-none min-h-[44px] max-h-[120px]"
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!inputValue.trim()}
                    size="icon"
                    className="flex-shrink-0"
                    style={{ backgroundColor: widgetColor }}
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}
