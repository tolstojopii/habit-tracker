import { useState, useRef } from "react";
import EditModal from "./EditModal";

const HabitCard = (props) => {
  const { habit, onToggle, calculatorStreak, onDelete, onEdit, onUpdateStyle } =
    props;

  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState("");
  const [showModal, setShowModal] = useState(false); // для модалки

  const inputRef = useRef(null);

  const today = new Date().toISOString().split("T")[0];
  const isCompleted = habit.completedDates.includes(today);
  const streak = calculatorStreak(habit.completedDates, today);

  const editing = () => {
    setIsEditing(true);
    setNewName(habit.name);
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  return (
    <div className="habit_card_wrapper">
      <div className="edit_trigger" onClick={() => setShowModal(true)}>
        ⚙️
      </div>
      <div
        className={`habit_card ${isCompleted ? "completed" : ""}`}
        style={{
          fontFamily: habit.fontFamily || "Arial",
          background: habit.cardColor || "rgb(15, 15, 27)",
          boxShadow: `0 8px 20px rgba(0, 0, 0, 0.5), 0 0 15px ${habit.glowColor || "#6a3bc0"}`
        }}
      >
        <button className="edit_btn" type="button" onClick={editing}>
          ✏️
        </button>
        {isEditing ? (
          <input
            className="edit_input"
            ref={inputRef}
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                onEdit(habit.id, newName);
                setIsEditing(false);
              } else if (e.key === "Escape") {
                setIsEditing(false);
              }
            }}
          />
        ) : (
          <h2>
            <b>{habit.name}</b>
          </h2>
        )}
        <p>Старт: {habit.date}</p>
        <p>Серия: {streak} дней</p>
        <button className="mark-btn" onClick={() => onToggle(habit.id, today)}>
          {habit.completedDates.includes(today) ? "Пошутил" : "Отметить"}
        </button>
        <button className="delete-btn" onClick={() => onDelete(habit.id)}>
          Удалить
        </button>
      </div>
      {showModal && (
        <EditModal
          habit={habit}
          onClose={() => setShowModal(false)}
          onUpdateStyle={onUpdateStyle}
        />
      )}
    </div>
  );
};

export default HabitCard;
