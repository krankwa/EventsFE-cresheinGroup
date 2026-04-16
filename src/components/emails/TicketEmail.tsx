import React from 'react';
import { BaseEmailLayout } from './BaseEmailLayout';

interface TicketEmailProps {
  name: string;
  eventTitle: string;
  eventDate: string;
  venue: string;
  ticketId: string | number;
}

export const TicketEmail: React.FC<TicketEmailProps> = ({ 
  name, 
  eventTitle, 
  eventDate, 
  venue, 
  ticketId 
}) => {
  return (
    <BaseEmailLayout previewText={`Your ticket for ${eventTitle} is ready!`}>
      <h2 style={{ color: '#111827', fontSize: '20px', fontWeight: 600, margin: '0 0 16px' }}>
        Your Ticket Details
      </h2>
      <p style={{ margin: '0 0 24px' }}>
        Hi ${name}, thank you for your booking! Here are your ticket details for the upcoming event.
      </p>
      
      <div style={{ 
        backgroundColor: '#f9fafb', 
        padding: '24px', 
        borderRadius: '8px', 
        border: '1px dashed #d1d5db',
        margin: '0 0 24px'
      }}>
        <h3 style={{ margin: '0 0 8px', color: '#3b82f6', fontSize: '18px' }}>{eventTitle}</h3>
        <p style={{ margin: '0 0 4px', fontSize: '14px' }}><strong>Date:</strong> {eventDate}</p>
        <p style={{ margin: '0 0 4px', fontSize: '14px' }}><strong>Venue:</strong> {venue}</p>
        <p style={{ margin: '0', fontSize: '14px' }}><strong>Ticket ID:</strong> #{ticketId}</p>
      </div>

      <p style={{ margin: '0 0 16px' }}>
        Please have this email or your digital ticket ready at the entrance.
      </p>
      
      <div style={{ textAlign: 'center', margin: '32px 0' }}>
        <a href="#" style={{
          backgroundColor: '#3b82f6',
          color: '#ffffff',
          padding: '12px 24px',
          borderRadius: '6px',
          textDecoration: 'none',
          fontWeight: 600,
          display: 'inline-block'
        }}>
          View Full Ticket
        </a>
      </div>

      <p style={{ margin: 0 }}>
        See you there!<br />
        The EventTix Team
      </p>
    </BaseEmailLayout>
  );
};
