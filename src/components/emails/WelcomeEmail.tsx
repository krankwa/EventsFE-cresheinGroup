import React from 'react';
import { BaseEmailLayout } from './BaseEmailLayout';

interface WelcomeEmailProps {
  name: string;
}

export const WelcomeEmail: React.FC<WelcomeEmailProps> = ({ name }) => {
  return (
    <BaseEmailLayout previewText={`Welcome to EventTix, ${name}!`}>
      <h2 style={{ color: '#111827', fontSize: '20px', fontWeight: 600, margin: '0 0 16px' }}>
        Hello ${name},
      </h2>
      <p style={{ margin: '0 0 16px' }}>
        We're thrilled to have you join our community!
      </p>
      <p style={{ margin: '0 0 16px' }}>
        EventTix is your all-in-one platform for managing and discovering amazing events. From concerts to conferences, we've got you covered.
      </p>
      <div style={{ textAlign: 'center', margin: '32px 0' }}>
        <a href={typeof window !== 'undefined' ? window.location.origin : '#'} style={{
          backgroundColor: '#3b82f6',
          color: '#ffffff',
          padding: '12px 24px',
          borderRadius: '6px',
          textDecoration: 'none',
          fontWeight: 600,
          display: 'inline-block'
        }}>
          Explore Events
        </a>
      </div>
      <p style={{ margin: 0 }}>
        Best regards,<br />
        The EventTix Team
      </p>
    </BaseEmailLayout>
  );
};
