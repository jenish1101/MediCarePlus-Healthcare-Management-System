export type MedicineCategory = 'all' | 'pain' | 'antibiotic' | 'vitamin' | 'other';

export function getMedicineCategory(name: string): MedicineCategory {
  const n = name.toLowerCase();
  if (n.includes('paracetamol') || n.includes('ibuprofen') || n.includes('aspirin')) return 'pain';
  if (n.includes('amoxicillin') || n.includes('antibiotic')) return 'antibiotic';
  if (n.includes('vitamin')) return 'vitamin';
  return 'other';
}

export function categoryAccentClass(category: MedicineCategory): string {
  const map: Record<MedicineCategory, string> = {
    all: 'from-gray-400 to-gray-500',
    pain: 'from-blue-500 to-indigo-500',
    antibiotic: 'from-amber-500 to-orange-500',
    vitamin: 'from-emerald-500 to-green-500',
    other: 'from-purple-500 to-violet-500'
  };
  return map[category];
}
