import { Plus, ExternalLink, MoreVertical, Code, Edit, Copy } from 'lucide-react';
import { Button } from './ui/button';
import { Switch } from './ui/switch';
import { Badge } from './ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ChatWidgetWizard } from './ChatWidgetWizard';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface WidgetDisplay {
  id: string;
  active: boolean;
  name: string;
  languages: string[];
  createdAt: string;
  linkedWebsites: string[];
}

export function LiveChatWidgetTable() {
  const [showWizard, setShowWizard] = useState(false);
  const [editingWidget, setEditingWidget] = useState<WidgetDisplay | null>(null);
  const [shareCodeWidget, setShareCodeWidget] = useState<WidgetDisplay | null>(null);
  const [widgets, setWidgets] = useState<WidgetDisplay[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWidgets();
  }, []);

  const fetchWidgets = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('chat_widgets')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const widgetsDisplay: WidgetDisplay[] = (data || []).map((widget) => ({
        id: widget.id,
        active: widget.active,
        name: widget.name,
        languages: widget.supported_languages,
        createdAt: new Date(widget.created_at).toISOString().split('T')[0],
        linkedWebsites: [],
      }));

      setWidgets(widgetsDisplay);
    } catch (error) {
      console.error('Error fetching widgets:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleActive = async (id: string) => {
    const widget = widgets.find(w => w.id === id);
    if (!widget) return;

    const newActiveState = !widget.active;

    try {
      const { error } = await supabase
        .from('chat_widgets')
        .update({ active: newActiveState })
        .eq('id', id);

      if (error) throw error;

      setWidgets(widgets.map(w =>
        w.id === id ? { ...w, active: newActiveState } : w
      ));
    } catch (error) {
      console.error('Error updating widget:', error);
      alert('Failed to update widget status');
    }
  };

  const handleWizardClose = () => {
    setShowWizard(false);
    fetchWidgets();
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl mb-2">Live Chat Widget</h1>
          <p className="text-gray-600">Manage your live chat widgets and their configurations.</p>
        </div>
        <Button className="bg-blue-500 hover:bg-blue-600" onClick={() => setShowWizard(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Create New Chat Widget
        </Button>
      </div>

      <div className="bg-white rounded-lg border border-gray-200">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading widgets...</div>
        ) : widgets.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No widgets yet. Click "Create New Chat Widget" to get started.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Active</TableHead>
                <TableHead>Chat Widget Name</TableHead>
                <TableHead>Supported Languages</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead>Linked Websites</TableHead>
                <TableHead className="w-[80px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {widgets.map((widget) => (
              <TableRow key={widget.id}>
                <TableCell>
                  <Switch
                    checked={widget.active}
                    onCheckedChange={() => toggleActive(widget.id)}
                  />
                </TableCell>
                <TableCell>{widget.name}</TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {widget.languages.map((lang, index) => (
                      <Badge key={index} variant="secondary">
                        {lang}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell>{widget.createdAt}</TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1 max-w-md">
                    {widget.linkedWebsites.slice(0, 2).map((website, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {website}
                      </Badge>
                    ))}
                    {widget.linkedWebsites.length > 2 && (
                      <Badge variant="secondary" className="text-xs">
                        +{widget.linkedWebsites.length - 2}
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setShareCodeWidget(widget)}>
                        <Code className="w-4 h-4 mr-2" />
                        Share Code
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setEditingWidget(widget)}>
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      <ChatWidgetWizard open={showWizard} onClose={handleWizardClose} />

      <ChatWidgetWizard 
        open={!!editingWidget} 
        onClose={() => setEditingWidget(null)} 
        editWidget={editingWidget}
      />

      <Dialog open={!!shareCodeWidget} onOpenChange={() => setShareCodeWidget(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Share Widget Code</DialogTitle>
            <DialogDescription>
              Copy and paste this code into your website to add the chat widget.
            </DialogDescription>
          </DialogHeader>
          
          {shareCodeWidget && (
            <Tabs defaultValue={shareCodeWidget.languages[0]} className="w-full">
              <TabsList className="grid w-full" style={{ gridTemplateColumns: `repeat(${shareCodeWidget.languages.length}, 1fr)` }}>
                {shareCodeWidget.languages.map((lang) => (
                  <TabsTrigger key={lang} value={lang}>
                    {lang}
                  </TabsTrigger>
                ))}
              </TabsList>
              {shareCodeWidget.languages.map((lang) => (
                <TabsContent key={lang} value={lang} className="space-y-4">
                  <div className="rounded-lg bg-gray-50 p-4">
                    <pre className="text-sm overflow-auto">
                      <code>{`<!-- ${shareCodeWidget.name} - ${lang} -->
<script
  src="${window.location.origin}/widget-loader.js"
  data-widget-id="${shareCodeWidget.id}"
  data-language="${lang.toLowerCase()}">
</script>`}</code>
                    </pre>
                  </div>
                  <Button
                    className="w-full"
                    onClick={() => {
                      const code = `<!-- ${shareCodeWidget.name} - ${lang} -->
<script
  src="${window.location.origin}/widget-loader.js"
  data-widget-id="${shareCodeWidget.id}"
  data-language="${lang.toLowerCase()}">
</script>`;
                      navigator.clipboard.writeText(code);
                    }}
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Copy Code
                  </Button>
                </TabsContent>
              ))}
            </Tabs>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}