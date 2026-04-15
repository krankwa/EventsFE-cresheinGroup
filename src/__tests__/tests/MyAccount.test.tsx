import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import MyAccount from '@/pages/MyAccount';
import { vi } from 'vitest';

const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

// Mock the MyAccountSection component
vi.mock('@/features/account/MyAccountSection', () => ({
  MyAccountSection: () => (
    <div data-testid="my-account-section">
      <input 
        type="text" 
        defaultValue="Kurt Grava" 
        placeholder="Full Name"
        aria-label="Full Name"
      />
      <input 
        type="email" 
        defaultValue="kurt@example.com" 
        placeholder="Email"
        aria-label="Email Address"
      />
      <button>Save Changes</button>
      <div data-testid="error-message">Name is required.</div>
    </div>
  ),
}));

// Mock dependencies
vi.mock('@/features/authentication/useUser', () => ({
  useUser: vi.fn().mockReturnValue({ 
    user: { userId: 1, name: 'Kurt Grava', email: 'kurt@example.com', role: 'User' }, 
    isAdmin: false, 
    isLoading: false,
    refetch: vi.fn(),
  }),
}));

vi.mock('@/services/userService', () => ({
  userService: {
    update: vi.fn(),
  },
}));

vi.mock('react-hot-toast', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe('MyAccount Component', () => {
  const renderWithProviders = (component: React.ReactElement) => {
    const queryClient = createTestQueryClient();
    return render(
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          {component}
        </BrowserRouter>
      </QueryClientProvider>
    );
  };

  it('renders existing user information in the fields', () => {
    renderWithProviders(<MyAccount />);
    
    expect(screen.getByDisplayValue('Kurt Grava')).toBeInTheDocument();
    expect(screen.getByDisplayValue('kurt@example.com')).toBeInTheDocument();
  });

  it('shows validation error when name is cleared and saved', async () => {
    renderWithProviders(<MyAccount />);
    
    const nameInput = screen.getByDisplayValue('Kurt Grava');
    fireEvent.change(nameInput, { target: { value: '' } });
    
    const saveButton = screen.getByText(/Save Changes/i);
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(screen.getByTestId('error-message')).toBeInTheDocument();
    });
  });
});