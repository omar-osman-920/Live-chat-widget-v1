import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './ui/dialog';
import { Label } from './ui/label';
import { Checkbox } from './ui/checkbox';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Plus, Minus, Copy } from 'lucide-react';
import { useState } from 'react';

interface WorkingHoursModalProps {
  open: boolean;
  onClose: () => void;
  workingHours: {
    [key: string]: { enabled: boolean; slots: { start: string; end: string }[] };
  };
  onSave: (hours: any) => void;
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

export function WorkingHoursModal({ open, onClose, workingHours, onSave }: WorkingHoursModalProps) {
  const [hours, setHours] = useState(workingHours);
  const [timezone, setTimezone] = useState('+03:00 Asia - Amman');

  const toggleDay = (dayId: string) => {
    setHours({
      ...hours,
      [dayId]: {
        ...hours[dayId],
        enabled: !hours[dayId].enabled,
      },
    });
  };

  const updateSlot = (dayId: string, slotIndex: number, field: 'start' | 'end', value: string) => {
    const newSlots = [...hours[dayId].slots];
    newSlots[slotIndex] = { ...newSlots[slotIndex], [field]: value };
    setHours({
      ...hours,
      [dayId]: {
        ...hours[dayId],
        slots: newSlots,
      },
    });
  };

  const addSlot = (dayId: string) => {
    setHours({
      ...hours,
      [dayId]: {
        ...hours[dayId],
        slots: [...hours[dayId].slots, { start: '09:00', end: '17:00' }],
      },
    });
  };

  const removeSlot = (dayId: string, slotIndex: number) => {
    const newSlots = hours[dayId].slots.filter((_, i) => i !== slotIndex);
    setHours({
      ...hours,
      [dayId]: {
        ...hours[dayId],
        slots: newSlots.length > 0 ? newSlots : [{ start: '00:00', end: '23:59' }],
      },
    });
  };

  const copyToAll = (dayId: string) => {
    const sourceSlots = hours[dayId].slots;
    const newHours = { ...hours };
    DAYS.forEach((day) => {
      newHours[day.id] = {
        enabled: hours[day.id].enabled,
        slots: [...sourceSlots],
      };
    });
    setHours(newHours);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Working Hours</DialogTitle>
          <DialogDescription>Set the working hours for your business</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Timezone */}
          <div className="space-y-2">
            <Label>Timezone</Label>
            <Select value={timezone} onValueChange={setTimezone}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="+03:00 Asia - Amman">+03:00 Asia - Amman</SelectItem>
                <SelectItem value="+00:00 UTC">+00:00 UTC</SelectItem>
                <SelectItem value="-05:00 America - New York">-05:00 America - New York</SelectItem>
                <SelectItem value="+01:00 Europe - London">+01:00 Europe - London</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Days and Time Slots */}
          <div className="space-y-3">
            {DAYS.map((day) => (
              <div key={day.id} className="flex items-start gap-3 pb-3 border-b border-gray-200">
                <Checkbox
                  checked={hours[day.id]?.enabled ?? false}
                  onCheckedChange={() => toggleDay(day.id)}
                  className="mt-2"
                />
                <div className="flex-1 min-w-0">
                  <Label className="mb-2 block">{day.label}</Label>
                  {hours[day.id]?.enabled && (
                    <div className="space-y-2">
                      {hours[day.id].slots.map((slot, slotIndex) => (
                        <div key={slotIndex} className="flex items-center gap-2">
                          <Input
                            type="time"
                            value={slot.start}
                            onChange={(e) => updateSlot(day.id, slotIndex, 'start', e.target.value)}
                            className="w-32"
                          />
                          <span className="text-gray-500">-</span>
                          <Input
                            type="time"
                            value={slot.end}
                            onChange={(e) => updateSlot(day.id, slotIndex, 'end', e.target.value)}
                            className="w-32"
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => addSlot(day.id)}
                            className="text-blue-500 hover:text-blue-600"
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                          {hours[day.id].slots.length > 1 && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removeSlot(day.id, slotIndex)}
                              className="text-red-500 hover:text-red-600"
                            >
                              <Minus className="w-4 h-4" />
                            </Button>
                          )}
                          {slotIndex === 0 && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => copyToAll(day.id)}
                              className="text-blue-500 hover:text-blue-600"
                            >
                              <Copy className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={() => onSave(hours)} className="bg-blue-500 hover:bg-blue-600">
            Save Working Hours
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
