// Modal Types
export type ModalType = 'confirmation' | 'info' | 'form' | 'fullscreen';
export type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

export interface ModalAction {
  label: string;
  onClick: () => void | Promise<void>;
  variant?: 'primary' | 'secondary' | 'danger';
  disabled?: boolean;
  loading?: boolean;
}

export interface Modal {
  id: string;
  type: ModalType;
  title: string;
  content: React.ReactNode | string;
  size?: ModalSize;
  actions?: ModalAction[];
  closeable?: boolean;
  closeOnBackdrop?: boolean;
  closeOnEscape?: boolean;
  zIndex?: number;
}

export interface ModalState {
  modals: Modal[];
  activeModalId: string | null;
  backdropClickClose: boolean;
}

// Store interface with all actions
export interface ModalStoreState extends ModalState {
  // Modal management actions
  openModal: (modal: Omit<Modal, 'id'>) => string;
  closeModal: (id?: string) => void;
  closeAllModals: () => void;
  updateModal: (id: string, updates: Partial<Modal>) => void;
  setActiveModal: (id: string | null) => void;

  // Modal stack management
  getTopModal: () => Modal | null;
  getModalById: (id: string) => Modal | undefined;
  isModalOpen: (id: string) => boolean;
  getModalCount: () => number;

  // Configuration actions
  setBackdropClickClose: (enabled: boolean) => void;

  // Utility methods
  hasOpenModals: () => boolean;
  getModalStack: () => Modal[];
}
