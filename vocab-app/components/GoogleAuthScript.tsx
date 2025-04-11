"use client";

import { useEffect, useState } from 'react';

// Declare global Google type
declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: any) => void;
          renderButton: (element: HTMLElement, options: any) => void;
          prompt: (callback?: (notification: any) => void) => void;
          disableAutoSelect: () => void;
        }
      }
    }
  }
}

export default function GoogleAuthScript() {
  const [scriptLoaded, setScriptLoaded] = useState(false);

  useEffect(() => {
    // Check if script is already loaded
    if (document.querySelector('script[src="https://accounts.google.com/gsi/client"]')) {
      setScriptLoaded(true);
      return;
    }

    // Load the Google Identity Services script
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      setScriptLoaded(true);
      
      // Pre-initialize Google client (without callback)
      if (window.google && window.google.accounts) {
        const clientId = process.env.NEXT_PUBLIC_GOOGLE_OAUTH_CLIENT_ID || 
          '706602658417-ijh6iscpr949afs1bfg65g0g88ga53ri.apps.googleusercontent.com';
        
        window.google.accounts.id.initialize({
          client_id: clientId,
          auto_select: false,
          cancel_on_tap_outside: true,
        });
        
        // Disable auto select to prevent unexpected behavior
        window.google.accounts.id.disableAutoSelect();
      }
    };
    script.onerror = (e) => console.error("Failed to load Google Identity Services script", e);
    document.body.appendChild(script);

    return () => {
      // Clean up only if we added the script in this component
      if (scriptLoaded && document.querySelector('script[src="https://accounts.google.com/gsi/client"]')) {
        const scriptElement = document.querySelector('script[src="https://accounts.google.com/gsi/client"]');
        if (scriptElement && scriptElement.parentNode) {
          scriptElement.parentNode.removeChild(scriptElement);
        }
      }
    };
  }, [scriptLoaded]);

  return null;
}
