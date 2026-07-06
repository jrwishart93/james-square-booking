import 'react';

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      ambientLight: Record<string, unknown>;
      directionalLight: Record<string, unknown>;
      primitive: Record<string, unknown>;
    }
  }
}
