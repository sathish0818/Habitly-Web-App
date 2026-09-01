import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./data/AuthContext";
import { HabitsProvider } from "./data/HabitsContext";
import { WellbeingProvider } from "./data/WellbeingContext";
import { MoodProvider } from "./data/MoodContext";
import { SidebarProvider } from "./data/SidebarContext";
import { ToastProvider } from "./data/ToastContext";
import Layout from "./components/Layout";
import RequireAuth from "./components/RequireAuth";
import Home from "./pages/Home";
import HabitList from "./pages/HabitList";
import AddHabit from "./pages/AddHabit";
import EditHabit from "./pages/EditHabit";
import StreakStats from "./pages/StreakStats";
import Settings from "./pages/Settings";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import OnboardingProfile from "./pages/OnboardingProfile";
import YourTargets from "./pages/YourTargets";
import DailyCheckIn from "./pages/DailyCheckIn";
import StreakShare from "./pages/StreakShare";

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <HabitsProvider>
          <WellbeingProvider>
            <MoodProvider>
              <SidebarProvider>
                <BrowserRouter>
                  <Routes>
                    <Route path="/signin" element={<SignIn />} />
                    <Route path="/signup" element={<SignUp />} />
                    <Route element={<RequireAuth />}>
                      <Route path="/" element={<Home />} />
                      <Route path="/onboarding" element={<OnboardingProfile />} />
                      <Route path="/checkin/:id" element={<DailyCheckIn />} />
                      <Route element={<Layout />}>
                        <Route path="/habits" element={<HabitList />} />
                        <Route path="/add" element={<AddHabit />} />
                        <Route path="/edit/:id" element={<EditHabit />} />
                        <Route path="/stats" element={<StreakStats />} />
                        <Route path="/targets" element={<YourTargets />} />
                        <Route path="/share" element={<StreakShare />} />
                        <Route path="/settings" element={<Settings />} />
                      </Route>
                    </Route>
                  </Routes>
                </BrowserRouter>
              </SidebarProvider>
            </MoodProvider>
          </WellbeingProvider>
        </HabitsProvider>
      </AuthProvider>
    </ToastProvider>
  );
}
