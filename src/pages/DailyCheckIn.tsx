import { useNavigate, useParams } from "react-router-dom";
import CheckInForm from "../components/CheckInForm";
import Icon from "../components/Icon";

export default function DailyCheckIn() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  if (!id) return null;

  return (
    <div className="bg-surface-alt flex items-center justify-center min-h-screen w-full px-md py-2xl">
      <div className="bg-surface border border-border rounded-lg shadow-lg flex flex-col gap-lg items-start px-xl py-2xl w-full max-w-[480px]">
        <button
          type="button"
          onClick={() => navigate("/habits")}
          className="flex items-center gap-1 text-sm text-text-secondary hover:text-text-primary cursor-pointer"
        >
          <Icon name="arrow_back" style={{ fontSize: 16 }} />
          Habits
        </button>

        <CheckInForm habitId={id} onDone={() => navigate("/habits")} />
      </div>
    </div>
  );
}
