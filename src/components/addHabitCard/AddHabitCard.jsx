import { useState, useRef, useEffect } from "react";
import styles from "./addHabitCard.module.css";

const AddHabitCard = ({ onAdd }) => {
  const [name, setName] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div className={styles.container}>
      <input
        type="text"
        ref={inputRef}
        className={styles.input}
        placeholder="Название привычки"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button
        className={styles.button}
        onClick={() => {
          if (name.trim()) {
            onAdd({
              name: name,
              date: new Date().toISOString().split("T")[0],
              fontFamily: "Arial",
              cardColor: "#24242b",
              glowColor: "#6a3bc0",
            });
            setName("");
          }
        }}
      >
        Добавить
      </button>
    </div>
  );
};

export default AddHabitCard;