import { useEffect, useRef, type ReactNode } from "react";
import { Link } from "react-router-dom";
import Button from "./Button";
import logo from "../assets/logo.png";
import { isGoogleSignInConfigured, renderGoogleButton } from "../lib/google";

type AuthCardProps = {
  heading: string;
  subtext: string;
  submitLabel: string;
  onSubmit: () => void;
  submitDisabled?: boolean;
  onGoogleCredential?: (idToken: string) => void;
  googleLoading?: boolean;
  showGoogle?: boolean;
  footerPrefix: string;
  footerLinkText: string;
  footerLinkTo: string;
  children: ReactNode;
};

export default function AuthCard({
  heading,
  subtext,
  submitLabel,
  onSubmit,
  submitDisabled,
  onGoogleCredential,
  googleLoading,
  showGoogle = true,
  footerPrefix,
  footerLinkText,
  footerLinkTo,
  children,
}: AuthCardProps) {
  const googleButtonRef = useRef<HTMLDivElement>(null);
  const showGoogleSection = showGoogle && isGoogleSignInConfigured();

  useEffect(() => {
    const container = googleButtonRef.current;
    if (!container || !onGoogleCredential) return;
    renderGoogleButton(container, onGoogleCredential, { width: 320 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="bg-surface-alt flex items-center justify-center min-h-screen w-full px-md">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
        className="bg-surface border border-border rounded-lg shadow-lg flex flex-col gap-lg items-center px-xl py-2xl w-full max-w-[400px]"
      >
        <div className="flex items-center gap-2.5">
          <img src={logo} alt="Habitly" className="size-[30px] max-w-none object-cover shrink-0" />
          <p className="font-bold text-lg text-text-primary">Habitly</p>
        </div>

        <div className="flex flex-col gap-1 items-center">
          <p className="font-bold text-xl text-text-primary text-center">{heading}</p>
          <p className="text-sm text-text-secondary text-center w-full max-w-80">{subtext}</p>
        </div>

        <div className="flex flex-col gap-md items-start w-full max-w-80">{children}</div>

        <Button type="submit" size="md" variant="primary" className="w-full max-w-80" disabled={submitDisabled}>
          {submitLabel}
        </Button>

        {showGoogleSection && (
          <>
            <div className="flex items-center gap-3 w-full max-w-80">
              <div className="h-px bg-border flex-1" />
              <span className="text-xs text-text-secondary">or</span>
              <div className="h-px bg-border flex-1" />
            </div>

            <div className="flex flex-col items-center gap-1.5 w-full max-w-80">
              <div ref={googleButtonRef} className={googleLoading ? "opacity-60 pointer-events-none" : ""} />
              {googleLoading && <p className="text-xs text-text-secondary">Connecting…</p>}
            </div>
          </>
        )}

        <p className="text-sm text-text-secondary">
          {footerPrefix}{" "}
          <Link to={footerLinkTo} className="font-semibold text-accent hover:underline">
            {footerLinkText}
          </Link>
        </p>
      </form>
    </div>
  );
}
