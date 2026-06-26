import React from 'react';
import LegalPageLayout from '@/components/LegalPageLayout';

export const metadata = {
  title: 'Terms of Service | MediCare Plus',
  description: 'Read the terms and conditions for using the MediCare Plus healthcare management platform.'
};

export default function TermsOfServicePage() {
  return (
    <LegalPageLayout title="Terms of Service" lastUpdated="June 26, 2026">
      <section>
        <h2 className="text-xl font-semibold text-gray-900 mb-3">1. Acceptance of Terms</h2>
        <p>
          By accessing or using MediCare Plus, you agree to be bound by these Terms of Service. If you do not
          agree, please do not use our platform. These terms apply to all users including patients, doctors,
          administrators, pharmacists, and lab technicians.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-gray-900 mb-3">2. Description of Service</h2>
        <p>
          MediCare Plus provides a healthcare management platform that enables appointment booking,
          telemedicine consultations, prescription management, pharmacy orders, lab test scheduling, and
          hospital administration tools. The platform is intended to support — not replace — professional
          medical judgment.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-gray-900 mb-3">3. User Accounts</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>You must provide accurate and complete information when creating an account.</li>
          <li>You are responsible for maintaining the confidentiality of your login credentials.</li>
          <li>Patient accounts may be created through self-registration; staff accounts are provisioned by administrators.</li>
          <li>You must notify us immediately of any unauthorized use of your account.</li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-gray-900 mb-3">4. Medical Disclaimer</h2>
        <p>
          MediCare Plus is a technology platform. Information provided through the service is for general
          healthcare management purposes and does not constitute medical advice, diagnosis, or treatment.
          Always seek the advice of a qualified healthcare provider for medical concerns. In case of emergency,
          call 911 or your local emergency number immediately.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-gray-900 mb-3">5. Acceptable Use</h2>
        <p className="mb-3">You agree not to:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Use the platform for any unlawful or fraudulent purpose.</li>
          <li>Attempt to gain unauthorized access to other users&apos; accounts or data.</li>
          <li>Upload false, misleading, or harmful content.</li>
          <li>Interfere with or disrupt the platform&apos;s operation or security.</li>
          <li>Share your account credentials with unauthorized parties.</li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-gray-900 mb-3">6. Appointments &amp; Payments</h2>
        <p>
          Appointment bookings, pharmacy orders, and lab tests are subject to availability and confirmation.
          Fees displayed are estimates; final charges may vary. Cancellation policies apply per service type.
          Refunds, where applicable, are processed according to our billing policies.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-gray-900 mb-3">7. Intellectual Property</h2>
        <p>
          All content, logos, software, and materials on MediCare Plus are owned by us or our licensors. You
          may not copy, modify, distribute, or create derivative works without our written permission.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-gray-900 mb-3">8. Limitation of Liability</h2>
        <p>
          To the fullest extent permitted by law, MediCare Plus shall not be liable for any indirect,
          incidental, special, or consequential damages arising from your use of the platform. Our total
          liability shall not exceed the amount you paid us in the twelve months preceding the claim.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-gray-900 mb-3">9. Termination</h2>
        <p>
          We may suspend or terminate your account if you violate these terms or for other legitimate reasons.
          You may deactivate your account at any time through your profile settings or by contacting support.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-gray-900 mb-3">10. Changes to Terms</h2>
        <p>
          We reserve the right to modify these Terms of Service at any time. Continued use of the platform after
          changes constitutes acceptance of the updated terms. We encourage you to review this page periodically.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-gray-900 mb-3">11. Governing Law</h2>
        <p>
          These terms are governed by the laws of the State of New York, United States, without regard to
          conflict of law principles.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-gray-900 mb-3">12. Contact</h2>
        <p>
          For questions about these Terms of Service, contact us at{' '}
          <a href="mailto:legal@medicareplus.com" className="text-blue-600 hover:underline">
            legal@medicareplus.com
          </a>{' '}
          or 1-800-MEDICARE.
        </p>
      </section>
    </LegalPageLayout>
  );
}
