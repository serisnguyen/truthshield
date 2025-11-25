
import { 
  User, 
  EmergencyContact, 
  FamilyVoiceProfile, 
  AlertHistoryItem, 
  MessageAnalysisLog, 
  CallLogItem 
} from '../types';

interface UseUserProfileProps {
  user: User | null;
  persistUser: (user: User) => void;
}

export const useUserProfile = ({ user, persistUser }: UseUserProfileProps) => {

  const addEmergencyContact = (contact: Omit<EmergencyContact, 'id'>) => {
    if (user) {
      const newContact = { ...contact, id: Date.now().toString() };
      const updatedUser = { ...user, emergencyContacts: [...user.emergencyContacts, newContact] };
      persistUser(updatedUser);
    }
  };

  const removeEmergencyContact = (id: string) => {
    if (user) {
      const updatedUser = { 
        ...user, 
        emergencyContacts: user.emergencyContacts.filter(c => c.id !== id) 
      };
      persistUser(updatedUser);
    }
  };

  const addFamilyVoiceProfile = (profile: Omit<FamilyVoiceProfile, 'id' | 'timestamp'>) => {
    if (user) {
      const newProfile: FamilyVoiceProfile = { 
        ...profile, 
        id: Date.now().toString(),
        timestamp: Date.now()
      };
      const updatedUser = { ...user, familyVoiceProfiles: [...user.familyVoiceProfiles, newProfile] };
      persistUser(updatedUser);
    }
  };

  const addAlertToHistory = (alert: Omit<AlertHistoryItem, 'id' | 'timestamp'>) => {
    if (user) {
      const newAlert: AlertHistoryItem = { 
        ...alert, 
        id: Date.now().toString(), 
        timestamp: Date.now() 
      };
      const newHistory = [newAlert, ...user.alertHistory].slice(0, 50);
      const updatedUser = { ...user, alertHistory: newHistory };
      persistUser(updatedUser);
    }
  };

  const clearAlertHistory = () => {
    if (user) {
      const updatedUser = { ...user, alertHistory: [] };
      persistUser(updatedUser);
    }
  };

  const addMessageAnalysis = (log: Omit<MessageAnalysisLog, 'id' | 'timestamp'>) => {
    if (user) {
      const newLog: MessageAnalysisLog = {
        ...log,
        id: Date.now().toString(),
        timestamp: Date.now()
      };
      // Keep last 20 messages
      const newHistory = [newLog, ...(user.messageHistory || [])].slice(0, 20);
      const updatedUser = { ...user, messageHistory: newHistory };
      persistUser(updatedUser);
    }
  };

  const clearMessageHistory = () => {
    if (user) {
      const updatedUser = { ...user, messageHistory: [] };
      persistUser(updatedUser);
    }
  };
  
  const updateMessageHistoryItem = (id: string, result: 'safe' | 'suspicious' | 'scam', explanation: string) => {
      if (user) {
          const updatedHistory = user.messageHistory.map(msg => 
            msg.id === id ? { ...msg, result, explanation, timestamp: Date.now() } : msg
          );
          const updatedUser = { ...user, messageHistory: updatedHistory };
          persistUser(updatedUser);
      }
  };

  const updateSecurityQuestions = (questions: string[]) => {
    if (user) {
        const updatedUser = { ...user, securityQuestions: questions };
        persistUser(updatedUser);
    }
  };

  const updateSOSMessage = (message: string) => {
    if (user) {
        const updatedUser = { ...user, sosMessage: message };
        persistUser(updatedUser);
    }
  };

  const setVoiceProfileStatus = (status: boolean) => {
    if (user) {
        const updatedUser = { ...user, hasVoiceProfile: status };
        persistUser(updatedUser);
    }
  };

  const updateCallHistoryItem = (callId: string, analysis: CallLogItem['aiAnalysis']) => {
    if (user) {
        const updatedHistory = user.callHistory.map(call => 
            call.id === callId ? { ...call, aiAnalysis: analysis } : call
        );
        const updatedUser = { ...user, callHistory: updatedHistory };
        persistUser(updatedUser);
    }
  };

  const regenerateFamilyId = (generateCode: () => string) => {
    if (user) {
        const updated = { 
            ...user, 
            familyId: generateCode(),
            familyCodeTimestamp: Date.now()
        };
        persistUser(updated);
    }
  };

  return {
    addEmergencyContact,
    removeEmergencyContact,
    addFamilyVoiceProfile,
    addAlertToHistory,
    clearAlertHistory,
    addMessageAnalysis,
    clearMessageHistory,
    updateMessageHistoryItem,
    updateSecurityQuestions,
    updateSOSMessage,
    setVoiceProfileStatus,
    updateCallHistoryItem,
    regenerateFamilyId
  };
};
