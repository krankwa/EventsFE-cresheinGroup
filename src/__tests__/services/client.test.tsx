import { apiRequest } from '@/services/client';
import { getToken } from '@/services/authStore';
import { vi } from 'vitest';

vi.mock('@/services/authStore');

describe('apiRequest', () => {
  const API_BASE_URL = import.meta.env.VITE_BACKEND_API;

  beforeEach(() => {
    vi.clearAllMocks();
    (getToken as any).mockReturnValue('mock-token');
  });

  it('should make GET request with auth header', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      headers: new Headers({ 'content-type': 'application/json' }),
      json: async () => ({ data: 'test' }),
    });
    global.fetch = mockFetch;

    await apiRequest('/test', { method: 'GET' });

    expect(mockFetch).toHaveBeenCalledWith(
      `${API_BASE_URL}/test`,
      expect.objectContaining({
        method: 'GET',
        headers: expect.objectContaining({
          'Content-Type': 'application/json',
          Authorization: 'Bearer mock-token',
        }),
      })
    );
  });

  it('should add query parameters to URL', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      headers: new Headers({ 'content-type': 'application/json' }),
      json: async () => ({}),
    });
    global.fetch = mockFetch;

    await apiRequest('/test', {
      method: 'GET',
      params: { page: 1, size: 10 },
    });

    const url = mockFetch.mock.calls[0][0];
    expect(url).toContain('page=1');
    expect(url).toContain('size=10');
  });

  it('should handle API error response', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 404,
      statusText: 'Not Found',
      headers: new Headers({ 'content-type': 'application/json' }),
      json: async () => ({ message: 'Resource not found' }),
    });
    global.fetch = mockFetch;

    await expect(apiRequest('/test', { method: 'GET' })).rejects.toThrow('Resource not found');
  });
});