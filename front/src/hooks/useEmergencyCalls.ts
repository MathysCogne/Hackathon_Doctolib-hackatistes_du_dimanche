import { useState, useCallback } from 'react';
import { Call } from '@/types/call';
import { PRIORITIES } from '@/config/constants';

interface UseEmergencyCallsProps {
  initialCalls: Call[];
}

interface UseEmergencyCallsReturn {
  calls: Call[];
  pendingCalls: Call[];
  completedCalls: Call[];
  toggleCallStatus: (callId: number) => void;
  getCallsByPriority: (priority: keyof typeof PRIORITIES) => Call[];
}

const priorityOrder = {
  [PRIORITIES.VITAL]: 0,
  [PRIORITIES.HIGH]: 1,
  [PRIORITIES.MEDIUM]: 2,
  [PRIORITIES.LOW]: 3,
};

export function useEmergencyCalls({ initialCalls }: UseEmergencyCallsProps): UseEmergencyCallsReturn {
  const [calls, setCalls] = useState<Call[]>(initialCalls);

  const toggleCallStatus = useCallback((callId: number) => {
    setCalls(prevCalls => 
      prevCalls.map(call => 
        call.id === callId ? { ...call, checked: !call.checked } : call
      )
    );
  }, []);

  const getCallsByPriority = useCallback((priority: keyof typeof PRIORITIES) => {
    return calls.filter(call => call.priority === priority);
  }, [calls]);

  const pendingCalls = calls
    .filter(call => !call.checked)
    .sort((a, b) => priorityOrder[a.priority as keyof typeof PRIORITIES] - priorityOrder[b.priority as keyof typeof PRIORITIES]);

  const completedCalls = calls
    .filter(call => call.checked)
    .sort((a, b) => priorityOrder[a.priority as keyof typeof PRIORITIES] - priorityOrder[b.priority as keyof typeof PRIORITIES]);

  return {
    calls,
    pendingCalls,
    completedCalls,
    toggleCallStatus,
    getCallsByPriority,
  };
} 