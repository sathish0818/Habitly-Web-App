type CredentialResponse = {
  credential: string;
};

type ButtonOptions = {
  theme?: "outline" | "filled_blue" | "filled_black";
  size?: "large" | "medium" | "small";
  shape?: "rectangular" | "pill" | "circle" | "square";
  width?: number;
  text?: "signin_with" | "signup_with" | "continue_with" | "signin";
};

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: CredentialResponse) => void;
          }) => void;
          renderButton: (parent: HTMLElement, options: ButtonOptions) => void;
        };
      };
    };
  }
}

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined;

export function isGoogleSignInConfigured(): boolean {
  return Boolean(CLIENT_ID);
}

/** Renders Google's own "Sign in with Google" button into `container`.
 * Using Google's rendered button (rather than a custom one paired with the
 * One Tap prompt) is what makes the click reliably produce a credential —
 * `google.accounts.id.prompt()` can silently no-op after prior dismissals.
 * Re-initializes on every call (cheap) so each mount's own `onCredential`
 * closure is the one actually wired to the button — GIS is a singleton
 * across the SPA, so a stale closure from a previous page would otherwise
 * keep firing after client-side navigation. */
export function renderGoogleButton(
  container: HTMLElement,
  onCredential: (idToken: string) => void,
  options: ButtonOptions = {}
): boolean {
  if (!CLIENT_ID || !window.google) return false;

  window.google.accounts.id.initialize({
    client_id: CLIENT_ID,
    callback: (response) => onCredential(response.credential),
  });

  container.innerHTML = "";
  window.google.accounts.id.renderButton(container, {
    theme: "outline",
    size: "large",
    shape: "rectangular",
    text: "continue_with",
    ...options,
  });
  return true;
}
