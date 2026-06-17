import { useState, useRef } from "react";
import EditModal from "@/components/editModal/EditModal";
import ExpandedModal from "@/components/expandedModal/ExpandedModal";
import styles from "./habitCard.module.css";

const HabitCard = (props) => {
  const { habit, onToggle, calculatorStreak, onDelete, onEdit, onUpdateStyle } =
    props;

  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showExpanded, setShowExpanded] = useState(false);

  const inputRef = useRef(null);

  const today = new Date().toISOString().split("T")[0];

  // ✅ Используем completed_dates (как в БД)
  const completedDates = habit.completed_dates || [];
  const isCompleted = completedDates.includes(today);
  const streak = calculatorStreak(completedDates, today);

  const editing = () => {
    setIsEditing(true);
    setNewName(habit.name);
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.editTrigger} onClick={() => setShowModal(true)}>
        ⚙️
      </div>
      <div
        className={`${styles.card} ${isCompleted ? styles.completed : ""}`}
        style={{
          fontFamily: habit.fontFamily || "Arial",
          "--card-bg": habit.cardColor || "#24242b",
        }}
      >
        <button className={styles.editBtn} type="button" onClick={editing}>
          ✏️
        </button>
        {isEditing ? (
          <input
            className={styles.editInput}
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
          <h2 className={styles.habitName}>
            <b>{habit.name}</b>
          </h2>
        )}
        <p className={styles.text}>Старт: {new Date(habit.date).toLocaleDateString('ru-RU')}</p>
        <p className={styles.text}>Серия: {streak} дней</p>
        <button
          className={styles.markBtn}
          onClick={() => onToggle(habit.id, today)}
        >
          {completedDates.includes(today) ? "Пошутил" : "Отметить"}
        </button>
        <button className={styles.deleteBtn} onClick={() => onDelete(habit.id)}>
          Удалить
        </button>
        <button
          className={styles.detailsBtn}
          onClick={() => setShowExpanded(true)}
        >
          Детали
        </button>
      </div>
      {showExpanded && (
        <ExpandedModal habit={habit} onClose={() => setShowExpanded(false)} />
      )}
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