import { Call } from '@/types/call';
import { recentCallsData } from '@/data/mockData';

class EmergencyService {
  private static instance: EmergencyService;
  private calls: Call[] = [];

  private constructor() {
    this.calls = recentCallsData;
  }

  public static getInstance(): EmergencyService {
    if (!EmergencyService.instance) {
      EmergencyService.instance = new EmergencyService();
    }
    return EmergencyService.instance;
  }

  public async getCalls(): Promise<Call[]> {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(this.calls);
      }, 500);
    });
  }

  public async updateCallStatus(callId: number, checked: boolean): Promise<Call> {
    // Simulate API call
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const callIndex = this.calls.findIndex(call => call.id === callId);
        if (callIndex === -1) {
          reject(new Error('Call not found'));
          return;
        }

        this.calls[callIndex] = {
          ...this.calls[callIndex],
          checked,
        };

        resolve(this.calls[callIndex]);
      }, 500);
    });
  }

  public async getCallById(callId: number): Promise<Call | null> {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        const call = this.calls.find(call => call.id === callId);
        resolve(call || null);
      }, 500);
    });
  }
}

export const emergencyService = EmergencyService.getInstance(); 