import { useCallback, useMemo } from 'react';
import { useMutation } from '@tanstack/react-query';
import type {
  BaseResponse,
  ChatRequest,
  ChatResponse,
  NetworkClient,
  Optional,
} from '@sudobility/genuivo_types';
import type { FirebaseIdToken } from '../types';
import { StarterClient } from '../network/StarterClient';

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
 *
 * @param networkClient - A {@link NetworkClient} implementation for HTTP requests
 * @param baseUrl - The base URL of the API
 * @param userId - The Firebase UID of the user, or `null` if not authenticated
 * @param token - A valid Firebase ID token, or `null` if not authenticated
 * @returns An object containing the chat function, loading state, and error
 */
export function useChat(
  networkClient: NetworkClient,
  baseUrl: string,
  userId: Optional<string>,
  token: Optional<FirebaseIdToken>
): UseChatReturn {
  const client = useMemo(
    () => new StarterClient({ baseUrl, networkClient }),
    [baseUrl, networkClient]
  );

  const mutation = useMutation<BaseResponse<ChatResponse>, Error, ChatRequest>({
    mutationFn: async (data: ChatRequest) => {
      if (!userId || !token) {
        throw new Error('Not authenticated');
      }
      return client.chat(userId, data, token);
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
