import { Call } from '../types/call';

export const recentCallsData: Call[] = [
  {
    id: 1,
    checked: false,
    name: "Boisne Jembe",
    priority: "low",
    description: "Loss of consciousness and don't breathe",
    dateTime: "18h30",
  },
  {
    id: 2,
    checked: true,
    name: "Alice Dupont",
    priority: "high",
    description: "Severe chest pain and difficulty breathing",
    dateTime: "09h15",
  },
  {
    id: 3,
    checked: false,
    name: "Jean Martin",
    priority: "medium",
    description: "High fever and persistent cough",
    dateTime: "14h45",
  },
  {
    id: 4,
    checked: true,
    name: "Sophie Leroy",
    priority: "low",
    description: "Mild headache and dizziness",
    dateTime: "11h00",
  },
  {
    id: 5,
    checked: false,
    name: "Pierre Garnier",
    priority: "vital",
    description: "Severe allergic reaction with swelling",
    dateTime: "20h00",
  },
];