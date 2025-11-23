import { useState, useEffect } from 'react';
import { X, Check, ChevronRight } from 'lucide-react';
import { Button } from './ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from './ui/sheet';
import { GeneralStep } from './wizard-steps/GeneralStep';
import { GreetingMessageStep } from './wizard-steps/GreetingMessageStep';
import { AppearanceStep } from './wizard-steps/AppearanceStep';
import { InstallationStep } from './wizard-steps/InstallationStep';
import { supabase } from '../lib/supabase';

export interface ChatWidgetFormData {
  name: string;
  title: { [language: string]: string };
  supportedLanguages: string[];
  showStatus: boolean;
  welcomeHeading: { [language: string]: string };
  welcomeTagline: { [language: string]: string };
  preChatFormEnabled: boolean;
  preChatFormFields: string[];
  privacyPolicyEnabled: boolean;
  privacyPolicyUrl: string;
  termsOfUseUrl: string;
  timeoutValue: number;
  timeoutUnit: 'seconds' | 'minutes' | 'hours';
  workingHours: {
    [key: string]: { enabled: boolean; slots: { start: string; end: string }[] };
  };
  duringWorkingHoursMessage: { [language: string]: string };
  afterWorkingHoursMessage: { [language: string]: string };
  position: 'bottom-left' | 'bottom-right';
  color: string;
  displayPicture?: string;
}

interface ChatWidget {
  id: string;
  active: boolean;
  name: string;
  languages: string[];
  createdAt: string;
  linkedWebsites: string[];
}

interface ChatWidgetWizardProps {
  open: boolean;
  onClose: () => void;
  editWidget?: ChatWidget | null;
}

const WIZARD_STEPS = [
  { id: 1, name: 'General Configurations', label: 'General' },
  { id: 2, name: 'Welcome Message', label: 'Welcome Message' },
  { id: 3, name: 'Appearance', label: 'Appearance' },
  { id: 4, name: 'Installation', label: 'Installation' },
];

const DEFAULT_FORM_DATA: ChatWidgetFormData = {
  name: '',
  title: { English: 'Live Chat' },
  supportedLanguages: ['English'],
  showStatus: true,
  welcomeHeading: { English: 'Hello! 👋' },
  welcomeTagline: { English: 'How can we help you today?' },
  preChatFormEnabled: false,
  preChatFormFields: [],
  privacyPolicyEnabled: false,
  privacyPolicyUrl: '',
  termsOfUseUrl: '',
  timeoutValue: 5,
  timeoutUnit: 'minutes',
  workingHours: {
    sun: { enabled: true, slots: [{ start: '09:00', end: '17:00' }] },
    mon: { enabled: true, slots: [{ start: '00:00', end: '23:59' }] },
    tue: { enabled: true, slots: [{ start: '00:00', end: '23:59' }] },
    wed: { enabled: true, slots: [{ start: '00:00', end: '23:59' }] },
    thu: { enabled: true, slots: [{ start: '00:00', end: '23:59' }] },
    fri: { enabled: true, slots: [{ start: '09:00', end: '23:59' }] },
    sat: { enabled: true, slots: [{ start: '00:00', end: '23:59' }] },
  },
  duringWorkingHoursMessage: { English: 'We are available!' },
  afterWorkingHoursMessage: { English: 'We will be back soon!' },
  position: 'bottom-right',
  color: '#8B5CF6',
};

export function ChatWidgetWizard({ open, onClose, editWidget }: ChatWidgetWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<ChatWidgetFormData>(DEFAULT_FORM_DATA);
  const [createdWidgetId, setCreatedWidgetId] = useState<string | null>(null);

  // Reset form when opening/closing or switching between create/edit mode
  useEffect(() => {
    if (open) {
      setCurrentStep(1);
      if (editWidget) {
        // Pre-fill form data for editing
        const editFormData: ChatWidgetFormData = {
          ...DEFAULT_FORM_DATA,
          name: editWidget.name,
          supportedLanguages: editWidget.languages,
          title: editWidget.languages.reduce((acc, lang) => {
            acc[lang] = 'Live Chat';
            return acc;
          }, {} as { [key: string]: string }),
          welcomeHeading: editWidget.languages.reduce((acc, lang) => {
            acc[lang] = 'Hello! 👋';
            return acc;
          }, {} as { [key: string]: string }),
          welcomeTagline: editWidget.languages.reduce((acc, lang) => {
            acc[lang] = 'How can we help you today?';
            return acc;
          }, {} as { [key: string]: string }),
          duringWorkingHoursMessage: editWidget.languages.reduce((acc, lang) => {
            acc[lang] = 'We are available!';
            return acc;
          }, {} as { [key: string]: string }),
          afterWorkingHoursMessage: editWidget.languages.reduce((acc, lang) => {
            acc[lang] = 'We will be back soon!';
            return acc;
          }, {} as { [key: string]: string }),
        };
        setFormData(editFormData);
        setCreatedWidgetId(editWidget.id);
      } else {
        setFormData(DEFAULT_FORM_DATA);
        setCreatedWidgetId(null);
      }
    }
  }, [open, editWidget]);

  const updateFormData = (data: Partial<ChatWidgetFormData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFinish = async () => {
    if (editWidget && createdWidgetId) {
      try {
        const { error } = await supabase
          .from('chat_widgets')
          .update({
            name: formData.name,
            supported_languages: formData.supportedLanguages,
            title: formData.title,
            show_status: formData.showStatus,
            welcome_heading: formData.welcomeHeading,
            welcome_tagline: formData.welcomeTagline,
            pre_chat_form_enabled: formData.preChatFormEnabled,
            pre_chat_form_fields: formData.preChatFormFields,
            privacy_policy_enabled: formData.privacyPolicyEnabled,
            privacy_policy_url: formData.privacyPolicyUrl,
            terms_of_use_url: formData.termsOfUseUrl,
            timeout_value: formData.timeoutValue,
            timeout_unit: formData.timeoutUnit,
            working_hours: formData.workingHours,
            during_working_hours_message: formData.duringWorkingHoursMessage,
            after_working_hours_message: formData.afterWorkingHoursMessage,
            position: formData.position,
            color: formData.color,
            display_picture: formData.displayPicture || '',
          })
          .eq('id', createdWidgetId);

        if (error) throw error;

        console.log('Widget updated successfully');
      } catch (error: any) {
        console.error('Error updating widget:', error);
        const errorMessage = error?.message || error?.error_description || 'Unknown error';
        alert(`Failed to update widget: ${errorMessage}\n\nPlease check the console for more details.`);
        return;
      }
    }
    onClose();
  };

  const handleNext = async () => {
    if (currentStep === 3 && !editWidget) {
      try {
        const { data, error } = await supabase
          .from('chat_widgets')
          .insert([
            {
              name: formData.name,
              active: true,
              supported_languages: formData.supportedLanguages,
              title: formData.title,
              show_status: formData.showStatus,
              welcome_heading: formData.welcomeHeading,
              welcome_tagline: formData.welcomeTagline,
              pre_chat_form_enabled: formData.preChatFormEnabled,
              pre_chat_form_fields: formData.preChatFormFields,
              privacy_policy_enabled: formData.privacyPolicyEnabled,
              privacy_policy_url: formData.privacyPolicyUrl,
              terms_of_use_url: formData.termsOfUseUrl,
              timeout_value: formData.timeoutValue,
              timeout_unit: formData.timeoutUnit,
              working_hours: formData.workingHours,
              during_working_hours_message: formData.duringWorkingHoursMessage,
              after_working_hours_message: formData.afterWorkingHoursMessage,
              position: formData.position,
              color: formData.color,
              display_picture: formData.displayPicture || '',
            },
          ])
          .select()
          .single();

        if (error) throw error;

        console.log('Widget created successfully:', data);
        setCreatedWidgetId(data.id);
        setCurrentStep(4);
      } catch (error: any) {
        console.error('Error creating widget:', error);
        const errorMessage = error?.message || error?.error_description || 'Unknown error';
        alert(`Failed to create widget: ${errorMessage}\n\nPlease check the console for more details.`);
      }
    } else if (currentStep < WIZARD_STEPS.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <GeneralStep formData={formData} updateFormData={updateFormData} />;
      case 2:
        return <GreetingMessageStep formData={formData} updateFormData={updateFormData} />;
      case 3:
        return <AppearanceStep formData={formData} updateFormData={updateFormData} />;
      case 4:
        return <InstallationStep formData={formData} widgetId={createdWidgetId} />;
      default:
        return null;
    }
  };

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent side="left" className="w-full sm:max-w-full p-0 gap-0 flex-row !max-w-none" showClose={false}>
        {/* Left Sidebar - Steps */}
        <div className="w-64 bg-gray-50 border-r border-gray-200 p-6 flex-shrink-0">
          <SheetHeader className="mb-6 p-0">
            <SheetTitle>{editWidget ? 'Edit Chat Widget' : 'New Chat Widget'}</SheetTitle>
            <SheetDescription className="sr-only">
              {editWidget ? 'Edit your chat widget by following the steps in this wizard' : 'Create a new chat widget by following the steps in this wizard'}
            </SheetDescription>
          </SheetHeader>

          <div className="space-y-2">
            {WIZARD_STEPS.map((step) => (
              <button
                key={step.id}
                onClick={() => setCurrentStep(step.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                  currentStep === step.id
                    ? 'bg-blue-500 text-white'
                    : currentStep > step.id
                    ? 'bg-white text-gray-700 hover:bg-gray-100'
                    : 'text-gray-500 hover:bg-gray-100'
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                    currentStep === step.id
                      ? 'bg-white text-blue-500'
                      : currentStep > step.id
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-300 text-gray-600'
                  }`}
                >
                  {currentStep > step.id ? <Check className="w-4 h-4" /> : step.id}
                </div>
                <span className="text-sm">{step.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="border-b border-gray-200 px-8 py-4 flex items-center justify-between">
            <h2 className="text-xl">{WIZARD_STEPS[currentStep - 1].name}</h2>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Step Content */}
          <div className="flex-1 overflow-y-auto">{renderStepContent()}</div>

          {/* Footer Actions */}
          <div className="border-t border-gray-200 px-8 py-4 flex items-center justify-between">
            <Button variant="outline" onClick={handleBack} disabled={currentStep === 1}>
              Back
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              {currentStep < WIZARD_STEPS.length ? (
                <Button onClick={handleNext} className="bg-blue-500 hover:bg-blue-600">
                  Next
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              ) : (
                <Button onClick={handleFinish} className="bg-blue-500 hover:bg-blue-600">
                  {editWidget ? 'Save Changes' : 'Create Widget'}
                </Button>
              )}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}