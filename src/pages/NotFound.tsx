import { Link } from "react-router-dom";
import Icon from "../components/Icon";

export default function NotFound() {
  return (
    <div className="bg-surface-alt flex flex-col items-center justify-center min-h-screen w-full px-lg gap-lg">
      <div className="bg-accent-subtle rounded-full size-16 flex items-center justify-center">
        <Icon name="search_off" className="text-accent" style={{ fontSize: 28 }} />
      </div>
      <div className="flex flex-col gap-1 items-center text-center">
        <p className="font-bold text-2xl text-text-primary">Page not found</p>
        <p className="text-sm text-text-secondary w-full max-w-[360px]">
          The page you're looking for doesn't exist or may have moved.
        </p>
      </div>
      <Link
        to="/"
        className="flex items-center justify-center gap-sm rounded-md font-semibold px-lg py-md text-md bg-accent hover:bg-accent-hover text-accent-on cursor-pointer"
      >
        Back to Habitly
      </Link>
    </div>
  );
}
