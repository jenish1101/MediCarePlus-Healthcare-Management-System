import { UserRole } from '@/types';
import LoginForm from './LoginForm';

const validRoles: UserRole[] = [
  'patient',
  'doctor',
  'admin',
  'receptionist',
  'pharmacist',
  'lab_tech',
  'nurse',
  'supplier'
];

export default async function LoginPage({
  searchParams
}: {
  searchParams: Promise<{ role?: string }>;
}) {
  const { role } = await searchParams;
  const initialRole: UserRole =
    role && validRoles.includes(role as UserRole) ? (role as UserRole) : 'patient';

  return <LoginForm initialRole={initialRole} />;
}
