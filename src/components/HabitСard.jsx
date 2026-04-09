import { useState } from "react";

const HabitCard = (props) => {
  const { habit, onToggle, calculatorStreak, onDelete } = props;

  const [completed, setCompleted] = useState(false);
  const today = new Date().toISOString().split("T")[0];
  const isCompleted = habit.completedDates.includes(today);
  const streak = calculatorStreak(habit.completedDates, today);

  return (
    <div className={`habit_card ${isCompleted ? "completed" : ""}`}>
      <h2><b>{habit.name}</b></h2>
      <p>Старт: {habit.date}</p>
      <p>Серия: {streak} дней</p>
      <button className="mark-btn"
      onClick={() => onToggle(habit.id, today)}
      >
        {habit.completedDates.includes(today) ? 'Отметить' : 'Пошутил'}
      </button>
      <button className="delete-btn"
      onClick={() => onDelete(habit.id)}>Удалить</button>
    </div>
  );
};

export default HabitCard;
