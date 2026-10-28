'use client';

import { useEffect, useState } from 'react';

/** QR code for a WhatsApp invitation, generated in the browser. */
export default function WhatsAppQrCode({
  url,
  size = 148,
  label = 'QR code that opens the WhatsApp group invitation',
}: {
  /** Invitation to encode. Only ever a URL returned by the site's own API, never user input. */
  url: string;
  size?: number;
  label?: string;
}) {
  const [svg, setSvg] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    import('qrcode')
      .then((QR) => QR.toString(url, { type: 'svg', margin: 1, errorCorrectionLevel: 'M' }))
      .then((markup) => {
        if (!cancelled) setSvg(markup);
      })
      .catch(() => {
        if (!cancelled) setSvg(null);
      });
    return () => {
      cancelled = true;
    };
  }, [url]);

  return (
    <div
      role="img"
      aria-label={label}
      className="rounded-xl bg-white p-2 shadow-sm ring-1 ring-black/5"
      style={{ width: size + 16, height: size + 16 }}
    >
      {svg ? (
        // Generated locally by the qrcode library from a server-supplied invitation.
        <div
          aria-hidden="true"
          className="h-full w-full [&>svg]:h-full [&>svg]:w-full"
          dangerouslySetInnerHTML={{ __html: svg }}
        />
      ) : (
        <div aria-hidden="true" className="h-full w-full animate-pulse rounded bg-neutral-100" />
      )}
    </div>
  );
}
