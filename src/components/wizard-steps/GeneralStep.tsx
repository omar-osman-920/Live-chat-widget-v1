import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';
import { Textarea } from '../ui/textarea';
import { Checkbox } from '../ui/checkbox';
import { ChatWidgetFormData } from '../ChatWidgetWizard';
import { Badge } from '../ui/badge';
import { Card } from '../ui/card';
import { X, HelpCircle } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { LiveChatPreview } from '../LiveChatPreview';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../ui/tooltip';

interface GeneralStepProps {
  formData: ChatWidgetFormData;
  updateFormData: (data: Partial<ChatWidgetFormData>) => void;
}

const AVAILABLE_LANGUAGES = [
  'English',
  'Arabic',
  'Spanish',
  'French',
  'German',
  'Italian',
  'Portuguese',
  'Russian',
  'Chinese',
  'Japanese',
];

const PRE_CHAT_FIELDS = [
  { id: 'name', label: 'Name' },
  { id: 'email', label: 'Email' },
  { id: 'phone', label: 'Phone Number' },
];

// Language-specific placeholders
const TITLE_PLACEHOLDERS: { [key: string]: string } = {
  'English': 'Live Chat',
  'Arabic': 'محادثة مباشرة',
  'Spanish': 'Chat en vivo',
  'French': 'Chat en direct',
  'German': 'Live-Chat',
  'Italian': 'Chat dal vivo',
  'Portuguese': 'Chat ao vivo',
  'Russian': 'Онлайн-чат',
  'Chinese': '在线聊天',
  'Japanese': 'ライブチャット',
};

export function GeneralStep({ formData, updateFormData }: GeneralStepProps) {
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [selectedLanguageTab, setSelectedLanguageTab] = useState('English');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowLanguageDropdown(false);
      }
    };

    if (showLanguageDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showLanguageDropdown]);

  const toggleLanguage = (language: string) => {
    const languages = formData.supportedLanguages.includes(language)
      ? formData.supportedLanguages.filter((l) => l !== language)
      : [...formData.supportedLanguages, language];
    
    // Update languages
    updateFormData({ supportedLanguages: languages });
    
    // Initialize title, welcomeHeading, welcomeTagline, and working hours messages for new languages
    if (!formData.supportedLanguages.includes(language)) {
      updateFormData({
        title: { ...formData.title, [language]: '' },
        welcomeHeading: { ...formData.welcomeHeading, [language]: '' },
        welcomeTagline: { ...formData.welcomeTagline, [language]: '' },
        duringWorkingHoursMessage: { ...formData.duringWorkingHoursMessage, [language]: '' },
        afterWorkingHoursMessage: { ...formData.afterWorkingHoursMessage, [language]: '' },
      });
    }
  };

  const updateTitle = (language: string, value: string) => {
    updateFormData({
      title: { ...formData.title, [language]: value },
    });
  };

  const togglePreChatField = (fieldId: string) => {
    const fields = formData.preChatFormFields.includes(fieldId)
      ? formData.preChatFormFields.filter((f) => f !== fieldId)
      : [...formData.preChatFormFields, fieldId];
    updateFormData({ preChatFormFields: fields });
  };

  // Get all languages to show (English always + selected languages)
  const languagesToShow = ['English', ...formData.supportedLanguages.filter(l => l !== 'English')];

  return (
    <div className="flex-1 flex">
      {/* Left Side - Configuration */}
      <div className="flex-1 px-8 py-6 overflow-y-auto">
        <div className="max-w-xl space-y-6">
        {/* Chat Widget Name */}
        <div className="space-y-2">
          <Label htmlFor="widgetName">Chat Widget Name</Label>
          <Input
            id="widgetName"
            placeholder="e.g., Main Support Widget"
            value={formData.name}
            onChange={(e) => updateFormData({ name: e.target.value })}
          />
        </div>

        {/* Supported Languages */}
        <div className="space-y-2">
          <Label>Supported Languages</Label>
          <div className="relative" ref={dropdownRef}>
            <div
              className="min-h-[40px] border border-gray-300 rounded-md p-2 cursor-pointer"
              onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
            >
              <div className="flex flex-wrap gap-1">
                {formData.supportedLanguages.length > 0 ? (
                  formData.supportedLanguages.map((lang) => (
                    <Badge key={lang} variant="secondary" className="gap-1">
                      {lang}
                      <X
                        className="w-3 h-3 cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleLanguage(lang);
                        }}
                      />
                    </Badge>
                  ))
                ) : (
                  <span className="text-gray-500 text-sm">Select languages...</span>
                )}
              </div>
            </div>
            {showLanguageDropdown && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                {AVAILABLE_LANGUAGES.map((language) => (
                  <div
                    key={language}
                    className="px-3 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2"
                    onClick={() => toggleLanguage(language)}
                  >
                    <Checkbox checked={formData.supportedLanguages.includes(language)} />
                    <span className="text-sm">{language}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Chat Widget Title */}
        <div className="space-y-3">
          <Label>Chat Widget Title</Label>
          <p className="text-xs text-gray-500">
            This title will be displayed in the chat widget header
          </p>
          <Card className="p-4">
            <Tabs defaultValue={languagesToShow[0]} className="w-full" onValueChange={(value) => setSelectedLanguageTab(value)}>
              <TabsList>
                {languagesToShow.map((language) => (
                  <TabsTrigger key={language} value={language}>
                    {language}
                  </TabsTrigger>
                ))}
              </TabsList>
              {languagesToShow.map((language) => (
                <TabsContent key={language} value={language} className="mt-4">
                  <Input
                    id={`widgetTitle-${language}`}
                    placeholder={TITLE_PLACEHOLDERS[language] || 'Live Chat'}
                    value={formData.title[language] || ''}
                    onChange={(e) => updateTitle(language, e.target.value)}
                  />
                </TabsContent>
              ))}
            </Tabs>
          </Card>
        </div>

        {/* Show Widget Status */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Label htmlFor="showStatus">Show Widget Status</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <HelpCircle className="w-4 h-4 text-gray-400" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Online and offline status are according to the working hours configurations in the Welcome Message step</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Display online/offline status indicator in the widget header
            </p>
          </div>
          <Switch
            id="showStatus"
            checked={formData.showStatus}
            onCheckedChange={(checked) => updateFormData({ showStatus: checked })}
          />
        </div>

        {/* Auto-Close Timeout */}
        <div className="space-y-2">
          <Label htmlFor="timeout">Conversation Auto-Close Timeout</Label>
          <p className="text-xs text-gray-500 mb-2">
            Automatically close conversations after inactivity from the end-user
          </p>
          <div className="flex gap-2">
            <Input
              id="timeout"
              type="number"
              min="1"
              placeholder="5"
              className="flex-1"
              value={formData.timeoutValue}
              onChange={(e) => updateFormData({ timeoutValue: parseInt(e.target.value) || 0 })}
            />
            <Select
              value={formData.timeoutUnit}
              onValueChange={(value: 'seconds' | 'minutes' | 'hours') => updateFormData({ timeoutUnit: value })}
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="seconds">Seconds</SelectItem>
                <SelectItem value="minutes">Minutes</SelectItem>
                <SelectItem value="hours">Hours</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Pre-chat Form */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="preChatForm">Pre-chat Form</Label>
              <p className="text-xs text-gray-500 mt-1">
                Collect information before starting a chat
              </p>
            </div>
            <Switch
              id="preChatForm"
              checked={formData.preChatFormEnabled}
              onCheckedChange={(checked) => updateFormData({ preChatFormEnabled: checked })}
            />
          </div>

          {formData.preChatFormEnabled && (
            <div className="pl-4 space-y-3 border-l-2 border-gray-200">
              <Label className="text-sm">Form Fields</Label>
              {PRE_CHAT_FIELDS.map((field) => (
                <div key={field.id} className="flex items-center gap-2">
                  <Checkbox
                    id={field.id}
                    checked={formData.preChatFormFields.includes(field.id)}
                    onCheckedChange={() => togglePreChatField(field.id)}
                  />
                  <Label htmlFor={field.id} className="cursor-pointer">
                    {field.label}
                  </Label>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Privacy Policy */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="privacyPolicy">Privacy Policy & Terms</Label>
              <p className="text-xs text-gray-500 mt-1">
                Display privacy policy and terms of use links
              </p>
            </div>
            <Switch
              id="privacyPolicy"
              checked={formData.privacyPolicyEnabled}
              onCheckedChange={(checked) => updateFormData({ privacyPolicyEnabled: checked })}
            />
          </div>

          {formData.privacyPolicyEnabled && (
            <div className="pl-4 space-y-3 border-l-2 border-gray-200">
              <div className="space-y-2">
                <Label htmlFor="privacyPolicyUrl">Privacy Policy URL</Label>
                <Input
                  id="privacyPolicyUrl"
                  type="url"
                  placeholder="https://example.com/privacy-policy"
                  value={formData.privacyPolicyUrl}
                  onChange={(e) => updateFormData({ privacyPolicyUrl: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="termsOfUseUrl">Terms of Use URL</Label>
                <Input
                  id="termsOfUseUrl"
                  type="url"
                  placeholder="https://example.com/terms-of-use"
                  value={formData.termsOfUseUrl}
                  onChange={(e) => updateFormData({ termsOfUseUrl: e.target.value })}
                />
              </div>
            </div>
          )}
        </div>
        </div>
      </div>

      {/* Right Side - Live Preview */}
      <div className="w-[420px] bg-gray-100 border-l border-gray-200 p-[24px]">
        <LiveChatPreview formData={formData} selectedLanguage={selectedLanguageTab} />
      </div>
    </div>
  );
}