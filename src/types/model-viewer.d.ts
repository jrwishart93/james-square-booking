import type React from 'react';

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'model-viewer': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        src?: string;
        poster?: string;
        'camera-controls'?: boolean | string;
        'auto-rotate'?: boolean | string;
        'touch-action'?: string;
        'shadow-intensity'?: string;
        exposure?: string;
      };
    }
  }
}
