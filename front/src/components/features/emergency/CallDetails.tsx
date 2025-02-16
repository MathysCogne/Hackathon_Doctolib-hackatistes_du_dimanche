import { Call } from '@/types/call';
import { Badge } from '@/components/common/Badge';
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/common/Dialog';

// Types
interface CallDetailsProps {
  call: Call;
}

// Sub-components
const CallHeader = ({ priority, time }: { priority: Call['priority']; time: string }) => (
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-4">
      <Badge 
        variant={priority}
        className="px-4 py-1.5 text-base capitalize font-semibold shadow-sm"
      >
        {priority}
      </Badge>
      <ActiveCallIndicator />
    </div>
    <span className="text-lg font-semibold text-gray-700">{time}</span>
  </div>
);

const ActiveCallIndicator = () => (
  <div className="flex items-center gap-2 bg-blue-100 px-3 py-1.5 rounded-full shadow-sm">
    <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
    <span className="text-sm font-semibold text-blue-700">Active Call</span>
  </div>
);

const PatientInfo = ({ name, age, address }: { name: string; age: number; address: string }) => (
  <div className="mt-5">
    <div className="flex items-center gap-3 mb-3">
      <DialogTitle className="text-3xl font-bold text-gray-900 tracking-tight">
        {name}
      </DialogTitle>
      <span className="text-xl font-medium text-gray-500">({age} years old)</span>
    </div>
    <DialogDescription className="text-gray-900 text-xl font-semibold">
      {address}
    </DialogDescription>
  </div>
);

const EmergencyDescription = ({ description }: { description: string }) => (
  <div>
    <h3 className="text-base font-semibold text-gray-900 mb-3 uppercase tracking-wide">
      Emergency Description
    </h3>
    <div className="bg-orange-50 border border-orange-100 rounded-lg p-4 shadow-sm">
      <p className="text-lg text-gray-900 leading-relaxed">{description}</p>
    </div>
  </div>
);

const PatientStatus = () => (
  <div>
    <h3 className="text-base font-semibold text-gray-900 mb-3 uppercase tracking-wide">
      Patient Status
    </h3>
    <div className="bg-gray-50 rounded-lg p-5 border border-gray-200 shadow-sm">
      <div className="grid grid-cols-2 gap-6">
        <StatusItem label="Consciousness Level" />
        <StatusItem label="Pain Level (1-10)" />
        <StatusItem label="Temperature" />
      </div>
    </div>
  </div>
);

const StatusItem = ({ label }: { label: string }) => (
  <div>
    <p className="text-sm font-medium text-gray-700 mb-2">{label}</p>
    <div className="flex items-center gap-2">
      <Badge className="bg-gray-200 text-gray-800 text-sm px-3 py-1 font-medium">
        Unknown
      </Badge>
    </div>
  </div>
);

interface Note {
  label: string;
  content: string;
  type: 'primary' | 'history' | 'secondary';
}

const NotesSection = ({ notes }: { notes: Note[] }) => (
  <div>
    <h3 className="text-base font-bold text-gray-900 mb-4 uppercase tracking-wide">
      Notes
    </h3>
    <div className="space-y-4 max-h-[300px] overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
      <div className="space-y-4">
        {notes.map((note, index) => (
          <NoteCard key={index} {...note} />
        ))}
      </div>
    </div>
  </div>
);

const NoteCard = ({ label, content, type }: Note) => (
  <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
    <div className="inline-flex flex-wrap gap-1.5 mb-3">
      <Badge className="bg-slate-100 text-slate-700 text-sm px-2.5 py-1 font-medium border border-slate-200">
        {label}
      </Badge>
    </div>
    <p className="text-sm text-gray-700 leading-relaxed">{content}</p>
  </div>
);

// Main component
export function CallDetails({ call }: CallDetailsProps) {
  const notes: Note[] = [
    {
      label: "Chest Pain",
      content: "Patient experiencing severe chest pressure radiating to left arm, accompanied by shortness of breath. Symptoms indicate possible cardiac event. Pain described as heavy pressure, onset 30 minutes ago.",
      type: "primary"
    },
    {
      label: "Medical History",
      content: "Patient history reveals previous cardiac episode last month with similar presentation. Currently on prescribed heart medication, but missed last two doses.",
      type: "history"
    },
    {
      label: "Secondary Symptoms",
      content: "Additional symptoms include profuse sweating, dizziness, and nausea. Patient showing signs of distress and anxiety, which may be exacerbating symptoms.",
      type: "secondary"
    }
  ];

  return (
    <DialogContent className="max-w-4xl bg-white/95 backdrop-blur-xl p-6 shadow-lg border border-gray-200">
      <DialogHeader className="border-b border-gray-200 pb-4">
        <CallHeader priority={call.priority} time={call.dateTime} />
        <PatientInfo name={call.name} age={42} address="123 Emergency Street, City, Country" />
      </DialogHeader>

      <div className="grid grid-cols-2 gap-8 mt-6">
        <div className="space-y-6">
          <EmergencyDescription description={call.description} />
          <PatientStatus />
        </div>

        <div className="border-l border-gray-200 pl-8">
          <NotesSection notes={notes} />
        </div>
      </div>
    </DialogContent>
  );
} 