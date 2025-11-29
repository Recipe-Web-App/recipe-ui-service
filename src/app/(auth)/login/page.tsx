'use client';

import { Card } from '@/components/ui/card';
import { LoginForm } from '@/components/forms/LoginForm';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ChefHat } from 'lucide-react';

export default function LoginPage() {
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get('returnUrl') ?? '/';

  return (
    <Card className="p-8">
      <div className="mb-8 text-center">
        <div className="mb-4 flex flex-col items-center justify-center space-y-4">
          <div className="flex items-center gap-3">
            <ChefHat className="text-primary h-8 w-8" />
            <span className="text-2xl font-bold tracking-tight">Sous Chef</span>
            <ChefHat className="text-primary h-8 w-8" />
          </div>
          <Image
            src="/site-logo.webp"
            alt="Sous Chef Logo"
            width={180}
            height={180}
            unoptimized
          />
        </div>
        <h1 className="text-2xl font-bold">Welcome Back</h1>
        <p className="text-muted-foreground">
          Sign in to your Sous Chef account
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
