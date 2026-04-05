import { useState } from "react";
import "./App.css";
import AddHabitCard from "./components/AddHabitCard";
import HabitCard from "./components/HabitСard";

function App() {
  const [habits, setHabits] = useState([]);

  const addHabit = (newHabit) => {
    setHabits([...habits, newHabit])
  }

  return (
  <>
    <AddHabitCard onAdd={addHabit} />
    {habits.map(habit => <HabitCard key={habit.id} habit={habit} />)}
  </>
);
  
}

export default App;
