/**
 * useNonce Hook
 *
 * Provides access to the CSP nonce for inline scripts and styles.
 * The nonce is generated per-request by the proxy and passed via headers.
 *
 * Usage:
 * ```tsx
 * const nonce = useNonce();
 * <script nonce={nonce ?? undefined}>...</script>
 * ```
 */

import { headers } from 'next/headers';
import { CUSTOM_HEADERS } from '@/lib/proxy/headers';

/**
 * Get the CSP nonce for the current request
 *
 * This hook reads the nonce from request headers that were set by the proxy.
 * The nonce should be used for inline scripts and styles to satisfy CSP.
 *
 * Note: This is an async Server Component hook (Next.js 15+).
 * For Client Components, you'll need to pass the nonce as a prop from a Server Component.
 *
 * @returns Promise resolving to CSP nonce string or null if not available
 */
export async function useNonce(): Promise<string | null> {
  try {
    const headersList = await headers();
    return headersList.get(CUSTOM_HEADERS.NONCE);
  } catch {
    // headers() can only be called in Server Components
    // Return null in Client Components
    return null;
  }
}
