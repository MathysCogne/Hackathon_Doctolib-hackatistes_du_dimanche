import { useState } from "react";
import { Call } from "@/types/call";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CallDetails } from "./CallDetails";
import { recentCallsData } from "@/data/mockData";

const priorityOrder = {
  vital: 0,
  high: 1,
  medium: 2,
  low: 3,
};

export function CallsList() {
  const [calls, setCalls] = useState(recentCallsData);
  const [selectedCall, setSelectedCall] = useState<Call | null>(null);

  const toggleCallStatus = (callId: number) => {
    setCalls(prevCalls => 
      prevCalls.map(call => 
        call.id === callId ? { ...call, checked: !call.checked } : call
      )
    );
  };

  const pendingCalls = calls
    .filter(call => !call.checked)
    .sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

  const completedCalls = calls
    .filter(call => call.checked)
    .sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

  const CallTable = ({ calls, isCompleted = false }: { calls: Call[], isCompleted?: boolean }) => (
    <Table>
      <TableHeader>
        <TableRow className="hover:bg-transparent border-b border-gray-100">
          <TableHead className="text-left w-[160px] text-gray-600 font-medium">Time</TableHead>
          <TableHead className="w-[120px] text-gray-600 font-medium">Priority</TableHead>
          <TableHead className="w-[180px] text-gray-600 font-medium">Name</TableHead>
          <TableHead className="text-gray-600 font-medium">Description</TableHead>
          <TableHead className="w-[60px] text-gray-600 font-medium">Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {calls.map((call) => (
          <Dialog key={call.id}>
            <DialogTrigger asChild>
              <TableRow
                className={`group cursor-pointer border-l-2 border-l-transparent border-b border-gray-50 transition-all duration-200 hover:border-l-gray-900 hover:bg-gray-900/5 ${
                  isCompleted ? "text-gray-400 line-through" : ""
                }`}
                onClick={() => setSelectedCall(call)}
              >
                <TableCell className="text-left font-medium text-inherit group-hover:text-gray-900">
                  {call.dateTime}
                </TableCell>
                <TableCell>
                  <Badge 
                    variant={call.priority} 
                    className={`capitalize font-medium ${
                      isCompleted ? "opacity-50" : ""
                    }`}
                  >
                    {call.priority}
                  </Badge>
                </TableCell>
                <TableCell className="font-medium text-inherit group-hover:text-gray-900">
                  {call.name}
                </TableCell>
                <TableCell className="max-w-[400px] truncate text-inherit group-hover:text-gray-900">
                  {call.description}
                </TableCell>
                <TableCell className="text-center" onClick={(e) => e.stopPropagation()}>
                  <div className="flex justify-center">
                    <Checkbox 
                      checked={call.checked}
                      onCheckedChange={() => toggleCallStatus(call.id)}
                      className="transition-transform duration-200"
                    />
                  </div>
                </TableCell>
              </TableRow>
            </DialogTrigger>
            <CallDetails call={call} />
          </Dialog>
        ))}
      </TableBody>
    </Table>
  );

  return (
    <div className="w-full mx-auto p-8 space-y-16">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-blue-600" />
          Pending Emergencies
        </h2>
        <CallTable calls={pendingCalls} />
      </div>
      
      {completedCalls.length > 0 && (
        <div className="relative">
          <div className="absolute -top-8 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
          <h2 className="text-xl font-semibold text-gray-500 mb-6 flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-gray-400" />
            Completed Emergencies
          </h2>
          <CallTable calls={completedCalls} isCompleted />
        </div>
      )}
    </div>
  );
}
