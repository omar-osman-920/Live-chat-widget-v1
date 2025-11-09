import { useState, useEffect } from 'react';
import { Code, Sparkles, Send } from 'lucide-react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';

export function DummyWebsitePage() {
  const [embedCode, setEmbedCode] = useState('');
  const [widgetLoaded, setWidgetLoaded] = useState(false);

  const loadWidget = () => {
    if (!embedCode.trim()) return;

    const container = document.getElementById('widget-container');
    if (!container) return;

    container.innerHTML = '';
    setWidgetLoaded(false);

    try {
      const scriptMatch = embedCode.match(/<script[^>]*>([\s\S]*?)<\/script>/i);
      if (scriptMatch) {
        const scriptContent = scriptMatch[1];
        const tempFunc = new Function(scriptContent);
        tempFunc();
        setWidgetLoaded(true);
      }
    } catch (error) {
      console.error('Error loading widget:', error);
    }
  };

  useEffect(() => {
    return () => {
      const container = document.getElementById('widget-container');
      if (container) {
        container.innerHTML = '';
      }
    };
  }, []);

  return (
    <div className="h-full flex flex-col">
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-8 py-6 border-b border-blue-700">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-3">
            <Sparkles className="w-8 h-8 text-white" />
            <h1 className="text-3xl font-bold text-white">Test Your Live Chat Widget</h1>
          </div>
          <p className="text-blue-50 text-lg">
            Paste your widget embed code below to see it in action on this demo website
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto bg-gray-50">
        <div className="max-w-7xl mx-auto p-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
            <div className="flex items-start gap-3 mb-4">
              <Code className="w-5 h-5 text-blue-500 mt-1" />
              <div className="flex-1">
                <Label htmlFor="embed-code" className="text-base font-semibold mb-2 block">
                  Widget Embed Code
                </Label>
                <p className="text-sm text-gray-600 mb-4">
                  Copy the embed code from your chat widget settings and paste it here
                </p>
                <Textarea
                  id="embed-code"
                  value={embedCode}
                  onChange={(e) => setEmbedCode(e.target.value)}
                  placeholder="<!-- Chat Widget Code -->
<script>
  (function() {
    // Your widget code here
  })();
</script>"
                  className="font-mono text-sm min-h-[200px] mb-4"
                />
                <Button
                  onClick={loadWidget}
                  disabled={!embedCode.trim()}
                  className="bg-blue-500 hover:bg-blue-600"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Load Widget
                </Button>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to Our Store</h2>
              <p className="text-gray-600">
                This is a demo page to test your live chat widget integration
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-3">About Us</h3>
                <p className="text-gray-600 leading-relaxed">
                  We are a leading e-commerce company dedicated to providing exceptional customer
                  service. Our live chat widget helps us connect with customers in real-time to
                  answer questions and provide support.
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-3">Customer Support</h3>
                <p className="text-gray-600 leading-relaxed">
                  Have questions? Our support team is here to help! Look for the chat widget on
                  this page to start a conversation. We typically respond within minutes during
                  business hours.
                </p>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">
                Testing Your Widget
              </h3>
              <ul className="space-y-2 text-blue-800">
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1">•</span>
                  <span>Paste your embed code in the box above</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1">•</span>
                  <span>Click "Load Widget" to see it appear</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1">•</span>
                  <span>The widget should appear in the bottom corner of the page</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1">•</span>
                  <span>Test all features including language selection and forms</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div id="widget-container"></div>

      {widgetLoaded && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg animate-fade-in">
          Widget loaded successfully!
        </div>
      )}
    </div>
  );
}
