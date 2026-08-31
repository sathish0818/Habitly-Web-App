import { useNavigate, useParams } from "react-router-dom";
import { useHabits } from "../data/HabitsContext";
import { useToast } from "../data/ToastContext";
import HabitForm, { type HabitFormValues } from "../components/HabitForm";

export default function EditHabit() {
  const { id } = useParams<{ id: string }>();
  const { getHabit, updateHabit } = useHabits();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const habit = id ? getHabit(id) : undefined;

  if (!habit) {
    return (
      <div className="flex flex-col gap-md items-start p-2xl">
        <p className="font-bold text-2xl text-text-primary">Habit not found</p>
        <p className="text-sm text-text-secondary">It may have already been deleted.</p>
      </div>
    );
  }

  const handleSubmit = (values: HabitFormValues) => {
    updateHabit(habit.id, values);
    showToast(`"${values.name}" updated`, "success");
    navigate("/");
  };

  return (
    <HabitForm
      mode="edit"
      initialValues={{
        name: habit.name,
        icon: habit.icon,
        frequency: habit.frequency,
        reminder: habit.reminder,
      }}
      onSubmit={handleSubmit}
    />
  );
}
