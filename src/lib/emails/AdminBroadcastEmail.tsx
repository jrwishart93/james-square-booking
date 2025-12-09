import React from 'react';

interface AdminBroadcastEmailProps {
  subject: string;
  bodyHtml: string;
}

export default function AdminBroadcastEmail({ subject, bodyHtml }: AdminBroadcastEmailProps) {
  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>{subject}</title>
      </head>
      <body style={{ backgroundColor: '#f6f6f6', margin: 0, padding: '24px', fontFamily: 'Arial, sans-serif' }}>
        <table
          role="presentation"
          cellPadding={0}
          cellSpacing={0}
          width="100%"
          style={{ borderCollapse: 'collapse' }}
        >
          <tbody>
            <tr>
              <td />
              <td style={{ maxWidth: 600, width: '100%' }}>
                <table
                  role="presentation"
                  cellPadding={0}
                  cellSpacing={0}
                  width="100%"
                  style={{
                    borderCollapse: 'collapse',
                    background: '#ffffff',
                    borderRadius: 8,
                    padding: 24,
                  }}
                >
                  <tbody>
                    <tr>
                      <td>
                        <h1 style={{ fontSize: 20, margin: '0 0 12px 0' }}>{subject}</h1>
                        <div dangerouslySetInnerHTML={{ __html: bodyHtml }} />
                        <p style={{ color: '#666', marginTop: 24, fontSize: 12 }}>
                          Sent via James Square Admin
                        </p>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
              <td />
            </tr>
          </tbody>
        </table>
      </body>
    </html>
  );
}
