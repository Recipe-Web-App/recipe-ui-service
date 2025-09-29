export interface AuthorizedUser {
  id: string;
  name: string;
  email: string;
  roles?: string[];
}

// Export all navigation types
export * from './navigation';
