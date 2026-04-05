import { useState } from "react";

const HabitCard = (props) => {
  const { habit } = props;

  const [completed, setCompleted] = useState(false);

  return (
    <div className={`habit_card ${completed ? 'completed' : ''}`}>
      <div>
        <h2>{habit.name}</h2>
        <p>Старт: {habit.date}</p>
        <p>Статус привычки: {completed} </p>
        <button
          className="isCompleted"
          onClick={() => {
            setCompleted(!completed);
          }}
        >
          сделано
        </button>
      </div>
    </div>
  );
};

export default HabitCard;
