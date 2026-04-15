import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useUser } from '@/features/authentication/useUser';
import { getCurrentUser } from '@/services/apiAuth';
import { vi } from 'vitest';

vi.mock('@/services/apiAuth');

const createTestQueryClient = () => new QueryClient({
  defaultOptions: { queries: { retry: false } },
});

describe('useUser', () => {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={createTestQueryClient()}>
      {children}
    </QueryClientProvider>
  );

  it('should return user data when authenticated', async () => {
    const mockUser = { userId: 1, name: 'Test User', email: 'test@example.com', role: 'User' };
    (getCurrentUser as any).mockResolvedValue(mockUser);

    const { result } = renderHook(() => useUser(), { wrapper });

    await waitFor(() => {
      expect(result.current.user).toEqual(mockUser);
      expect(result.current.isAuthenticated).toBe(true);
      expect(result.current.isAdmin).toBe(false);
    });
  });

  it('should return not authenticated when no user', async () => {
    (getCurrentUser as any).mockResolvedValue(null);

    const { result } = renderHook(() => useUser(), { wrapper });

    await waitFor(() => {
      expect(result.current.user).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
    });
  });
});