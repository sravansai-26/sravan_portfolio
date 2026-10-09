import React from 'react';

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'model-viewer': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        src?: string;
        alt?: string;
        "auto-rotate"?: boolean | string;
        "camera-controls"?: boolean | string;
        "shadow-intensity"?: string | number;
        "shadow-softness"?: string | number;
        "environment-image"?: string;
        exposure?: string | number;
        "interaction-prompt"?: string;
        class?: string;
      };
    }
  }
}
