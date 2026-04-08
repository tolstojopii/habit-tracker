import { useState } from "react";

const HabitCard = (props) => {
  const { habit, onToggle, streak } = props;

  const [completed, setCompleted] = useState(false);
  const today = new Date().toISOString().split("T")[0];
  const isCompleted = habit.completedDates.includes(today);

  return (
    <div className={`habit_card ${isCompleted ? "completed" : ""}`}>
      <h2><b>{habit.name}</b></h2>
      <p>Старт: {habit.date}</p>
      <button onClick={() => onToggle(habit.id, today)}>
        {isCompleted ? "Пошутил" : "Отметить"}
      </button>
    </div>
  );
};

export default HabitCard;
