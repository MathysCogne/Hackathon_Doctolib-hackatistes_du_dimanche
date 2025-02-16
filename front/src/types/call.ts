export interface Call {
  id: number;
  checked: boolean;
  name: string;
  priority: "low" | "medium" | "high" | "vital";
  description: string;
  dateTime: string;
} 