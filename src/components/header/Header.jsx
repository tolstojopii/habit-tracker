import styles from "./header.module.css";

const Header = ({ onLogout }) => {
  const handleLogout = () => {
    localStorage.removeItem("token");
    if (onLogout) onLogout();
  };

  return (
    <header className={styles.header}>
      <div className={styles.center}>
        <h1>Трекер привычек</h1>
        <p>
          Отслеживайте свои <b>вредные</b> или <b>полезные</b> привычки
        </p>
      </div>
      <button onClick={handleLogout} className={styles.logoutBtn}>
        Выйти
      </button>
    </header>
  );
};

export default Header;