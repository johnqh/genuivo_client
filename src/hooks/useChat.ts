import { useCallback } from 'react';
import { useMutation } from '@tanstack/react-query';
import type {
  BaseResponse,
  ChatRequest,
  ChatResponse,
  Optional,
} from '@sudobility/genuivo_types';
import type { FirebaseIdToken } from '../types';
import { getStarterClient } from '../network/client-singleton';

/**
 * Return type for the {@link useChat} hook.
 */
export interface UseChatReturn {
  /** Sends a chat request to the AI endpoint. */
  chat: (request: string) => Promise<BaseResponse<ChatResponse>>;
  /** Whether a chat request is currently in progress. */
  isLoading: boolean;
  /** An error message if the mutation failed, or `null`. */
  error: Optional<string>;
  /** Resets the error state. */
  clearError: () => void;
}

/**
 * TanStack Query mutation hook for sending chat requests to the AI endpoint.
 *
 * The mutation is disabled when `userId` or `token` is `null`.
 * Uses the StarterClient DI singleton (must be initialized at app startup).
 *
 * @param userId - The Firebase UID of the user, or `null` if not authenticated
 * @param token - A valid Firebase ID token, or `null` if not authenticated
 * @returns An object containing the chat function, loading state, and error
 */
export function useChat(
  userId: Optional<string>,
  token: Optional<FirebaseIdToken>
): UseChatReturn {
  const mutation = useMutation<BaseResponse<ChatResponse>, Error, ChatRequest>({
    mutationFn: async (data: ChatRequest) => {
      if (!userId || !token) {
        throw new Error('Not authenticated');
      }
      return getStarterClient().chat(userId, data, token);
    },
  });

  const chat = useCallback(
    async (request: string) => {
      return mutation.mutateAsync({ request });
    },
    [mutation]
  );

  const clearError = useCallback(() => {
    mutation.reset();
  }, [mutation]);

  const error: Optional<string> = mutation.error?.message ?? null;

  return { chat, isLoading: mutation.isPending, error, clearError };
}
