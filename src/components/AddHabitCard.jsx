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
      />
      <button
        onClick={() => {
          if (name.trim()) {
            onAdd({ id: Date.now(), name: name, completed:false, date: new Date().toISOString().split('T')[0] });
            setName('')
          }
        }}
      >
        Добавить
      </button>
    </div>
  );
};

export default AddHabitCard;
