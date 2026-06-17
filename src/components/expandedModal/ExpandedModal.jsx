import styles from "./expandedModal.module.css";
import { parseCompletedDates } from "@/utils/parseCompletedDates";

const ExpandedModal = (props) => {
  const { habit, onClose } = props;

  const today = new Date().toISOString().split("T")[0];
  

  const completedDates = parseCompletedDates(habit);
  
  const completedCount = completedDates.length;
  const isCompletedToday = completedDates.includes(today);

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.content} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={() => onClose()}>✕</button>

        <h2 className={styles.title}>{habit.name}</h2>

        <div className={styles.stats}>
          <div className={styles.statCard}>
            <h4>Серия</h4>
            <p>{habit.streak || 0} дней</p>
          </div>
          <div className={styles.statCard}>
            <h4>Всего выполнено</h4>
            <p>{completedCount} раз</p>
          </div>
          <div className={styles.statCard}>
            <h4>Сегодня</h4>
            <p>{isCompletedToday ? "Выполнено" : "Не выполнено"}</p>
          </div>
        </div>

        <div className={styles.info}>
          <p><strong>Дата создания:</strong> {habit.date}</p>
          <p><strong>Выбранные даты:</strong> {completedDates.join(", ") || "пока что нет"}</p>
        </div>

        <button className={styles.closeModalBtn} onClick={onClose}>Закрыть</button>
      </div>
    </div>
  );
};

export default ExpandedModal;