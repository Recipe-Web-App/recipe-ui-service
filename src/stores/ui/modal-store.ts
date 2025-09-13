import { create } from 'zustand';
import type { ModalStoreState, Modal } from '@/types/ui/modal';

const generateModalId = (): string => {
  return `modal-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

const BASE_Z_INDEX = 1000;

export const useModalStore = create<ModalStoreState>((set, get) => ({
  modals: [],
  activeModalId: null,
  backdropClickClose: true,

  openModal: (modalData: Omit<Modal, 'id'>) => {
    const id = generateModalId();
    const zIndex = BASE_Z_INDEX + get().modals.length;

    const modal: Modal = {
      id,
      zIndex,
      closeable: true,
      closeOnBackdrop: true,
      closeOnEscape: true,
      ...modalData,
    };

    set(state => ({
      modals: [...state.modals, modal],
      activeModalId: id,
    }));

    // Set up escape key handler if enabled
    if (modal.closeOnEscape) {
      const handleEscape = (event: KeyboardEvent) => {
        if (event.key === 'Escape' && get().activeModalId === id) {
          get().closeModal(id);
        }
      };

      document.addEventListener('keydown', handleEscape);

      // Store the cleanup function on the modal for later removal
      setTimeout(() => {
        const currentModal = get().getModalById(id);
        if (currentModal) {
          (
            currentModal as Modal & {
              _escapeHandler?: (event: KeyboardEvent) => void;
            }
          )._escapeHandler = handleEscape;
        }
      }, 0);
    }

    // Lock body scroll when modal opens
    if (get().modals.length === 1) {
      document.body.style.overflow = 'hidden';
    }

    return id;
  },

  closeModal: (id?: string) => {
    const targetId = id ?? get().activeModalId;
    if (!targetId) return;

    set(state => {
      const modalIndex = state.modals.findIndex(modal => modal.id === targetId);
      if (modalIndex === -1) return state;

      // eslint-disable-next-line security/detect-object-injection
      const modal = state.modals[modalIndex];
      const newModals = state.modals.filter(m => m.id !== targetId);

      // Clean up escape key handler
      const modalWithHandler = modal as Modal & {
        _escapeHandler?: (event: KeyboardEvent) => void;
      };
      if (modalWithHandler._escapeHandler) {
        document.removeEventListener(
          'keydown',
          modalWithHandler._escapeHandler
        );
      }

      // Update active modal to the top modal or null
      const newActiveModalId =
        newModals.length > 0
          ? (newModals[newModals.length - 1]?.id ?? null)
          : null;

      return {
        modals: newModals,
        activeModalId: newActiveModalId,
      };
    });

    // Restore body scroll when no modals are open
    if (get().modals.length === 0) {
      document.body.style.overflow = '';
    }
  },

  closeAllModals: () => {
    // Clean up all escape handlers
    get().modals.forEach(modal => {
      const modalWithHandler = modal as Modal & {
        _escapeHandler?: (event: KeyboardEvent) => void;
      };
      if (modalWithHandler._escapeHandler) {
        document.removeEventListener(
          'keydown',
          modalWithHandler._escapeHandler
        );
      }
    });

    set({
      modals: [],
      activeModalId: null,
    });

    // Restore body scroll
    document.body.style.overflow = '';
  },

  updateModal: (id: string, updates: Partial<Modal>) => {
    set(state => ({
      modals: state.modals.map(modal =>
        modal.id === id ? { ...modal, ...updates } : modal
      ),
    }));
  },

  setActiveModal: (id: string | null) => {
    if (id && !get().isModalOpen(id)) return;

    set({ activeModalId: id });
  },

  getTopModal: () => {
    const modals = get().modals;
    return modals.length > 0 ? modals[modals.length - 1] : null;
  },

  getModalById: (id: string) => {
    return get().modals.find(modal => modal.id === id);
  },

  isModalOpen: (id: string) => {
    return get().modals.some(modal => modal.id === id);
  },

  getModalCount: () => {
    return get().modals.length;
  },

  setBackdropClickClose: (enabled: boolean) => {
    set({ backdropClickClose: enabled });
  },

  hasOpenModals: () => {
    return get().modals.length > 0;
  },

  getModalStack: () => {
    return [...get().modals];
  },
}));
