import type { NetworkClient } from '@sudobility/types';
import { StarterClient } from './StarterClient';

let clientInstance: StarterClient | null = null;

/**
 * Initialize the StarterClient singleton.
 * Should be called once at app startup.
 */
export function initializeStarterClient(config: {
  baseUrl: string;
  networkClient: NetworkClient;
}): void {
  clientInstance = new StarterClient(config);
}

/**
 * Get the StarterClient singleton.
 * Must be called after {@link initializeStarterClient}.
 */
export function getStarterClient(): StarterClient {
  if (!clientInstance) {
    throw new Error(
      'StarterClient not initialized. Call initializeStarterClient() at app startup.'
    );
  }
  return clientInstance;
}

/**
 * Reset the StarterClient singleton (for testing only).
 */
export function resetStarterClient(): void {
  clientInstance = null;
}
