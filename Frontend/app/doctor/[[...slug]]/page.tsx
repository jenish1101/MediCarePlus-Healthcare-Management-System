import { redirect } from 'next/navigation';

export default function DoctorCatchAll() {
  redirect('/doctor/dashboard');
}
