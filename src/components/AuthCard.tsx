import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import Button from "./Button";
import GoogleIcon from "./GoogleIcon";
import logo from "../assets/logo.png";

type AuthCardProps = {
  heading: string;
  subtext: string;
  submitLabel: string;
  onSubmit: () => void;
  submitDisabled?: boolean;
  onGoogle: () => void;
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
  onGoogle,
  footerPrefix,
  footerLinkText,
  footerLinkTo,
  children,
}: AuthCardProps) {
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

        <div className="flex items-center gap-3 w-full max-w-80">
          <div className="h-px bg-border flex-1" />
          <span className="text-xs text-text-secondary">or</span>
          <div className="h-px bg-border flex-1" />
        </div>

        <button
          type="button"
          onClick={onGoogle}
          className="flex items-center justify-center gap-2.5 bg-surface border border-border rounded-md py-md w-full max-w-80 text-sm font-semibold text-text-primary cursor-pointer hover:bg-surface-alt"
        >
          <GoogleIcon />
          Continue with Google
        </button>

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
