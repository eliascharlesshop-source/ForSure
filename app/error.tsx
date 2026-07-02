'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-foreground">Something went wrong</h1>
        <p className="text-lg text-muted-foreground max-w-md">
          An error occurred while processing your request. Please try again.
        </p>
        {error.digest && (
          <p className="text-sm text-muted-foreground">Error ID: {error.digest}</p>
        )}
      </div>
      <button 
        onClick={() => reset()}
        className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
      >
        Try again
      </button>
    </div>
  );
}
