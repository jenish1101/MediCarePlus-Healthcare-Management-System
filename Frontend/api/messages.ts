import { api } from '@/lib/api';

export interface ChatMessage {
  id: string;
  sender: 'doctor' | 'patient';
  text: string;
  time: string;
}

export interface Conversation {
  id: string;
  patientName: string;
  lastMessage: string;
  lastTime: string;
  unread: number;
  messages: ChatMessage[];
}

export interface BackendChatMessage {
  sender: 'doctor' | 'patient';
  text: string;
  time: string;
}

export interface BackendThread {
  id: string;
  patient_id: string;
  patient_name: string;
  last_message: string;
  last_time: string;
  unread_for_doctor: number;
  unread_for_patient: number;
  messages: BackendChatMessage[];
}

export function mapThread(t: BackendThread): Conversation {
  return {
    id: t.id,
    patientName: t.patient_name,
    lastMessage: t.last_message,
    lastTime: t.last_time,
    unread: t.unread_for_doctor,
    messages: t.messages.map((m, i) => ({
      id: `${t.id}-${i}`,
      sender: m.sender,
      text: m.text,
      time: m.time
    }))
  };
}

/**
 * Doctor only — the backend has no patient-facing messaging endpoint, so
 * there is no equivalent function here for a patient inbox.
 */
export function listMessageThreads() {
  return api.get<BackendThread[]>('/messages');
}

export function sendMessage(threadId: string, text: string) {
  return api.post<BackendThread>(`/messages/${threadId}`, { text });
}
