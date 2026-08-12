export type ThemeColor = 'blue' | 'purple' | 'green' | 'orange' | 'yellow' | 'red' | 'indigo';

export const colorClasses: Record<ThemeColor, { bg100: string; text600: string }> = {
  blue: { bg100: 'bg-blue-100', text600: 'text-blue-600' },
  purple: { bg100: 'bg-purple-100', text600: 'text-purple-600' },
  green: { bg100: 'bg-green-100', text600: 'text-green-600' },
  orange: { bg100: 'bg-orange-100', text600: 'text-orange-600' },
  yellow: { bg100: 'bg-yellow-100', text600: 'text-yellow-600' },
  red: { bg100: 'bg-red-100', text600: 'text-red-600' },
  indigo: { bg100: 'bg-indigo-100', text600: 'text-indigo-600' }
};
