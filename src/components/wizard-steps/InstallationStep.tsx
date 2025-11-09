import { ChatWidgetFormData } from '../ChatWidgetWizard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Button } from '../ui/button';
import { Copy, Check } from 'lucide-react';
import { useState } from 'react';
import { LiveChatPreview } from '../LiveChatPreview';

interface InstallationStepProps {
  formData: ChatWidgetFormData;
}

export function InstallationStep({ formData }: InstallationStepProps) {
  const [copiedLanguage, setCopiedLanguage] = useState<string | null>(null);
  const [selectedLanguageTab, setSelectedLanguageTab] = useState('English');

  const generateCodeSnippet = (language: string) => {
    const widgetId = 'widget-' + Math.random().toString(36).substr(2, 9);
    
    return `<!-- ${language} Chat Widget -->
<script>
  (function(w,d,s,o,f,js,fjs){
    w['ChatWidget']=o;w[o] = w[o] || function () { (w[o].q = w[o].q || []).push(arguments) };
    js = d.createElement(s), fjs = d.getElementsByTagName(s)[0];
    js.id = o; js.src = f; js.async = 1; fjs.parentNode.insertBefore(js, fjs);
  }(window, document, 'script', 'cw', 'https://widget.maqsam.com/widget.js'));
  
  cw('init', {
    widgetId: '${widgetId}',
    language: '${language.toLowerCase()}',
    position: '${formData.position}',
    color: '${formData.color}'
  });
</script>`;
  };

  const handleCopy = (language: string, code: string) => {
    // Fallback copy method for when clipboard API is blocked
    const textArea = document.createElement('textarea');
    textArea.value = code;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
      document.execCommand('copy');
      setCopiedLanguage(language);
      setTimeout(() => setCopiedLanguage(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    } finally {
      document.body.removeChild(textArea);
    }
  };

  const selectedLanguages = formData.supportedLanguages.length > 0 
    ? formData.supportedLanguages 
    : ['English'];

  return (
    <div className="flex-1 flex">
      {/* Left Side - Installation Code */}
      <div className="flex-1 px-8 py-6 overflow-y-auto">
        <div className="max-w-3xl space-y-6">
          <div>
            <h3 className="text-lg mb-2">Installation Instructions</h3>
            <p className="text-sm text-gray-600">
              Copy and paste the code snippet below into your website's HTML, just before the closing
              {'</body>'} tag. Select the language tab for the specific integration code.
            </p>
          </div>

          <Tabs defaultValue={selectedLanguages[0]} className="w-full" onValueChange={(value) => setSelectedLanguageTab(value)}>
            <TabsList>
              {selectedLanguages.map((language) => (
                <TabsTrigger key={language} value={language}>
                  {language}
                </TabsTrigger>
              ))}
            </TabsList>
            {selectedLanguages.map((language) => {
              const code = generateCodeSnippet(language);
              return (
                <TabsContent key={language} value={language} className="mt-4">
                  <div className="relative">
                    <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                      <code>{code}</code>
                    </pre>
                    <Button
                      size="sm"
                      variant="secondary"
                      className="absolute top-2 right-2"
                      onClick={() => handleCopy(language, code)}
                    >
                      {copiedLanguage === language ? (
                        <>
                          <Check className="w-4 h-4 mr-2" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4 mr-2" />
                          Copy Code
                        </>
                      )}
                    </Button>
                  </div>
                </TabsContent>
              );
            })}
          </Tabs>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="text-sm font-medium text-blue-900 mb-2">Installation Tips</h4>
            <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
              <li>Place the code snippet just before the closing {'</body>'} tag</li>
              <li>The widget will automatically detect the visitor's language preference</li>
              <li>Test the widget in incognito mode to see the visitor experience</li>
              <li>You can customize the widget appearance from the settings panel</li>
            </ul>
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