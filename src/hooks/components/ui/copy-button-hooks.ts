import * as React from 'react';
import type {
  CopyStatus,
  CopyResult,
  ClipboardSupport,
  CopyContext,
  UseCopyButtonReturn,
} from '@/types/ui/copy-button';

/**
 * Detect clipboard API support
 */
const detectClipboardSupport = (): ClipboardSupport => {
  if (typeof window === 'undefined') {
    return {
      modern: false,
      legacy: false,
      writeText: false,
      readText: false,
      writeHtml: false,
    };
  }

  const modern = Boolean(navigator.clipboard);
  const legacy = Boolean(document.execCommand);
  const writeText =
    modern && typeof navigator.clipboard.writeText === 'function';
  const readText = modern && typeof navigator.clipboard.readText === 'function';
  const writeHtml = modern && typeof navigator.clipboard.write === 'function';

  return {
    modern,
    legacy,
    writeText,
    readText,
    writeHtml,
  };
};

/**
 * Custom hook for copy functionality
 */
export const useCopyButton = (): UseCopyButtonReturn => {
  const [status, setStatus] = React.useState<CopyStatus>('idle');
  const [error, setError] = React.useState<Error | null>(null);
  const [lastResult, setLastResult] = React.useState<CopyResult | null>(null);
  const [isHydrated, setIsHydrated] = React.useState(false);

  // Use hydration-safe clipboard support detection
  const support = React.useMemo(() => {
    // During SSR, assume modern clipboard support to match expected client behavior
    if (!isHydrated) {
      return {
        modern: true,
        legacy: true,
        writeText: true,
        readText: false,
        writeHtml: false,
      };
    }
    return detectClipboardSupport();
  }, [isHydrated]);

  // Detect hydration completion
  React.useEffect(() => {
    setIsHydrated(true);
  }, []);

  const context: CopyContext = React.useMemo(
    () => ({
      support,
      lastResult,
      isSecureContext: isHydrated ? window.isSecureContext : true, // Assume secure context during SSR
      userAgent: isHydrated ? navigator.userAgent : '',
    }),
    [support, lastResult, isHydrated]
  );

  const copyToClipboard = React.useCallback(
    async (content?: string): Promise<CopyResult> => {
      if (!content) {
        const error = new Error('No content provided to copy');
        setError(error);
        setStatus('error');
        return {
          success: false,
          error,
          timestamp: Date.now(),
        };
      }

      setStatus('copying');
      setError(null);

      try {
        let method: 'clipboard' | 'execCommand' | 'fallback' = 'clipboard';

        // Try modern clipboard API first
        if (support.writeText && context.isSecureContext) {
          await navigator.clipboard.writeText(content);
        } else if (support.legacy) {
          // Fallback to execCommand
          method = 'execCommand';
          const textArea = document.createElement('textarea');
          textArea.value = content;
          textArea.style.position = 'fixed';
          textArea.style.opacity = '0';
          textArea.style.pointerEvents = 'none';
          document.body.appendChild(textArea);
          textArea.select();
          textArea.setSelectionRange(0, content.length);

          const success = document.execCommand('copy');
          document.body.removeChild(textArea);

          if (!success) {
            throw new Error('execCommand copy failed');
          }
        } else {
          // No clipboard support available
          method = 'fallback';
          throw new Error('Clipboard not supported in this environment');
        }

        const result: CopyResult = {
          success: true,
          content,
          method,
          timestamp: Date.now(),
        };

        setLastResult(result);
        setStatus('success');
        return result;
      } catch (err) {
        const error =
          err instanceof Error ? err : new Error('Copy operation failed');
        const result: CopyResult = {
          success: false,
          error,
          timestamp: Date.now(),
        };

        setError(error);
        setLastResult(result);
        setStatus('error');
        return result;
      }
    },
    [support, context.isSecureContext]
  );

  const resetStatus = React.useCallback(() => {
    setStatus('idle');
    setError(null);
  }, []);

  const isSupported = support.modern || support.legacy;

  return {
    copyToClipboard,
    status,
    error,
    isSupported,
    context,
    resetStatus,
  };
};
