import React from 'react';
import LegalPageLayout from '@/components/LegalPageLayout';

export const metadata = {
  title: 'Privacy Policy | MediCare Plus',
  description: 'Learn how MediCare Plus collects, uses, and protects your personal and health information.'
};

export default function PrivacyPolicyPage() {
  return (
    <LegalPageLayout title="Privacy Policy" lastUpdated="June 26, 2026">
      <section>
        <h2 className="text-xl font-semibold text-gray-900 mb-3">1. Introduction</h2>
        <p>
          MediCare Plus (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) is committed to protecting your privacy. This Privacy Policy
          explains how we collect, use, disclose, and safeguard your information when you use our healthcare
          management platform, including our website, patient portal, and related services.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-gray-900 mb-3">2. Information We Collect</h2>
        <p className="mb-3">We may collect the following types of information:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Personal information:</strong> Name, email address, phone number, and account credentials.</li>
          <li><strong>Health information:</strong> Medical records, prescriptions, lab reports, appointment history, and related health data you provide or that is entered by healthcare providers.</li>
          <li><strong>Usage data:</strong> Pages visited, features used, device type, browser, and IP address.</li>
          <li><strong>Payment information:</strong> Billing details for pharmacy orders and appointments (processed securely through third-party providers).</li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-gray-900 mb-3">3. How We Use Your Information</h2>
        <p className="mb-3">We use your information to:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Provide and manage appointments, telemedicine, pharmacy, and lab services.</li>
          <li>Maintain your health records and enable communication with doctors and care teams.</li>
          <li>Send appointment reminders, notifications, and service updates.</li>
          <li>Improve our platform, security, and user experience.</li>
          <li>Comply with legal obligations and protect against fraud or abuse.</li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-gray-900 mb-3">4. Sharing of Information</h2>
        <p>
          We do not sell your personal or health information. We may share data only with authorized healthcare
          providers involved in your care, hospital administrators where applicable, payment processors, and
          service providers who assist our operations under strict confidentiality agreements. We may also
          disclose information when required by law.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-gray-900 mb-3">5. Data Security</h2>
        <p>
          We implement industry-standard security measures including encryption, access controls, and secure
          authentication to protect your data. While we strive to safeguard your information, no method of
          transmission over the internet is 100% secure.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-gray-900 mb-3">6. Your Rights</h2>
        <p className="mb-3">Depending on your location, you may have the right to:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Access and receive a copy of your personal data.</li>
          <li>Request correction of inaccurate information.</li>
          <li>Request deletion of your account and associated data.</li>
          <li>Opt out of non-essential marketing communications.</li>
        </ul>
        <p className="mt-3">
          To exercise these rights, contact us at{' '}
          <a href="mailto:privacy@medicareplus.com" className="text-blue-600 hover:underline">
            privacy@medicareplus.com
          </a>.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-gray-900 mb-3">7. Cookies &amp; Local Storage</h2>
        <p>
          We use cookies and local storage to keep you signed in and remember your preferences. You can control
          cookies through your browser settings, though some features may not function properly if cookies are
          disabled.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-gray-900 mb-3">8. Children&apos;s Privacy</h2>
        <p>
          Our services are not intended for children under 13 without parental consent. We do not knowingly
          collect personal information from children without appropriate authorization.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-gray-900 mb-3">9. Changes to This Policy</h2>
        <p>
          We may update this Privacy Policy from time to time. We will notify you of material changes by
          posting the updated policy on this page and updating the &quot;Last updated&quot; date.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-gray-900 mb-3">10. Contact Us</h2>
        <p>
          If you have questions about this Privacy Policy, please contact us at{' '}
          <a href="mailto:privacy@medicareplus.com" className="text-blue-600 hover:underline">
            privacy@medicareplus.com
          </a>{' '}
          or call 1-800-MEDICARE.
        </p>
      </section>
    </LegalPageLayout>
  );
}
