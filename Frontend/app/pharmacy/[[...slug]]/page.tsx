import { redirect } from 'next/navigation';

export default function PharmacyCatchAll() {
  redirect('/pharmacy/dashboard');
}
