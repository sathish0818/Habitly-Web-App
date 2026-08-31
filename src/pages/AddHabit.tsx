import { useNavigate } from "react-router-dom";
import { useHabits } from "../data/HabitsContext";
import { useToast } from "../data/ToastContext";
import HabitForm, { type HabitFormValues } from "../components/HabitForm";

export default function AddHabit() {
  const { addHabit } = useHabits();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = (values: HabitFormValues) => {
    addHabit(values);
    showToast(`"${values.name}" added`, "success");
    navigate("/");
  };

  return <HabitForm mode="add" onSubmit={handleSubmit} />;
}
