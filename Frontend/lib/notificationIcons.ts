import { Calendar, FileText, TestTube, Pill, DollarSign, Bell, LucideIcon } from 'lucide-react';

export type NotificationIconKey = 'calendar' | 'fileText' | 'testTube' | 'pill' | 'dollarSign' | 'bell';

export const notificationIconMap: Record<NotificationIconKey, LucideIcon> = {
  calendar: Calendar,
  fileText: FileText,
  testTube: TestTube,
  pill: Pill,
  dollarSign: DollarSign,
  bell: Bell
};
