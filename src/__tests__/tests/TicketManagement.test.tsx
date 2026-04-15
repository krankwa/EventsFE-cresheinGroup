import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ticketsService } from '@/services/ticketsService';
import { toast } from 'react-hot-toast';
import { TicketManagement } from '@/pages/admin/TicketManagement';
import { vi } from 'vitest';

// Mock dependencies
vi.mock('@/services/ticketsService');
vi.mock('react-hot-toast');
vi.mock('@/components/PaginationWrapper', () => ({
  PaginationWrapper: () => <div data-testid="pagination-wrapper" />,
}));

const mockTickets = [
  {
    ticketId: 101,
    eventTitle: 'Tech Summit 2026',
    eventDate: new Date(Date.now() + 86400000).toISOString(),
    registrationDate: new Date().toISOString(),
    price: 500,
    tierName: 'VIP',
    isRedeemed: false,
  },
  {
    ticketId: 102,
    eventTitle: 'Past Event',
    eventDate: new Date(Date.now() - 86400000).toISOString(),
    registrationDate: new Date(Date.now() - 172800000).toISOString(),
    price: 300,
    tierName: 'General',
    isRedeemed: false,
  },
];

const mockPaginatedResponse = {
  items: mockTickets,
  totalCount: 2,
  pageNumber: 1,
  pageSize: 10,
  totalPages: 1,
};

describe('TicketManagement Admin Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (ticketsService.getAllPaginated as any).mockResolvedValue(mockPaginatedResponse);
    (ticketsService.scan as any).mockResolvedValue({ message: 'Redeemed successfully' });
  });

  it('should render loading state initially', () => {
    // Keep the promise pending to test loading state
    (ticketsService.getAllPaginated as any).mockImplementation(
      () => new Promise(() => {})
    );

    render(<TicketManagement />);
    
    // Since Skeleton doesn't have a data-testid, check for the loading indicator by class or text
    // The loading state shows the Skeleton component which has the "animate-pulse" class
    const skeletonElements = document.querySelectorAll('.animate-pulse');
    expect(skeletonElements.length).toBeGreaterThan(0);
  });

  it('should render tickets after loading', async () => {
    render(<TicketManagement />);

    await waitFor(() => {
      expect(screen.getByText('Tech Summit 2026')).toBeInTheDocument();
      expect(screen.getByText('Past Event')).toBeInTheDocument();
    });
  });

  it('allows an admin to redeem an upcoming ticket', async () => {
    const user = userEvent.setup();
    render(<TicketManagement />);

    await waitFor(() => {
      expect(screen.getByText('Tech Summit 2026')).toBeInTheDocument();
    });

    const redeemButtons = await screen.findAllByRole('button', { name: /Redeem/i });
    expect(redeemButtons.length).toBeGreaterThan(0);
    await user.click(redeemButtons[0]);

    expect(ticketsService.scan).toHaveBeenCalledWith(101);
    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith(expect.stringContaining('redeemed successfully'));
    });
  });

  it('should filter tickets by search', async () => {
    const user = userEvent.setup();
    render(<TicketManagement />);

    await waitFor(() => {
      expect(screen.getByText('Tech Summit 2026')).toBeInTheDocument();
    });

    // Clear previous calls
    vi.clearAllMocks();
    (ticketsService.getAllPaginated as any).mockResolvedValue({
      items: [mockTickets[0]],
      totalCount: 1,
      pageNumber: 1,
      pageSize: 10,
      totalPages: 1,
    });

    const searchInput = screen.getByPlaceholderText(/Search event, tier, ID/i);
    await user.type(searchInput, 'Tech Summit');

    await waitFor(() => {
      expect(ticketsService.getAllPaginated).toHaveBeenCalledWith(
        expect.objectContaining({ searchTerm: 'Tech Summit' })
      );
    });
  });

  it('should filter tickets by status', async () => {
    const user = userEvent.setup();
    render(<TicketManagement />);

    await waitFor(() => {
      expect(screen.getByText('Tech Summit 2026')).toBeInTheDocument();
    });

    // Clear previous calls
    vi.clearAllMocks();
    (ticketsService.getAllPaginated as any).mockResolvedValue({
      items: [mockTickets[0]],
      totalCount: 1,
      pageNumber: 1,
      pageSize: 10,
      totalPages: 1,
    });

    const statusSelect = screen.getByRole('combobox');
    await user.selectOptions(statusSelect, 'upcoming');

    await waitFor(() => {
      expect(ticketsService.getAllPaginated).toHaveBeenCalled();
    });
  });

  it('should handle refresh button click', async () => {
    const user = userEvent.setup();
    render(<TicketManagement />);

    await waitFor(() => {
      expect(screen.getByText('Tech Summit 2026')).toBeInTheDocument();
    });

    // Clear previous calls and set up fresh mock
    vi.clearAllMocks();
    (ticketsService.getAllPaginated as any).mockResolvedValue(mockPaginatedResponse);

    const refreshButton = screen.getByRole('button', { name: /Refresh/i });
    await user.click(refreshButton);

    // After refresh, should be called once more (initial load already happened)
    // But since we cleared mocks, we expect 1 call
    await waitFor(() => {
      expect(ticketsService.getAllPaginated).toHaveBeenCalledTimes(1);
    });
  });

  it('should display correct statistics', async () => {
    render(<TicketManagement />);

    await waitFor(() => {
      expect(screen.getByText('Total Tickets')).toBeInTheDocument();
      // The stats show totalCount from API response (2)
      const totalTicketsElement = screen.getByText('2');
      expect(totalTicketsElement).toBeInTheDocument();
    });
  });

  it('should show no tickets message when empty', async () => {
    (ticketsService.getAllPaginated as any).mockResolvedValue({
      items: [],
      totalCount: 0,
      pageNumber: 1,
      pageSize: 10,
      totalPages: 0,
    });

    render(<TicketManagement />);

    await waitFor(() => {
      expect(screen.getByText(/No tickets found/i)).toBeInTheDocument();
    });
  });

  it('should handle API error when loading tickets', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
    (ticketsService.getAllPaginated as any).mockRejectedValue(new Error('API Error'));

    render(<TicketManagement />);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Failed to load tickets.');
    });

    consoleError.mockRestore();
  });
});