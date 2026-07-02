import {
  AlertCircle,
  Award,
  Briefcase,
  Building2,
  Calendar,
  ClipboardList,
  DollarSign,
  Droplet,
  Heart,
  HeartPulse,
  Mail,
  MapPin,
  Phone,
  Pill,
  Shield,
  Star,
  Stethoscope,
  TestTube,
  Truck,
  User,
  type LucideIcon
} from 'lucide-react';
import { UserRole } from '@/types';

export type ProfileFieldType = 'text' | 'textarea';

export interface ProfileFieldConfig {
  key: string;
  label: string;
  icon: LucideIcon;
  type?: ProfileFieldType;
  span?: 1 | 2;
  readOnly?: boolean;
}

export interface ProfileSectionConfig {
  title: string;
  icon: LucideIcon;
  fields: ProfileFieldConfig[];
}

export interface ProfileStatConfig {
  label: string;
  value: string;
  icon: LucideIcon;
}

export interface ProfileTheme {
  gradient: string;
  accent: string;
  accentLight: string;
  accentText: string;
  ring: string;
}

export interface ProfileConfig {
  roleLabel: string;
  roleIcon: LucideIcon;
  subtitle: string;
  theme: ProfileTheme;
  stats: ProfileStatConfig[];
  sections: ProfileSectionConfig[];
  tags?: string[];
  defaults: Record<string, string>;
}

const themes: Record<UserRole, ProfileTheme> = {
  patient: {
    gradient: 'from-blue-500 via-indigo-500 to-purple-600',
    accent: 'blue',
    accentLight: 'bg-blue-50',
    accentText: 'text-blue-600',
    ring: 'focus:ring-blue-500 focus:border-blue-500'
  },
  doctor: {
    gradient: 'from-violet-500 via-purple-500 to-fuchsia-600',
    accent: 'purple',
    accentLight: 'bg-purple-50',
    accentText: 'text-purple-600',
    ring: 'focus:ring-purple-500 focus:border-purple-500'
  },
  admin: {
    gradient: 'from-orange-500 via-red-500 to-rose-600',
    accent: 'red',
    accentLight: 'bg-red-50',
    accentText: 'text-red-600',
    ring: 'focus:ring-red-500 focus:border-red-500'
  },
  pharmacist: {
    gradient: 'from-emerald-500 via-green-500 to-teal-600',
    accent: 'green',
    accentLight: 'bg-green-50',
    accentText: 'text-green-600',
    ring: 'focus:ring-green-500 focus:border-green-500'
  },
  lab_tech: {
    gradient: 'from-indigo-500 via-purple-500 to-violet-600',
    accent: 'indigo',
    accentLight: 'bg-indigo-50',
    accentText: 'text-indigo-600',
    ring: 'focus:ring-indigo-500 focus:border-indigo-500'
  },
  receptionist: {
    gradient: 'from-teal-500 via-cyan-500 to-sky-600',
    accent: 'teal',
    accentLight: 'bg-teal-50',
    accentText: 'text-teal-600',
    ring: 'focus:ring-teal-500 focus:border-teal-500'
  },
  nurse: {
    gradient: 'from-rose-500 via-pink-500 to-fuchsia-600',
    accent: 'rose',
    accentLight: 'bg-rose-50',
    accentText: 'text-rose-600',
    ring: 'focus:ring-rose-500 focus:border-rose-500'
  },
  supplier: {
    gradient: 'from-amber-500 via-orange-500 to-red-500',
    accent: 'amber',
    accentLight: 'bg-amber-50',
    accentText: 'text-amber-600',
    ring: 'focus:ring-amber-500 focus:border-amber-500'
  }
};

export const profileConfigs: Record<UserRole, ProfileConfig> = {
  patient: {
    roleLabel: 'Patient',
    roleIcon: User,
    subtitle: 'Manage your personal and medical information',
    theme: themes.patient,
    stats: [
      { label: 'Blood Group', value: 'O+', icon: Droplet },
      { label: 'Allergies', value: '2 listed', icon: AlertCircle },
      { label: 'Insurance', value: 'Active', icon: Shield },
      { label: 'Member Since', value: 'Jan 2024', icon: Calendar }
    ],
    sections: [
      {
        title: 'Personal Information',
        icon: Heart,
        fields: [
          { key: 'name', label: 'Full Name', icon: User, span: 2 },
          { key: 'email', label: 'Email', icon: Mail },
          { key: 'phone', label: 'Phone', icon: Phone },
          { key: 'address', label: 'Address', icon: MapPin, span: 2 }
        ]
      },
      {
        title: 'Medical Information',
        icon: Droplet,
        fields: [
          { key: 'bloodGroup', label: 'Blood Group', icon: Droplet },
          { key: 'allergies', label: 'Allergies', icon: AlertCircle },
          { key: 'emergencyContact', label: 'Emergency Contact', icon: Phone },
          { key: 'insurance', label: 'Insurance', icon: Shield }
        ]
      }
    ],
    defaults: {
      name: 'John Patient',
      email: 'patient@demo.com',
      phone: '+1234567890',
      address: '123 Main St, New York, NY 10001',
      bloodGroup: 'O+',
      allergies: 'Penicillin, Pollen',
      emergencyContact: '+1 (555) 987-6543',
      insurance: 'BlueCross Premier #BC-4421-998'
    }
  },
  doctor: {
    roleLabel: 'Doctor',
    roleIcon: Stethoscope,
    subtitle: 'Manage your professional profile and practice details',
    theme: themes.doctor,
    stats: [
      { label: 'Rating', value: '4.8 ★', icon: Star },
      { label: 'Experience', value: '15 years', icon: Briefcase },
      { label: 'Consultation', value: '$500', icon: DollarSign },
      { label: 'Reviews', value: '234', icon: Award }
    ],
    tags: ['MBBS', 'MD Cardiology', 'Fellowship — Interventional Cardiology'],
    sections: [
      {
        title: 'About',
        icon: Stethoscope,
        fields: [
          {
            key: 'about',
            label: 'Professional Bio',
            icon: Stethoscope,
            type: 'textarea',
            span: 2
          }
        ]
      },
      {
        title: 'Contact Information',
        icon: Mail,
        fields: [
          { key: 'name', label: 'Full Name', icon: User, span: 2 },
          { key: 'email', label: 'Email', icon: Mail },
          { key: 'phone', label: 'Phone', icon: Phone },
          { key: 'location', label: 'Location', icon: MapPin, span: 2 }
        ]
      },
      {
        title: 'Professional Details',
        icon: Award,
        fields: [
          { key: 'specialization', label: 'Specialization', icon: Stethoscope },
          { key: 'experience', label: 'Experience', icon: Briefcase },
          { key: 'fees', label: 'Consultation Fee ($)', icon: DollarSign }
        ]
      }
    ],
    defaults: {
      name: 'Dr. Sarah Wilson',
      email: 'doctor@demo.com',
      phone: '+1234567891',
      location: 'New York, NY',
      specialization: 'Cardiology',
      experience: '15 years',
      fees: '500',
      about:
        'Board-certified cardiologist with 15 years of experience in interventional cardiology and preventive heart care.'
    }
  },
  admin: {
    roleLabel: 'Administrator',
    roleIcon: Shield,
    subtitle: 'Manage your hospital administrator account',
    theme: themes.admin,
    stats: [
      { label: 'Access Level', value: 'Full', icon: Shield },
      { label: 'Department', value: 'Admin', icon: Building2 },
      { label: 'Status', value: 'Active', icon: Award },
      { label: 'Member Since', value: 'Dec 2021', icon: Calendar }
    ],
    sections: [
      {
        title: 'Account Information',
        icon: Shield,
        fields: [
          { key: 'name', label: 'Full Name', icon: User, span: 2 },
          { key: 'email', label: 'Email', icon: Mail },
          { key: 'phone', label: 'Phone', icon: Phone },
          { key: 'location', label: 'Location', icon: MapPin },
          { key: 'department', label: 'Department', icon: Building2 },
          { key: 'joined', label: 'Member Since', icon: Calendar, readOnly: true }
        ]
      }
    ],
    defaults: {
      name: 'Admin User',
      email: 'admin@demo.com',
      phone: '+1 (800) 555-0199',
      location: 'New York, NY',
      department: 'Hospital Administration',
      joined: 'December 2021'
    }
  },
  pharmacist: {
    roleLabel: 'Pharmacist',
    roleIcon: Pill,
    subtitle: 'Manage your pharmacy staff profile',
    theme: themes.pharmacist,
    stats: [
      { label: 'Pharmacy', value: 'MediCare+', icon: Building2 },
      { label: 'License', value: 'Active', icon: Pill },
      { label: 'Shift', value: 'Day', icon: Calendar },
      { label: 'Member Since', value: 'Jan 2023', icon: Award }
    ],
    sections: [
      {
        title: 'Account Information',
        icon: Pill,
        fields: [
          { key: 'name', label: 'Full Name', icon: User, span: 2 },
          { key: 'email', label: 'Email', icon: Mail },
          { key: 'phone', label: 'Phone', icon: Phone },
          { key: 'location', label: 'Location', icon: MapPin },
          { key: 'pharmacy', label: 'Pharmacy', icon: Building2 },
          { key: 'license', label: 'License Number', icon: Pill },
          { key: 'joined', label: 'Member Since', icon: Calendar, readOnly: true }
        ]
      }
    ],
    defaults: {
      name: 'Mike Pharmacist',
      email: 'pharmacist@demo.com',
      phone: '+1234567893',
      location: 'New York, NY',
      pharmacy: 'MediCare Plus Pharmacy',
      license: 'PH-998-2231',
      joined: 'January 2023'
    }
  },
  lab_tech: {
    roleLabel: 'Lab Technician',
    roleIcon: TestTube,
    subtitle: 'Manage your laboratory staff profile',
    theme: themes.lab_tech,
    stats: [
      { label: 'Laboratory', value: 'Diagnostics', icon: Building2 },
      { label: 'License', value: 'Active', icon: TestTube },
      { label: 'Tests Today', value: '24', icon: Award },
      { label: 'Member Since', value: 'Mar 2023', icon: Calendar }
    ],
    sections: [
      {
        title: 'Account Information',
        icon: TestTube,
        fields: [
          { key: 'name', label: 'Full Name', icon: User, span: 2 },
          { key: 'email', label: 'Email', icon: Mail },
          { key: 'phone', label: 'Phone', icon: Phone },
          { key: 'location', label: 'Location', icon: MapPin },
          { key: 'lab', label: 'Laboratory', icon: Building2 },
          { key: 'license', label: 'License Number', icon: TestTube },
          { key: 'joined', label: 'Member Since', icon: Calendar, readOnly: true }
        ]
      }
    ],
    defaults: {
      name: 'Lab Technician',
      email: 'lab@demo.com',
      phone: '+1234567894',
      location: 'New York, NY',
      lab: 'MediCare Plus Diagnostics',
      license: 'LT-552-1180',
      joined: 'March 2023'
    }
  },
  receptionist: {
    roleLabel: 'Receptionist',
    roleIcon: ClipboardList,
    subtitle: 'Manage your front desk profile',
    theme: themes.receptionist,
    stats: [
      { label: 'Desk', value: 'Main Lobby', icon: MapPin },
      { label: 'Department', value: 'Front Desk', icon: Building2 },
      { label: 'Status', value: 'On Duty', icon: Award },
      { label: 'Member Since', value: 'Jan 2023', icon: Calendar }
    ],
    sections: [
      {
        title: 'Account Information',
        icon: ClipboardList,
        fields: [
          { key: 'name', label: 'Full Name', icon: User, span: 2 },
          { key: 'email', label: 'Email', icon: Mail },
          { key: 'phone', label: 'Phone', icon: Phone },
          { key: 'location', label: 'Desk Location', icon: MapPin },
          { key: 'department', label: 'Department', icon: Building2 },
          { key: 'joined', label: 'Member Since', icon: Calendar, readOnly: true }
        ]
      }
    ],
    defaults: {
      name: 'Emma Reception',
      email: 'receptionist@demo.com',
      phone: '+1234567895',
      location: 'Main Lobby, Floor 1',
      department: 'Front Desk',
      joined: 'January 2023'
    }
  },
  nurse: {
    roleLabel: 'Registered Nurse',
    roleIcon: HeartPulse,
    subtitle: 'Manage your nursing staff profile',
    theme: themes.nurse,
    stats: [
      { label: 'Ward', value: 'General A', icon: MapPin },
      { label: 'Department', value: 'Nursing', icon: Building2 },
      { label: 'License', value: 'Active', icon: HeartPulse },
      { label: 'Member Since', value: 'Jun 2022', icon: Calendar }
    ],
    sections: [
      {
        title: 'Account Information',
        icon: HeartPulse,
        fields: [
          { key: 'name', label: 'Full Name', icon: User, span: 2 },
          { key: 'email', label: 'Email', icon: Mail },
          { key: 'phone', label: 'Phone', icon: Phone },
          { key: 'location', label: 'Assigned Ward', icon: MapPin },
          { key: 'department', label: 'Department', icon: Building2 },
          { key: 'license', label: 'License Number', icon: HeartPulse },
          { key: 'joined', label: 'Member Since', icon: Calendar, readOnly: true }
        ]
      }
    ],
    defaults: {
      name: 'Lisa Nurse',
      email: 'nurse@demo.com',
      phone: '+1234567896',
      location: 'General Ward A',
      department: 'Nursing',
      license: 'RN-4421-8890',
      joined: 'June 2022'
    }
  },
  supplier: {
    roleLabel: 'Medical Supplier',
    roleIcon: Truck,
    subtitle: 'Manage your supplier partner profile',
    theme: themes.supplier,
    stats: [
      { label: 'Company', value: 'MedSupply', icon: Building2 },
      { label: 'Products', value: '48', icon: Truck },
      { label: 'Status', value: 'Verified', icon: Award },
      { label: 'Partner Since', value: 'Aug 2021', icon: Calendar }
    ],
    sections: [
      {
        title: 'Account Information',
        icon: Truck,
        fields: [
          { key: 'name', label: 'Contact Name', icon: User, span: 2 },
          { key: 'email', label: 'Email', icon: Mail },
          { key: 'phone', label: 'Phone', icon: Phone },
          { key: 'location', label: 'Warehouse Location', icon: MapPin },
          { key: 'company', label: 'Company Name', icon: Building2 },
          { key: 'taxId', label: 'Tax ID', icon: Truck },
          { key: 'joined', label: 'Partner Since', icon: Calendar, readOnly: true }
        ]
      }
    ],
    defaults: {
      name: 'Supply Co.',
      email: 'supplier@demo.com',
      phone: '+1234567897',
      location: 'Industrial Park, Zone B',
      company: 'MedSupply International',
      taxId: 'TAX-8842-9910',
      joined: 'August 2021'
    }
  }
};

export function getProfileConfig(role: UserRole): ProfileConfig {
  return profileConfigs[role];
}
