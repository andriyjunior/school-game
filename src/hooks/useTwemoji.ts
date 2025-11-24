import { useEffect } from 'react';

declare global {
  interface Window {
    twemoji?: {
      parse: (element: HTMLElement | string, options?: {
        base?: string;
        ext?: string;
        className?: string;
        size?: string | number;
        folder?: string;
        callback?: (icon: string, options: any) => string;
        attributes?: () => Record<string, string>;
      }) => void;
    };
  }
}

/**
 * Check if system needs Twemoji fallback (old Windows without color emoji)
 */
function needsTwemojiFallback(): boolean {
  const ua = navigator.userAgent;

  // Detect Windows version
  const isWindows = /Windows/.test(ua);
  if (!isWindows) return false;

  // Windows 10+ (NT 10.0) has good emoji support
  // Windows 8.1 (NT 6.3) has partial support
  // Windows 8 (NT 6.2), 7 (NT 6.1), Vista (NT 6.0) need fallback
  const match = ua.match(/Windows NT (\d+)\.(\d+)/);
  if (match) {
    const major = parseInt(match[1], 10);
    const minor = parseInt(match[2], 10);
    // NT 6.2 and below (Windows 8 and older)
    if (major < 6 || (major === 6 && minor <= 2)) {
      return true;
    }
  }

  return false;
}

const twemojiOptions = {
  folder: 'svg',
  ext: '.svg',
  callback: (icon: string, options: any) => {
    return `${options.base}${options.size}/${icon}${options.ext}`;
  },
  attributes: () => ({
    style: 'height: 1em; width: 1em; max-height: 48px; max-width: 48px; margin: 0 0.025em; vertical-align: -0.1em; display: inline-block;'
  })
};

/**
 * Parse emojis in an element
 */
function parseEmojis(element: HTMLElement = document.body) {
  if (window.twemoji) {
    window.twemoji.parse(element, twemojiOptions);
  }
}

/**
 * Hook to automatically parse emojis with Twemoji for Windows 7 fallback
 * Uses MutationObserver to re-parse when DOM changes
 * Only runs on old Windows systems without native color emoji
 */
export function useTwemoji() {
  useEffect(() => {
    if (!needsTwemojiFallback() || !window.twemoji) {
      return;
    }

    // Initial parse
    parseEmojis();

    // Watch for DOM changes and re-parse
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        // Parse added nodes
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            parseEmojis(node as HTMLElement);
          }
        });
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    return () => {
      observer.disconnect();
    };
  }, []);
}

export default useTwemoji;
