import { useState, useEffect } from "react";
import "./App.css";
import AddHabitCard from "./components/AddHabitCard";
import HabitCard from "./components/HabitСard";

function App() {
  const [habits, setHabits] = useState(() => {
    const saved = localStorage.getItem("habits");
    return saved ? JSON.parse(saved) : [];
  });



  const addHabit = (newHabit) => {
    setHabits([...habits, newHabit]);
  };

  const getPrevDate = (dateString) => {
    const date = new Date(dateString);
    date.setDate(date.getDate() - 1);
    return date.toISOString().split("T")[0];
  };

  const calculatorStreak = (completedDates, todayDate) => {
    let streak = 0;
    let currentDate = todayDate;

    while (completedDates.includes(currentDate)) {
      streak++;
      currentDate = getPrevDate(currentDate);
    }
    return streak;
  };

  const toggleComplete = (habitId, todayDate) => {
    setHabits((prevHabits) =>
      prevHabits.map((habit) =>
        habit.id === habitId
          ? {
              ...habit,
              completedDates: habit.completedDates.includes(todayDate)
                ? habit.completedDates.filter((d) => d !== todayDate)
                : [...habit.completedDates, todayDate],
            }
          : habit,
      ),
    );
  };

   const deleteHabit = (id) => {
    setHabits(prevHabits => prevHabits.filter(habit => habit.id !== id));
   }


  useEffect(() => {
    localStorage.setItem("habits", JSON.stringify(habits));
  }, [habits]);

  return (
    <>
      <AddHabitCard onAdd={addHabit} />
      <div className="habits_container">
      {habits.map((habit) => (
        <HabitCard
          key={habit.id}
          habit={habit}
          onToggle={toggleComplete}
          calculatorStreak={calculatorStreak}
          onDelete={deleteHabit}
        />
      ))} 
      </div>
    </>
  );
}

export default App;
