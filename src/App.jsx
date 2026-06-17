import { useEffect, useState } from "react";
import {
  fetchHabits,
  createHabit,
  updateHabit,
  deleteHabit as deleteHabitApi,
  toggleHabitDay,
} from "./api/habits";
import Auth from "@/components/auth/Auth";
import Header from "@/components/header/Header";
import AddHabitCard from "@/components/addHabitCard/AddHabitCard";
import HabitCard from "@/components/habitCard/HabitСard";
import styles from "./App.module.css";
import EmptyState from "./components/emptyState/EmptyState";

function App() {
  const [user, setUser] = useState(null);
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);

  // Проверяем токен при загрузке
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetchUserProfile(token);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUserProfile = async (token) => {
    try {
      const response = await fetch("http://localhost:5000/api/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        await loadHabits();
      } else {
        localStorage.removeItem("token");
      }
    } catch (error) {
      console.error("Ошибка получения профиля:", error);
    } finally {
      setLoading(false);
    }
  };

  const addHabit = async (habit) => {
    try {
      const newHabit = await createHabit(habit);
      setHabits([newHabit, ...habits]);
    } catch (error) {
      alert(error.message);
    }
  };

  const toggleHabit = async (id, today) => {
    try {
      const updateHabit = await toggleHabitDay(id, today);
      setHabits(habits.map((habit) => (habit.id === id ? updateHabit : habit)));
    } catch (error) {
      alert(error.message);
    }
  };

  const deleteHabit = async (id) => {
    try {
      await deleteHabitApi(id);
      setHabits(habits.filter((habit) => habit.id !== id));
    } catch (error) {
      alert(error.message);
    }

    // setHabits(habits.filter(habit => habit.id !== id));
  };

  const editHabit = async (id, newName) => {
    try {
      const updatedHabit = await updateHabit(id, { name: newName });
      setHabits(
        habits.map((habit) => (habit.id === id ? updatedHabit : habit)),
      );
    } catch (error) {
      alert(error.message);
    }
  };

  const updateHabitStyle = async (id, styles) => {
    try {
      const updatedHabit = await updateHabit(id, styles);
      setHabits(
        habits.map((habit) => (habit.id === id ? updatedHabit : habit)),
      );
    } catch (error) {
      alert(error.message);
    }
  };

  const calculatorStreak = (completedDates, today) => {
    if (!completedDates.length) return 0;

    let streak = 0;
    let currentDate = new Date(today);

    while (completedDates.includes(currentDate.toISOString().split("T")[0])) {
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    }
    return streak;
  };

  const loadHabits = async () => {
    try {
      const habitsData = await fetchHabits();
      console.log("данные с сервера:", habitsData);
      setHabits(habitsData);
    } catch (error) {
      console.error("Ошибка загрузки привычек:", error);
    }
  };

  if (loading) {
    return <div className={styles.loading}>Загрузка...</div>;
  }

  return (
    <div className={styles.app}>
      <div className={styles.content}>
        {!user ? (
          <Auth onLogin={(userData) => setUser(userData)} />
        ) : (
          <>
            <Header onLogout={() => setUser(null)} />
            <AddHabitCard onAdd={addHabit} />
            <div className={styles.habitsContainer}>
               {habits.length === 0 ? (
                <EmptyState />
              ) : (
                habits.map((habit) => (
                  <HabitCard
                    key={habit.id}
                    habit={habit}
                    onToggle={toggleHabit}
                    calculatorStreak={calculatorStreak}
                    onDelete={deleteHabit}
                    onEdit={editHabit}
                    onUpdateStyle={updateHabitStyle}
                  />
                ))
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
