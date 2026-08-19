'use client';

import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';

export default function ReCaptchaWrapper({ children }: { children: React.ReactNode }) {
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || 'dummy_site_key';

  return (
    <GoogleReCaptchaProvider reCaptchaKey={siteKey}>
      {children}
    </GoogleReCaptchaProvider>
  );
}
