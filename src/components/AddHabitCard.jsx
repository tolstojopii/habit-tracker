import { useState } from "react";

const AddHabitCard = ({ onAdd }) => {
  const [name, setName] = useState("");

  return (
    <div className="add_habit">
      <input
        type="text"
        placeholder="Название привычки"
        onChange={(e) => setName(e.target.value)}
        value={name}
        style={{fontFamily:"cursive"}}
      />
      <button
      style={{fontFamily:"cursive"}}
        onClick={() => {
          if (name.trim()) {
            onAdd({
              id: Date.now(),
              name: name,
              completedDates: ['э2345234'],
              date: new Date().toISOString().split("T")[0],
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
