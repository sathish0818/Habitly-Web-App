import { Navigate } from "react-router-dom";
import { useHabits } from "../data/HabitsContext";
import EmptyState from "./EmptyState";

export default function Home() {
  const { habits } = useHabits();

  if (habits.length === 0) {
    return <EmptyState />;
  }

  return <Navigate to="/stats" replace />;
}
