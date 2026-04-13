import { renderToStaticMarkup } from 'react-dom/server';
import React from 'react';
import { TicketEmail } from '../components/emails/TicketEmail';
import { apiFetch } from './api';

export async function sendWelcomeEmail(email: string, name: string, htmlContent?: string) {
  try {
    // Call our backend endpoint. 
    // If htmlContent is omitted, the backend will use its own professional template.
    const response = await apiFetch<{ message: string }>('/email/welcome', {
      method: "POST",
      body: JSON.stringify({
        email,
        name,
        htmlContent
      }),
    });

    console.log('Welcome email request sent to backend:', response.message);
    return { success: true, data: response };
  } catch (err) {
    console.error('Error triggering welcome email through backend:', err);
    return { success: false, error: err };
  }
}

/**
 * @deprecated Ticket emails are now automatically handled by the backend upon registration.
 * Use this only if you need to manually re-send a ticket.
 */
export async function sendTicketEmail(
  email: string, 
  name: string, 
  eventTitle: string, 
  eventDate: string, 
  venue: string, 
  ticketId: string | number
) {
  try {
    // Note: The backend currently doesn't have a specific "re-send ticket" endpoint 
    // that doesn't require HTML payload. If needed, one should be added to the API.
    // For now, we keep the rendering if manual sending is still required from FE.
    const htmlContent = renderToStaticMarkup(
      React.createElement(TicketEmail, { name, eventTitle, eventDate, venue, ticketId })
    );

    const response = await apiFetch<{ message: string }>('/email/welcome', {
      method: "POST",
      body: JSON.stringify({
        email,
        name,
        htmlContent
      }),
    });

    return !!response;
  } catch (err) {
    console.error('Error sending ticket email through backend:', err);
    return false;
  }
}
