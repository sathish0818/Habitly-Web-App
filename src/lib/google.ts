type TokenResponse = {
  access_token?: string;
  error?: string;
};

type TokenClient = {
  requestAccessToken: () => void;
};

declare global {
  interface Window {
    google?: {
      accounts: {
        oauth2: {
          initTokenClient: (config: {
            client_id: string;
            scope: string;
            callback: (response: TokenResponse) => void;
          }) => TokenClient;
        };
      };
    };
  }
}

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined;

export type GoogleProfile = {
  name: string;
  email: string;
};

export function signInWithGoogle(): Promise<GoogleProfile> {
  return new Promise((resolve, reject) => {
    if (!CLIENT_ID) {
      reject(new Error("Google sign-in isn't configured (missing VITE_GOOGLE_CLIENT_ID)."));
      return;
    }
    if (!window.google) {
      reject(new Error("Google sign-in script hasn't loaded yet. Try again in a moment."));
      return;
    }

    const client = window.google.accounts.oauth2.initTokenClient({
      client_id: CLIENT_ID,
      scope: "openid email profile",
      callback: async (response) => {
        if (response.error || !response.access_token) {
          reject(new Error(response.error || "Google sign-in was cancelled."));
          return;
        }
        try {
          const res = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
            headers: { Authorization: `Bearer ${response.access_token}` },
          });
          if (!res.ok) throw new Error("Failed to fetch Google profile.");
          const data = await res.json();
          resolve({ name: data.name ?? data.email, email: data.email });
        } catch (err) {
          reject(err instanceof Error ? err : new Error("Failed to fetch Google profile."));
        }
      },
    });

    client.requestAccessToken();
  });
}
