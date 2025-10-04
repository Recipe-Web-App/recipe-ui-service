import { Card } from '@/components/ui/card';
import { RegisterForm } from '@/components/forms/RegisterForm';
import { ChefHat } from 'lucide-react';
import Link from 'next/link';

export default function RegisterPage() {
  return (
    <Card className="p-8">
      <div className="mb-8 text-center">
        <div className="mb-4 flex items-center justify-center">
          <ChefHat className="text-primary h-10 w-10" />
        </div>
        <h1 className="text-2xl font-bold">Create Your Account</h1>
        <p className="text-muted-foreground">
          Join Recipe App to save and share your favorite recipes
        </p>
      </div>

      <RegisterForm />

      <div className="mt-6 text-center">
        <p className="text-muted-foreground text-sm">
          Already have an account?{' '}
          <Link href="/login" className="text-primary hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </Card>
  );
}
