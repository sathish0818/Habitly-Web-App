import { useNavigate } from "react-router-dom";
import Icon from "../components/Icon";
import Button from "../components/Button";

export default function EmptyState() {
  const navigate = useNavigate();

  return (
    <div className="bg-surface flex flex-col items-center justify-center h-screen w-full px-lg">
      <div className="flex flex-col gap-lg items-center">
        <div className="bg-accent-subtle rounded-full size-24 flex items-center justify-center">
          <Icon name="eco" className="text-accent" style={{ fontSize: 32 }} />
        </div>
        <p className="font-bold text-2xl text-text-primary text-center">Start your first habit</p>
        <div className="text-md text-text-secondary text-center w-full max-w-[420px]">
          <p>Small, daily check-ins build habits that stick.</p>
          <p>Add your first one to get started.</p>
        </div>
        <Button size="md" onClick={() => navigate("/add")}>
          + Add your first habit
        </Button>
      </div>
    </div>
  );
}
