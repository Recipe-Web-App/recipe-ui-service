'use client';

import * as React from 'react';
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
  const logoutMutation = useLogout();
  const [isLoading, setIsLoading] = React.useState(false);

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      // Clear auth cookies first so middleware allows access to /logged-out
      document.cookie = 'authToken=; path=/; max-age=0';
      document.cookie = 'tokenExpiresAt=; path=/; max-age=0';
      document.cookie = 'refreshToken=; path=/; max-age=0';
      document.cookie = 'userRole=; path=/; max-age=0';
      window.location.href = '/logged-out';
      await logoutMutation.mutateAsync();
      onOpenChange(false);
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
