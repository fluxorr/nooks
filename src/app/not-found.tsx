import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-8">
      <div className="max-w-md w-full text-center">
        <div className="w-16 h-16 mx-auto mb-6 rounded-2xl flex items-center justify-center border border-border bg-surface">
          <span className="text-2xl text-muted">404</span>
        </div>
        <h1 className="text-[20px] font-semibold text-foreground mb-2">
          Page not found
        </h1>
        <p className="text-[14px] text-muted mb-8">
          This page doesn&apos;t exist or has been moved.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-4 py-2.5 text-[14px] font-medium rounded-xl bg-surface border border-border text-foreground hover:bg-accent-light transition-colors"
        >
          Go home
        </Link>
      </div>
    </div>
  );
}
