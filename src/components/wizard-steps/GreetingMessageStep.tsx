import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';
import { ChatWidgetFormData } from '../ChatWidgetWizard';
import { useState } from 'react';
import { Copy, HelpCircle } from 'lucide-react';
import { LiveChatPreview } from '../LiveChatPreview';
import { Checkbox } from '../ui/checkbox';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Card } from '../ui/card';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../ui/tooltip';

interface GreetingMessageStepProps {
  formData: ChatWidgetFormData;
  updateFormData: (data: Partial<ChatWidgetFormData>) => void;
}

const DAYS = [
  { id: 'sun', label: 'Sun' },
  { id: 'mon', label: 'Mon' },
  { id: 'tue', label: 'Tue' },
  { id: 'wed', label: 'Wed' },
  { id: 'thu', label: 'Thu' },
  { id: 'fri', label: 'Fri' },
  { id: 'sat', label: 'Sat' },
];

// Language-specific placeholders for working hours messages
const DURING_HOURS_PLACEHOLDERS: { [key: string]: string } = {
  'English': 'You will be connected to one of our support team',
  'Arabic': 'مرحباً! كيف يمكننا مساعدتك اليوم؟',
  'Spanish': 'Serás conectado con uno de nuestro equipo de soporte',
  'French': 'Vous serez connecté à un membre de notre équipe d\'assistance',
  'German': 'Sie werden mit einem unserer Support-Mitarbeiter verbunden',
  'Italian': 'Sarai connesso con uno del nostro team di supporto',
  'Portuguese': 'Você será conectado a um membro da nossa equipe de suporte',
  'Russian': 'Вы будете соединены с одним из наших специалистов поддержки',
  'Chinese': '您将连接到我们的支持团队成员',
  'Japanese': 'サポートチームのメンバーにつながります',
};

const AFTER_HOURS_PLACEHOLDERS: { [key: string]: string } = {
  'English': 'Leave your message and one of our support team will reply to you',
  'Arabic': 'اترك رسالتك وسيرد عليك أحد أعضاء فريق الدعم لدينا',
  'Spanish': 'Deja tu mensaje y uno de nuestro equipo de soporte te responderá',
  'French': 'Laissez votre message et un membre de notre équipe vous répondra',
  'German': 'Hinterlassen Sie Ihre Nachricht und ein Mitarbeiter wird Ihnen antworten',
  'Italian': 'Lascia il tuo messaggio e un membro del nostro team ti risponderà',
  'Portuguese': 'Deixe sua mensagem e um membro da equipe responderá',
  'Russian': 'Оставьте сообщение и наш спецал��ст ответит вам',
  'Chinese': '留下您的消息，我们的支持团队将回复您',
  'Japanese': 'メッセージを残してください。サポートチームが返信します',
};

export function GreetingMessageStep({ formData, updateFormData }: GreetingMessageStepProps) {
  const [timezone, setTimezone] = useState('(GMT +4:00) Abu Dhabi, Muscat, Baku, Tbilisi');
  const [selectedLanguageTab, setSelectedLanguageTab] = useState('English');

  const updateDuringWorkingHoursMessage = (language: string, value: string) => {
    updateFormData({
      duringWorkingHoursMessage: { ...formData.duringWorkingHoursMessage, [language]: value },
    });
  };

  const updateAfterWorkingHoursMessage = (language: string, value: string) => {
    updateFormData({
      afterWorkingHoursMessage: { ...formData.afterWorkingHoursMessage, [language]: value },
    });
  };

  // Get all languages to show (English always + selected languages)
  const languagesToShow = ['English', ...formData.supportedLanguages.filter(l => l !== 'English')];

  const toggleDay = (dayId: string) => {
    const currentHours = formData.workingHours || {};
    updateFormData({
      workingHours: {
        ...currentHours,
        [dayId]: {
          ...currentHours[dayId],
          enabled: !currentHours[dayId]?.enabled,
        },
      },
    });
  };

  const updateSlot = (dayId: string, field: 'start' | 'end', value: string) => {
    const currentHours = formData.workingHours || {};
    const currentDay = currentHours[dayId] || { enabled: false, slots: [{ start: '09:00', end: '08:00' }] };
    updateFormData({
      workingHours: {
        ...currentHours,
        [dayId]: {
          ...currentDay,
          slots: [{ ...currentDay.slots[0], [field]: value }],
        },
      },
    });
  };

  const copyToAll = (dayId: string) => {
    const currentHours = formData.workingHours || {};
    const sourceSlots = currentHours[dayId]?.slots || [{ start: '09:00', end: '08:00' }];
    const newHours = { ...currentHours };
    DAYS.forEach((day) => {
      newHours[day.id] = {
        enabled: currentHours[day.id]?.enabled ?? false,
        slots: [...sourceSlots],
      };
    });
    updateFormData({ workingHours: newHours });
  };

  return (
    <div className="flex-1 flex">
      {/* Left Side - Configuration */}
      <div className="flex-1 px-8 py-6 overflow-y-auto">
        <div className="max-w-xl space-y-6">
          {/* Working Hours Messages */}
          <div className="space-y-3">
            <Label>Welcome Messages</Label>
            <p className="text-xs text-gray-500">
              Configure welocme messages for during and after business hours
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
                  <TabsContent key={language} value={language} className="mt-4 space-y-4">
                    {/* During Working Hours */}
                    <div className="space-y-2">
                      <Label htmlFor={`duringWorkingHours-${language}`}>During Working Hours (optional)</Label>
                      <Textarea
                        id={`duringWorkingHours-${language}`}
                        placeholder={DURING_HOURS_PLACEHOLDERS[language] || `Message (${language})`}
                        value={formData.duringWorkingHoursMessage[language] || ''}
                        onChange={(e) => updateDuringWorkingHoursMessage(language, e.target.value)}
                        rows={3}
                      />
                    </div>
                    
                    {/* After Working Hours */}
                    <div className="space-y-2">
                      <Label htmlFor={`afterWorkingHours-${language}`}>After Working Hours (optional)</Label>
                      <Textarea
                        id={`afterWorkingHours-${language}`}
                        placeholder={AFTER_HOURS_PLACEHOLDERS[language] || `Message (${language})`}
                        value={formData.afterWorkingHoursMessage[language] || ''}
                        onChange={(e) => updateAfterWorkingHoursMessage(language, e.target.value)}
                        rows={3}
                      />
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </Card>
          </div>

          {/* Working Hours */}
          <div className="space-y-4">
            <Label>Working Hours Configurations</Label>
            <div className="flex items-center gap-2">
              <Label>Time zone</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <HelpCircle className="w-4 h-4 text-gray-400" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Select your business timezone</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Select value={timezone} onValueChange={setTimezone}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="(GMT +4:00) Abu Dhabi, Muscat, Baku, Tbilisi">
                  (GMT +4:00) Abu Dhabi, Muscat, Baku, Tbilisi
                </SelectItem>
                <SelectItem value="(GMT +0:00) UTC">
                  (GMT +0:00) UTC
                </SelectItem>
                <SelectItem value="(GMT -5:00) New York">
                  (GMT -5:00) New York
                </SelectItem>
                <SelectItem value="(GMT +1:00) London">
                  (GMT +1:00) London
                </SelectItem>
              </SelectContent>
            </Select>

            {/* Days and Time Slots */}
            <div className="space-y-3 mt-4">
              {DAYS.map((day, index) => {
                const dayData = formData.workingHours?.[day.id] || { enabled: false, slots: [{ start: '09:00', end: '08:00' }] };
                return (
                  <div key={day.id} className="flex items-center gap-3">
                    <Checkbox
                      checked={dayData.enabled}
                      onCheckedChange={() => toggleDay(day.id)}
                    />
                    <Label className="w-12">{day.label}</Label>
                    {dayData.enabled ? (
                      <>
                        <Input
                          type="time"
                          value={dayData.slots[0]?.start || '09:00'}
                          onChange={(e) => updateSlot(day.id, 'start', e.target.value)}
                          className="w-28"
                          placeholder="From"
                        />
                        <span className="text-gray-400">→</span>
                        <Input
                          type="time"
                          value={dayData.slots[0]?.end || '08:00'}
                          onChange={(e) => updateSlot(day.id, 'end', e.target.value)}
                          className="w-28"
                          placeholder="To"
                        />
                        {index === 0 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToAll(day.id)}
                            className="text-blue-500 hover:text-blue-600 ml-auto"
                          >
                            Copy to all
                          </Button>
                        )}
                      </>
                    ) : (
                      <>
                        <Input
                          type="text"
                          disabled
                          value=""
                          placeholder="From"
                          className="w-28"
                        />
                        <span className="text-gray-400">→</span>
                        <Input
                          type="text"
                          disabled
                          value=""
                          placeholder="To"
                          className="w-28"
                        />
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Live Preview */}
      <div className="w-[420px] bg-gray-100 border-l border-gray-200 p-6">
        <LiveChatPreview formData={formData} selectedLanguage={selectedLanguageTab} />
      </div>
    </div>
  );
}