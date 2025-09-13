import { act } from '@testing-library/react';
import { useModalStore } from '@/stores/ui/modal-store';
import type { Modal } from '@/types/ui/modal';

// Mock document methods
const mockBodyStyle = { overflow: '' };
const mockAddEventListener = jest.fn();
const mockRemoveEventListener = jest.fn();

// Mock document
Object.defineProperty(document, 'body', {
  value: { style: mockBodyStyle },
  writable: true,
  configurable: true,
});

Object.defineProperty(document, 'addEventListener', {
  value: mockAddEventListener,
  writable: true,
  configurable: true,
});

Object.defineProperty(document, 'removeEventListener', {
  value: mockRemoveEventListener,
  writable: true,
  configurable: true,
});

describe('useModalStore', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockBodyStyle.overflow = '';
    // Reset store state
    useModalStore.setState({
      modals: [],
      activeModalId: null,
      backdropClickClose: true,
    });
  });

  afterEach(() => {
    // Clean up any remaining modals and restore body scroll
    act(() => {
      useModalStore.getState().closeAllModals();
    });
  });

  describe('initial state', () => {
    it('should have correct initial state', () => {
      const state = useModalStore.getState();

      expect(state.modals).toEqual([]);
      expect(state.activeModalId).toBeNull();
      expect(state.backdropClickClose).toBe(true);
    });
  });

  describe('openModal', () => {
    it('should open a modal with generated ID and default properties', () => {
      const modalData = {
        type: 'confirmation' as const,
        title: 'Test Modal',
        content: 'Test content',
      };

      let modalId: string;
      act(() => {
        modalId = useModalStore.getState().openModal(modalData);
      });

      const state = useModalStore.getState();
      expect(modalId!).toBeDefined();
      expect(modalId!).toMatch(/^modal-\d+-[a-z0-9]+$/);
      expect(state.modals).toHaveLength(1);
      expect(state.activeModalId).toBe(modalId!);

      const modal = state.modals[0];
      expect(modal).toMatchObject({
        id: modalId!,
        type: 'confirmation',
        title: 'Test Modal',
        content: 'Test content',
        closeable: true,
        closeOnBackdrop: true,
        closeOnEscape: true,
      });
      expect(modal.zIndex).toBe(1000);
    });

    it('should set correct z-index for multiple modals', () => {
      const modalData = {
        type: 'info' as const,
        title: 'Modal',
        content: 'Content',
      };

      let modal1Id: string;
      let modal2Id: string;
      act(() => {
        modal1Id = useModalStore.getState().openModal(modalData);
        modal2Id = useModalStore.getState().openModal(modalData);
      });

      const state = useModalStore.getState();
      expect(state.modals[0].zIndex).toBe(1000);
      expect(state.modals[1].zIndex).toBe(1001);
      expect(state.activeModalId).toBe(modal2Id!);
    });

    it('should lock body scroll when first modal opens', () => {
      act(() => {
        useModalStore.getState().openModal({
          type: 'info' as const,
          title: 'Test',
          content: 'Test',
        });
      });

      expect(mockBodyStyle.overflow).toBe('hidden');
    });

    it('should set up escape key handler when closeOnEscape is true', () => {
      act(() => {
        useModalStore.getState().openModal({
          type: 'info' as const,
          title: 'Test',
          content: 'Test',
          closeOnEscape: true,
        });
      });

      expect(mockAddEventListener).toHaveBeenCalledWith(
        'keydown',
        expect.any(Function)
      );
    });

    it('should not set up escape key handler when closeOnEscape is false', () => {
      act(() => {
        useModalStore.getState().openModal({
          type: 'info' as const,
          title: 'Test',
          content: 'Test',
          closeOnEscape: false,
        });
      });

      expect(mockAddEventListener).not.toHaveBeenCalled();
    });

    it('should override default properties with provided values', () => {
      const modalData = {
        type: 'form' as const,
        title: 'Custom Modal',
        content: 'Custom content',
        size: 'lg' as const,
        closeable: false,
        closeOnBackdrop: false,
        closeOnEscape: false,
      };

      act(() => {
        useModalStore.getState().openModal(modalData);
      });

      const modal = useModalStore.getState().modals[0];
      expect(modal.closeable).toBe(false);
      expect(modal.closeOnBackdrop).toBe(false);
      expect(modal.closeOnEscape).toBe(false);
      expect(modal.size).toBe('lg');
    });
  });

  describe('closeModal', () => {
    it('should close modal by ID', () => {
      let modalId: string;
      act(() => {
        modalId = useModalStore.getState().openModal({
          type: 'info' as const,
          title: 'Test',
          content: 'Test',
        });
      });

      act(() => {
        useModalStore.getState().closeModal(modalId!);
      });

      const state = useModalStore.getState();
      expect(state.modals).toHaveLength(0);
      expect(state.activeModalId).toBeNull();
    });

    it('should close active modal when no ID provided', () => {
      act(() => {
        useModalStore.getState().openModal({
          type: 'info' as const,
          title: 'Test',
          content: 'Test',
        });
      });

      act(() => {
        useModalStore.getState().closeModal();
      });

      const state = useModalStore.getState();
      expect(state.modals).toHaveLength(0);
      expect(state.activeModalId).toBeNull();
    });

    it('should update active modal when closing non-top modal', () => {
      let modal1Id: string;
      let modal2Id: string;
      act(() => {
        modal1Id = useModalStore.getState().openModal({
          type: 'info' as const,
          title: 'Modal 1',
          content: 'Content 1',
        });
        modal2Id = useModalStore.getState().openModal({
          type: 'info' as const,
          title: 'Modal 2',
          content: 'Content 2',
        });
      });

      expect(useModalStore.getState().activeModalId).toBe(modal2Id!);

      act(() => {
        useModalStore.getState().closeModal(modal1Id!);
      });

      const state = useModalStore.getState();
      expect(state.modals).toHaveLength(1);
      expect(state.activeModalId).toBe(modal2Id!);
    });

    it('should restore body scroll when no modals remain', () => {
      act(() => {
        useModalStore.getState().openModal({
          type: 'info' as const,
          title: 'Test',
          content: 'Test',
        });
      });

      expect(mockBodyStyle.overflow).toBe('hidden');

      act(() => {
        useModalStore.getState().closeModal();
      });

      expect(mockBodyStyle.overflow).toBe('');
    });

    it('should do nothing when trying to close non-existent modal', () => {
      act(() => {
        useModalStore.getState().closeModal('non-existent-id');
      });

      const state = useModalStore.getState();
      expect(state.modals).toHaveLength(0);
      expect(state.activeModalId).toBeNull();
    });
  });

  describe('closeAllModals', () => {
    it('should close all modals and reset state', () => {
      act(() => {
        useModalStore.getState().openModal({
          type: 'info' as const,
          title: 'Modal 1',
          content: 'Content 1',
        });
        useModalStore.getState().openModal({
          type: 'info' as const,
          title: 'Modal 2',
          content: 'Content 2',
        });
      });

      expect(useModalStore.getState().modals).toHaveLength(2);

      act(() => {
        useModalStore.getState().closeAllModals();
      });

      const state = useModalStore.getState();
      expect(state.modals).toHaveLength(0);
      expect(state.activeModalId).toBeNull();
      expect(mockBodyStyle.overflow).toBe('');
    });
  });

  describe('updateModal', () => {
    it('should update modal properties', () => {
      let modalId: string;
      act(() => {
        modalId = useModalStore.getState().openModal({
          type: 'info' as const,
          title: 'Original Title',
          content: 'Original Content',
        });
      });

      act(() => {
        useModalStore.getState().updateModal(modalId!, {
          title: 'Updated Title',
          content: 'Updated Content',
          size: 'lg',
        });
      });

      const modal = useModalStore.getState().getModalById(modalId!);
      expect(modal?.title).toBe('Updated Title');
      expect(modal?.content).toBe('Updated Content');
      expect(modal?.size).toBe('lg');
    });

    it('should not affect other modals', () => {
      let modal1Id: string;
      let modal2Id: string;
      act(() => {
        modal1Id = useModalStore.getState().openModal({
          type: 'info' as const,
          title: 'Modal 1',
          content: 'Content 1',
        });
        modal2Id = useModalStore.getState().openModal({
          type: 'info' as const,
          title: 'Modal 2',
          content: 'Content 2',
        });
      });

      act(() => {
        useModalStore
          .getState()
          .updateModal(modal1Id!, { title: 'Updated Modal 1' });
      });

      const modal1 = useModalStore.getState().getModalById(modal1Id!);
      const modal2 = useModalStore.getState().getModalById(modal2Id!);

      expect(modal1?.title).toBe('Updated Modal 1');
      expect(modal2?.title).toBe('Modal 2');
    });
  });

  describe('setActiveModal', () => {
    it('should set active modal when modal exists', () => {
      let modal1Id: string;
      let modal2Id: string;
      act(() => {
        modal1Id = useModalStore.getState().openModal({
          type: 'info' as const,
          title: 'Modal 1',
          content: 'Content 1',
        });
        modal2Id = useModalStore.getState().openModal({
          type: 'info' as const,
          title: 'Modal 2',
          content: 'Content 2',
        });
      });

      expect(useModalStore.getState().activeModalId).toBe(modal2Id!);

      act(() => {
        useModalStore.getState().setActiveModal(modal1Id!);
      });

      expect(useModalStore.getState().activeModalId).toBe(modal1Id!);
    });

    it('should not set active modal when modal does not exist', () => {
      let modalId: string;
      act(() => {
        modalId = useModalStore.getState().openModal({
          type: 'info' as const,
          title: 'Modal',
          content: 'Content',
        });
      });

      act(() => {
        useModalStore.getState().setActiveModal('non-existent-id');
      });

      expect(useModalStore.getState().activeModalId).toBe(modalId!);
    });

    it('should set active modal to null', () => {
      act(() => {
        useModalStore.getState().openModal({
          type: 'info' as const,
          title: 'Modal',
          content: 'Content',
        });
      });

      act(() => {
        useModalStore.getState().setActiveModal(null);
      });

      expect(useModalStore.getState().activeModalId).toBeNull();
    });
  });

  describe('utility methods', () => {
    describe('getTopModal', () => {
      it('should return the most recently opened modal', () => {
        let modal1Id: string;
        let modal2Id: string;
        act(() => {
          modal1Id = useModalStore.getState().openModal({
            type: 'info' as const,
            title: 'Modal 1',
            content: 'Content 1',
          });
          modal2Id = useModalStore.getState().openModal({
            type: 'info' as const,
            title: 'Modal 2',
            content: 'Content 2',
          });
        });

        const topModal = useModalStore.getState().getTopModal();
        expect(topModal?.id).toBe(modal2Id!);
        expect(topModal?.title).toBe('Modal 2');
      });

      it('should return null when no modals are open', () => {
        expect(useModalStore.getState().getTopModal()).toBeNull();
      });
    });

    describe('getModalById', () => {
      it('should return modal by ID', () => {
        let modalId: string;
        act(() => {
          modalId = useModalStore.getState().openModal({
            type: 'info' as const,
            title: 'Test Modal',
            content: 'Test Content',
          });
        });

        const modal = useModalStore.getState().getModalById(modalId!);
        expect(modal?.id).toBe(modalId!);
        expect(modal?.title).toBe('Test Modal');
      });

      it('should return undefined for non-existent modal', () => {
        expect(
          useModalStore.getState().getModalById('non-existent')
        ).toBeUndefined();
      });
    });

    describe('isModalOpen', () => {
      it('should return true when modal is open', () => {
        let modalId: string;
        act(() => {
          modalId = useModalStore.getState().openModal({
            type: 'info' as const,
            title: 'Test',
            content: 'Test',
          });
        });

        expect(useModalStore.getState().isModalOpen(modalId!)).toBe(true);
      });

      it('should return false when modal is not open', () => {
        expect(useModalStore.getState().isModalOpen('non-existent')).toBe(
          false
        );
      });
    });

    describe('getModalCount', () => {
      it('should return correct modal count', () => {
        expect(useModalStore.getState().getModalCount()).toBe(0);

        act(() => {
          useModalStore.getState().openModal({
            type: 'info' as const,
            title: 'Modal 1',
            content: 'Content 1',
          });
        });

        expect(useModalStore.getState().getModalCount()).toBe(1);

        act(() => {
          useModalStore.getState().openModal({
            type: 'info' as const,
            title: 'Modal 2',
            content: 'Content 2',
          });
        });

        expect(useModalStore.getState().getModalCount()).toBe(2);
      });
    });

    describe('hasOpenModals', () => {
      it('should return true when modals are open', () => {
        act(() => {
          useModalStore.getState().openModal({
            type: 'info' as const,
            title: 'Test',
            content: 'Test',
          });
        });

        expect(useModalStore.getState().hasOpenModals()).toBe(true);
      });

      it('should return false when no modals are open', () => {
        expect(useModalStore.getState().hasOpenModals()).toBe(false);
      });
    });

    describe('getModalStack', () => {
      it('should return copy of modal array', () => {
        act(() => {
          useModalStore.getState().openModal({
            type: 'info' as const,
            title: 'Modal 1',
            content: 'Content 1',
          });
          useModalStore.getState().openModal({
            type: 'info' as const,
            title: 'Modal 2',
            content: 'Content 2',
          });
        });

        const state = useModalStore.getState();
        const stack = state.getModalStack();
        expect(stack).toHaveLength(2);
        expect(stack).not.toBe(state.modals); // Should be a copy
        expect(stack[0].title).toBe('Modal 1');
        expect(stack[1].title).toBe('Modal 2');
      });
    });
  });

  describe('setBackdropClickClose', () => {
    it('should update backdrop click close setting', () => {
      expect(useModalStore.getState().backdropClickClose).toBe(true);

      act(() => {
        useModalStore.getState().setBackdropClickClose(false);
      });

      expect(useModalStore.getState().backdropClickClose).toBe(false);

      act(() => {
        useModalStore.getState().setBackdropClickClose(true);
      });

      expect(useModalStore.getState().backdropClickClose).toBe(true);
    });
  });
});
