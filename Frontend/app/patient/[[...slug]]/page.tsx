import { redirect } from 'next/navigation';

export default function PatientCatchAll() {
  redirect('/patient/dashboard');
}
