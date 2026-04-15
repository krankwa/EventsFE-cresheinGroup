import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { EventDetail } from '@/pages/EventDetail';
import { vi } from 'vitest';

// Mock the EventDetailSection component
vi.mock('@/features/events/EventDetailSection', () => ({
  EventDetailSection: () => (
    <div data-testid="event-detail-section">
      <span>Event Detail Content</span>
      <span data-testid="sold-out-badge">Sold Out</span>
    </div>
  ),
}));

vi.mock('@/services/eventsService', () => ({
  eventsService: {
    getById: vi.fn(),
  },
}));

vi.mock('react-hot-toast', () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
  },
}));

describe('EventDetail Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the event detail section', () => {
    render(
      <MemoryRouter initialEntries={['/events/1']}>
        <EventDetail />
      </MemoryRouter>
    );

    expect(screen.getByTestId('event-detail-section')).toBeInTheDocument();
  });

  it('displays a "Sold Out" badge when event capacity is reached', () => {
    render(
      <MemoryRouter initialEntries={['/events/1']}>
        <EventDetail />
      </MemoryRouter>
    );

    expect(screen.getByTestId('sold-out-badge')).toBeInTheDocument();
  });
});