'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useLogout } from '@/hooks/auth/useAuth';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalDescription,
  ModalFooter,
} from '@/components/ui/modal';
import { Button } from '@/components/ui/button';

interface LogoutModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LogoutModal({ open, onOpenChange }: LogoutModalProps) {
  const router = useRouter();
  const logoutMutation = useLogout();
  const [isLoading, setIsLoading] = React.useState(false);

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      await logoutMutation.mutateAsync();
      onOpenChange(false);
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalContent size="sm">
        <ModalHeader>
          <ModalTitle>Log Out</ModalTitle>
          <ModalDescription>
            Are you sure you want to log out of your account?
          </ModalDescription>
        </ModalHeader>
        <ModalFooter>
          <Button
            variant="outline"
            disabled={isLoading}
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleLogout}
            disabled={isLoading}
          >
            {isLoading ? 'Logging out...' : 'Log Out'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
