'use client';

import { Card } from '@/components/ui/card';
import { LoginForm } from '@/components/forms/LoginForm';
import { ChefHat } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

export default function LoginPage() {
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get('returnUrl') ?? '/';

  return (
    <Card className="p-8">
      <div className="mb-8 text-center">
        <div className="mb-4 flex items-center justify-center">
          <ChefHat className="text-primary h-10 w-10" />
        </div>
        <h1 className="text-2xl font-bold">Welcome Back</h1>
        <p className="text-muted-foreground">
          Sign in to your Recipe App account
        </p>
      </div>

      <LoginForm redirectUrl={returnUrl} />

      <div className="mt-6 text-center">
        <p className="text-muted-foreground text-sm">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="text-primary hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </Card>
  );
}
