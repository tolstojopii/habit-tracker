import styles from "./emptyState.module.css";

const EmptyState = ({
  title = "Пока нет привычек",
  description = "Добавь первую привычку, чтобы начать трекинг!",
}) => {
  return (
    <div className={styles.emptyState}>
      <h2 className={styles.title}>{title}</h2>
      <p className={styles.description}>{description}</p>
    </div>
  );
};

export default EmptyState;
