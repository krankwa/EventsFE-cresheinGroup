import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ProtectedRoute } from '@/components/molecules/ProtectedRoute';
import { useUser } from '@/features/authentication/useUser';
import { vi } from 'vitest';

// Mock the useUser hook
vi.mock('@/features/authentication/useUser');

// Mock the Outlet component from react-router-dom
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    Outlet: () => <div data-testid="outlet">Outlet Content</div>,
    Navigate: ({ to }: { to: string }) => <div data-testid={`navigate-to-${to.replace('/', '')}`}>Redirecting to {to}</div>,
  };
});

describe('ProtectedRoute', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render Outlet when authenticated and role matches', () => {
    (useUser as any).mockReturnValue({
      user: { role: 'Admin', userId: 1, name: 'Admin', email: 'admin@test.com' },
      isLoading: false,
    });

    render(
      <MemoryRouter>
        <ProtectedRoute allowedRoles={['Admin']} children={undefined} />
      </MemoryRouter>
    );

    expect(screen.getByTestId('outlet')).toBeInTheDocument();
  });

  it('should render Outlet when user role is in allowed roles', () => {
    (useUser as any).mockReturnValue({
      user: { role: 'Staff', userId: 2, name: 'Staff', email: 'staff@test.com' },
      isLoading: false,
    });

    render(
      <MemoryRouter>
        <ProtectedRoute allowedRoles={['Admin', 'Staff']} children={undefined} />
      </MemoryRouter>
    );

    expect(screen.getByTestId('outlet')).toBeInTheDocument();
  });

  it('should show loading spinner while checking authentication', () => {
    (useUser as any).mockReturnValue({
      user: null,
      isLoading: true,
    });

    render(
      <MemoryRouter>
        <ProtectedRoute allowedRoles={['Admin']} children={undefined} />
      </MemoryRouter>
    );

    expect(screen.getByText(/Authenticating/i)).toBeInTheDocument();
    expect(document.querySelector('.animate-spin')).toBeInTheDocument();
    expect(screen.queryByTestId('outlet')).not.toBeInTheDocument();
  });

  it('should redirect to login when not authenticated', () => {
    (useUser as any).mockReturnValue({
      user: null,
      isLoading: false,
    });

    render(
      <MemoryRouter>
        <ProtectedRoute allowedRoles={['Admin']} children={undefined} />
      </MemoryRouter>
    );

    expect(screen.queryByTestId('outlet')).not.toBeInTheDocument();
    expect(screen.getByTestId('navigate-to-login')).toBeInTheDocument();
    expect(screen.getByText(/Redirecting to \/login/i)).toBeInTheDocument();
  });

  it('should redirect to /unauthorize when authenticated but role not allowed', () => {
    (useUser as any).mockReturnValue({
      user: { role: 'User', userId: 3, name: 'User', email: 'user@test.com' },
      isLoading: false,
    });

    render(
      <MemoryRouter>
        <ProtectedRoute allowedRoles={['Admin']} children={undefined} />
      </MemoryRouter>
    );

    expect(screen.queryByTestId('outlet')).not.toBeInTheDocument();
    expect(screen.getByTestId('navigate-to-unauthorize')).toBeInTheDocument();
    expect(screen.getByText(/Redirecting to \/unauthorize/i)).toBeInTheDocument();
  });

  it('should render Outlet when no allowedRoles specified', () => {
    (useUser as any).mockReturnValue({
      user: { role: 'User', userId: 3, name: 'User', email: 'user@test.com' },
      isLoading: false,
    });

    render(
      <MemoryRouter>
        <ProtectedRoute children={undefined} />
      </MemoryRouter>
    );

    expect(screen.getByTestId('outlet')).toBeInTheDocument();
  });
});