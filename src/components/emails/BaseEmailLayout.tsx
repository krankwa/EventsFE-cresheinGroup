import React from 'react';

interface BaseEmailLayoutProps {
  children: React.ReactNode;
  previewText?: string;
}

export const BaseEmailLayout: React.FC<BaseEmailLayoutProps> = ({ children, previewText }) => {
  return (
    <div style={{
      backgroundColor: '#f9fafb',
      padding: '24px 0',
      width: '100%',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
    }}>
      {previewText && (
        <span style={{ display: 'none', maxHeight: 0, overflow: 'hidden' }}>
          {previewText}
        </span>
      )}
      <table align="center" border={0} cellPadding="0" cellSpacing="0" width="100%" style={{
        maxWidth: '600px',
        backgroundColor: '#ffffff',
        borderRadius: '8px',
        border: '1px solid #e5e7eb',
        overflow: 'hidden'
      }}>
        {/* Header */}
        <tr>
          <td style={{ padding: '32px 32px 24px', textAlign: 'center' }}>
            <h1 style={{
              margin: 0,
              color: '#3b82f6',
              fontSize: '28px',
              fontWeight: 700,
              letterSpacing: '-0.025em'
            }}>
              EventTix
            </h1>
          </td>
        </tr>
        
        {/* Content */}
        <tr>
          <td style={{ padding: '0 32px 32px', color: '#374151', fontSize: '16px', lineHeight: '1.6' }}>
            {children}
          </td>
        </tr>

        {/* Footer */}
        <tr>
          <td style={{
            padding: '24px 32px',
            backgroundColor: '#f3f4f6',
            textAlign: 'center',
            color: '#6b7280',
            fontSize: '12px'
          }}>
            <p style={{ margin: '0 0 8px' }}>
              &copy; {new Date().getFullYear()} EventTix. All rights reserved.
            </p>
            <p style={{ margin: 0 }}>
              This is an automated message. Please do not reply to this email.
            </p>
          </td>
        </tr>
      </table>
    </div>
  );
};
