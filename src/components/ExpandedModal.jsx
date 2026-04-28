const ExpandedModal = (props) => {
  const { habit, onClose } = props;

  const today = new Date().toISOString().split("T")[0];
  const completedCount = habit.completedDates.length;
  const isCompletedToday = habit.completedDates.includes(today);

  return (
    <div className="expanded-overlay" onClick={onClose} style={{backgroundColor: "White"}}>
      <div className="expanded-content" onClick={(e) => e.stopPropagation()}>
        <button className="expanded-close" onClick={() => onClose()}>✕</button>

        <h2>{habit.name}</h2>

        <div className="expanded-stats">
          <div className="stat-card">
            <h4>Серия</h4>
            <p>{habit.streak || 0} дней</p>
          </div>
          <div className="stat-card">
            <h4>Всего выполнено</h4>
            <p>{completedCount} раз</p>
          </div>
          <div className="stat-card">
            <h4>Сегодня</h4>
            <p>{isCompletedToday ? "Выполнено" : "Не выполнено"}</p>
          </div>
        </div>

        <div className="expanded_info">
          <p><strong>Дата создания:</strong> {habit.date}</p>
          <p><strong>Выбранные даты:</strong> {habit.completedDates.join(", ") || "пока что нет"}</p>
        </div>

        <button className="expanded-close-btn" onClick={onClose}>Закрыть</button>

      </div>
    </div>
  );
};

export default ExpandedModal;
