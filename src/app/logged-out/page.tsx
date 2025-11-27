'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, ChefHat, Home, LogIn } from 'lucide-react';
import Link from 'next/link';

export default function LoggedOutPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md p-8">
        <div className="mb-8 text-center">
          <div className="mb-4 flex items-center justify-center">
            <div className="bg-success/10 text-success rounded-full p-3">
              <CheckCircle className="h-10 w-10" />
            </div>
          </div>
          <h1 className="mb-2 text-2xl font-bold">
            You&apos;ve Been Logged Out
          </h1>
          <p className="text-muted-foreground">
            You have successfully signed out of your Recipe App account.
          </p>
        </div>

        <div className="space-y-3">
          <Link href="/login" className="block">
            <Button className="w-full" size="lg">
              <LogIn className="mr-2 h-4 w-4" />
              Sign In Again
            </Button>
          </Link>

          <Link href="/" className="block">
            <Button variant="outline" className="w-full" size="lg">
              <Home className="mr-2 h-4 w-4" />
              Go to Home
            </Button>
          </Link>
        </div>

        <div className="mt-8 text-center">
          <div className="mb-3 flex items-center justify-center">
            <ChefHat className="text-muted-foreground h-6 w-6" />
          </div>
          <p className="text-muted-foreground text-xs">
            Thank you for using Recipe App
          </p>
        </div>
      </Card>
    </div>
  );
}
