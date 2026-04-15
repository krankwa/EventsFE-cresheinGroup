import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { EventsManagement } from '@/pages/admin/EventsManagement';
import { eventsService } from '@/services/eventsService';
import { vi } from 'vitest';

vi.mock('@/services/eventsService');
vi.mock('react-hot-toast');

const mockEvents = [
  { eventID: 1, title: 'Concert', venue: 'Stadium', date: '2024-12-31', capacity: 1000, ticketsSold: 500, coverImageUrl: null },
  { eventID: 2, title: 'Conference', venue: 'Convention Center', date: '2024-11-15', capacity: 500, ticketsSold: 200, coverImageUrl: null },
];

describe('EventsManagement', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (eventsService.getAll as any).mockResolvedValue(mockEvents);
  });

  it('should render events after loading', async () => {
    render(<EventsManagement />);

    await waitFor(() => {
      expect(screen.getByText('Concert')).toBeInTheDocument();
      expect(screen.getByText('Conference')).toBeInTheDocument();
    });
  });

  it('should filter events by search', async () => {
    const user = userEvent.setup();
    render(<EventsManagement />);

    await waitFor(() => {
      expect(screen.getByText('Concert')).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText(/Filter events/i);
    await user.type(searchInput, 'Concert');

    await waitFor(() => {
      expect(screen.getByText('Concert')).toBeInTheDocument();
      expect(screen.queryByText('Conference')).not.toBeInTheDocument();
    });
  });

  it('should open create dialog when clicking new event button', async () => {
    const user = userEvent.setup();
    render(<EventsManagement />);

    await waitFor(() => {
      expect(screen.getByText('Concert')).toBeInTheDocument();
    });

    const newButton = screen.getByRole('button', { name: /New Event/i });
    await user.click(newButton);

    // Dialog should open (you may need to add testid)
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });
});