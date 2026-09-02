import { useState } from "react";
import { Navigate } from "react-router-dom";
import { useHabits } from "../data/HabitsContext";
import EmptyState from "./EmptyState";

export default function Home() {
  const { habits } = useHabits();
  const [hadNoHabitsOnMount] = useState(() => habits.length === 0);

  if (hadNoHabitsOnMount) {
    return <EmptyState />;
  }

  return <Navigate to="/stats" replace />;
}
