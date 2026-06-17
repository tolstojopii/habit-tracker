import { useState } from "react";
import styles from "./auth.module.css";

const Auth = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const endpoint = isLogin
      ? "http://localhost:5000/api/login"
      : "http://localhost:5000/api/register";

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        onLogin(data.user);
      } else {
        alert(data.error || "Ошибка авторизации");
      }
    } catch (error) {
      alert("Ошибка подключения к серверу. Запусти бэкенд!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <h2 className={styles.title}>{isLogin ? "Вход" : "Регистрация"}</h2>
        <div className={styles.block_auth}>
          <span className={styles.span}>Почта</span>
          <input
            type="email"
            className={styles.input}
            placeholder="example@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className={styles.block_auth}>
          <span className={styles.span}>Пароль</span>
          <input
            type="password"
            className={styles.input}
            placeholder="great password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit" disabled={loading} className={styles.submitBtn}>
          {loading ? "загрузочка..." : isLogin ? "войти" : "зарегистрироваться"}
        </button>
        <button
          type="button"
          onClick={() => setIsLogin(!isLogin)}
          className={styles.switchBtn}
        >
          {isLogin ? "нет акка? зарегистрируйся" : "есть акк? входи быстрее"}
        </button>
      </form>
    </div>
  );
};

export default Auth;
