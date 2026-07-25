'use client';

import { useEffect, useState } from 'react';
import { SignIn } from '@clerk/nextjs';
import Link from 'next/link';

export default function SignInPage() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    setIsDark(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsDark(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  return (
    <main className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link href="/" className="text-lg font-medium text-foreground hover:opacity-80 transition-opacity">
            nooks
          </Link>
        </div>
        <SignIn
          path="/sign-in"
          appearance={{
            elements: {
              card: 'bg-surface border border-border shadow-none rounded-2xl',
              headerTitle: 'text-foreground text-xl font-semibold tracking-tight',
              headerSubtitle: 'text-muted text-sm',
              socialButtonsBlockButton:
                'border border-border rounded-lg hover:bg-surface-alt text-foreground text-sm font-medium transition-colors',
              socialButtonsBlockButtonText: 'text-foreground',
              dividerLine: 'bg-border',
              dividerText: 'text-muted text-xs',
              formFieldLabel: 'text-foreground text-sm',
              formFieldInput:
                'rounded-lg border border-border bg-background text-foreground placeholder:text-foreground-subtle text-sm',
              formFieldInputRoot: 'bg-background',
              formFieldError: 'text-red-500 text-xs mt-1',
              formButtonPrimary:
                'rounded-lg bg-accent text-background hover:bg-accent-hover text-sm font-medium transition-colors',
              footerActionText: 'text-muted text-sm',
              footerActionLink: 'text-foreground hover:underline text-sm',
              identityPreviewText: 'text-foreground text-sm',
              identityPreviewEditButton: 'text-foreground text-sm',
              otpCodeFieldInput:
                'rounded-lg border border-border bg-background text-foreground text-lg text-center',
              formResendCodeLink: 'text-foreground hover:underline text-sm',
              formHeaderAction: 'text-foreground',
              alert: 'rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-sm',
              rootBox: 'w-full',
            },
            variables: {
              colorBackground: isDark ? '#252525' : '#ffffff',
              colorNeutral: isDark ? '#333333' : '#e9e9e7',
              colorText: isDark ? '#ebebeb' : '#37352f',
              colorTextSecondary: isDark ? '#6b6b6b' : '#6b6b6b',
              colorInputBackground: isDark ? '#1c1c1c' : '#ffffff',
              colorInputText: isDark ? '#ebebeb' : '#37352f',
              colorPrimary: isDark ? '#ebebeb' : '#37352f',
              borderRadius: '0.625rem',
            },
          }}
          signUpUrl="/sign-up"
        />
      </div>
    </main>
  );
}
