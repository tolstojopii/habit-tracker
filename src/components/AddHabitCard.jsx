import { useState, useRef, useEffect, use } from "react";

const AddHabitCard = ({ onAdd }) => {
  const [name, setName] = useState("");

  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div className="add_habit">
      <input
        type="text"
        ref={inputRef}
        placeholder="Название привычки"
        onChange={(e) => setName(e.target.value)}
        value={name}
        style={{ fontFamily: "cursive" }}
      />
      <button
        style={{ fontFamily: "cursive" }}
        onClick={() => {
          if (name.trim()) {
            onAdd({
              id: Date.now(),
              name: name,
              completedDates: [],
              date: new Date().toISOString().split("T")[0],
              fontFamily: "Arial", 
              cardColor: "#1e1e3a",
              glowColor: "#6a3bc0",
              backgroundImage: null,
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
