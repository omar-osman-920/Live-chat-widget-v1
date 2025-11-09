import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { ChatWidgetFormData } from '../ChatWidgetWizard';
import { LiveChatPreview } from '../LiveChatPreview';
import { Upload } from 'lucide-react';
import { useRef } from 'react';

interface AppearanceStepProps {
  formData: ChatWidgetFormData;
  updateFormData: (data: Partial<ChatWidgetFormData>) => void;
}

const PRESET_COLORS = [
  '#3B82F6', // Blue
  '#8B5CF6', // Purple
  '#10B981', // Green
  '#EF4444', // Red
  '#EC4899', // Pink
  '#64748B', // Slate
  '#1F2937', // Gray
];

export function AppearanceStep({ formData, updateFormData }: AppearanceStepProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check file size (800KB = 800 * 1024 bytes)
      if (file.size > 800 * 1024) {
        alert('File size exceeds 800kB. Please choose a smaller file.');
        return;
      }

      // Check file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/gif', 'image/png'];
      if (!validTypes.includes(file.type)) {
        alert('Please upload a JPG, GIF, or PNG file.');
        return;
      }

      // Convert to base64
      const reader = new FileReader();
      reader.onloadend = () => {
        updateFormData({ displayPicture: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex-1 flex">
      {/* Left Side - Configuration */}
      <div className="flex-1 px-8 py-6 overflow-y-auto">
        <div className="max-w-xl space-y-6">
          <p className="text-sm text-gray-600">
            Personalize the appearance of your chat widget to determine its appearance on your
            website.
          </p>

          {/* Widget Position */}
          <div className="space-y-3">
            <Label>Widget Position</Label>
            <div className="flex gap-4">
              <button
                onClick={() => updateFormData({ position: 'bottom-left' })}
                className={`relative w-24 h-24 border-2 rounded-lg transition-colors ${
                  formData.position === 'bottom-left'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-300 bg-white hover:border-gray-400'
                }`}
              >
                <div
                  className={`absolute bottom-2 left-2 w-6 h-6 rounded transition-colors ${
                    formData.position === 'bottom-left'
                      ? 'bg-blue-500'
                      : 'bg-gray-400'
                  }`}
                />
              </button>
              <button
                onClick={() => updateFormData({ position: 'bottom-right' })}
                className={`relative w-24 h-24 border-2 rounded-lg transition-colors ${
                  formData.position === 'bottom-right'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-300 bg-white hover:border-gray-400'
                }`}
              >
                <div
                  className={`absolute bottom-2 right-2 w-6 h-6 rounded transition-colors ${
                    formData.position === 'bottom-right'
                      ? 'bg-blue-500'
                      : 'bg-gray-400'
                  }`}
                />
              </button>
            </div>
            <div className="flex gap-4 text-xs text-gray-600">
              <span className="w-24 text-center">Bottom-Left</span>
              <span className="w-24 text-center">Bottom-Right</span>
            </div>
          </div>

          {/* Display Picture */}
          <div className="space-y-3">
            <Label>Display Picture</Label>
            <div
              onClick={() => fileInputRef.current?.click()}
              className="w-16 h-16 rounded-full border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 cursor-pointer flex flex-col items-center justify-center transition-colors"
            >
              {formData.displayPicture ? (
                <img
                  src={formData.displayPicture}
                  alt="Display Picture"
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <>
                  <Upload className="w-5 h-5 text-gray-400 mb-0.5" />
                  <span className="text-[10px] text-gray-500">UPLOAD</span>
                </>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/jpg,image/gif,image/png"
              onChange={handleFileUpload}
              className="hidden"
            />
            <p className="text-xs text-gray-500">
              Allowed JPG, GIF or PNG. Max size of 800kB
            </p>
          </div>

          {/* Widget Color */}
          <div className="space-y-3">
            <Label>Widget Color</Label>
            <div className="flex flex-wrap gap-2">
              {PRESET_COLORS.map((color) => (
                <button
                  key={color}
                  className={`w-8 h-8 rounded ${
                    formData.color === color ? 'ring-2 ring-offset-2 ring-blue-500' : ''
                  }`}
                  style={{ backgroundColor: color }}
                  onClick={() => updateFormData({ color })}
                />
              ))}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">#</span>
              <Input
                type="text"
                value={formData.color.replace('#', '')}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^0-9A-Fa-f]/g, '').slice(0, 6);
                  updateFormData({ color: `#${value}` });
                }}
                className="w-32"
                maxLength={6}
              />
              <div
                className="w-10 h-10 rounded border border-gray-300"
                style={{ backgroundColor: formData.color }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Live Preview */}
      <div className="w-[420px] bg-gray-100 border-l border-gray-200 p-6">
        <LiveChatPreview formData={formData} />
      </div>
    </div>
  );
}
