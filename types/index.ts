
export type UserRole = 'elder' | 'relative' | null;

export interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
}

export interface AlertHistoryItem {
  id: string;
  timestamp: number;
  type: 'deepfake' | 'scam_msg' | 'sos';
  riskScore: number;
  details: string;
}

export interface MessageAnalysisLog {
  id: string;
  text: string;
  result: 'safe' | 'suspicious' | 'scam';
  explanation: string;
  timestamp: number;
}

export interface FamilyVoiceProfile {
  id: string;
  name: string;
  relationship: string;
  timestamp: number;
}

export interface CallLogItem {
  id: string;
  phoneNumber: string;
  contactName?: string;
  timestamp: number;
  direction: 'incoming' | 'outgoing';
  duration: number; // seconds
  riskStatus: 'safe' | 'suspicious' | 'scam'; // Legacy manual status
  aiAnalysis?: {
    riskScore: number; // 0-100
    explanation: string;
    timestamp: number;
  };
}

export interface User {
  name: string;
  phone: string;
  id: string;
  role: UserRole;
  familyId: string;
  familyCodeTimestamp?: number;
  hasVoiceProfile: boolean;
  familyVoiceProfiles: FamilyVoiceProfile[]; 
  securityQuestions?: string[]; 
  securityAnswerHash?: string; 
  emergencyContacts: EmergencyContact[];
  alertHistory: AlertHistoryItem[];
  callHistory: CallLogItem[];
  messageHistory: MessageAnalysisLog[];
  sosMessage?: string;
  passwordHash?: string; 
}
