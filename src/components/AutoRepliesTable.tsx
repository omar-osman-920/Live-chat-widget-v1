import { Switch } from './ui/switch';
import { Edit2 } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';

export function AutoRepliesTable() {
  const autoReplies = [
    {
      id: '1',
      active: false,
      phoneNumber: '+96279507542',
      flag: '🇦🇪',
      duringWorkingHours: 'No message set',
      afterWorkingHours: 'No message set',
    },
    {
      id: '2',
      active: true,
      phoneNumber: '+96262220834',
      flag: '🇦🇪',
      duringWorkingHours: 'Hello, this is a test Omar 1234',
      afterWorkingHours: 'No message set',
    },
  ];

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl mb-2">Auto-Reply Messages</h1>
        <p className="text-gray-600">Automatically reply with a message when your business team is away.</p>
      </div>

      <div className="bg-white rounded-lg border border-gray-200">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Active</TableHead>
              <TableHead>Phone Number</TableHead>
              <TableHead>During working hours</TableHead>
              <TableHead>After working hours</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {autoReplies.map((reply) => (
              <TableRow key={reply.id}>
                <TableCell>
                  <Switch checked={reply.active} />
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span>{reply.flag}</span>
                    <span>{reply.phoneNumber}</span>
                  </div>
                </TableCell>
                <TableCell className="text-gray-600">{reply.duringWorkingHours}</TableCell>
                <TableCell className="text-gray-600">{reply.afterWorkingHours}</TableCell>
                <TableCell>
                  <button className="p-2 hover:bg-gray-100 rounded">
                    <Edit2 className="w-4 h-4 text-gray-600" />
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="mt-4 flex justify-center">
        <button className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-50">
          1
        </button>
      </div>
    </div>
  );
}
