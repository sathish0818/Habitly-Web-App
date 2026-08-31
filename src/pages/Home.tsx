import { useHabits } from "../data/HabitsContext";
import Layout from "../components/Layout";
import EmptyState from "./EmptyState";
import HabitList from "./HabitList";

export default function Home() {
  const { habits } = useHabits();

  if (habits.length === 0) {
    return <EmptyState />;
  }

  return (
    <Layout>
      <HabitList />
    </Layout>
  );
}
