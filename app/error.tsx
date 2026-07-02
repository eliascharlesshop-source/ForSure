'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';

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
      <Button onClick={() => reset()}>Try again</Button>
    </div>
  );
}
