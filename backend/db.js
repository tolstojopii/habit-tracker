import pkg from "pg";
const { Pool } = pkg;
import dotenv from "dotenv";

dotenv.config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

pool.connect((err, client, release) => {
  if (err) {
    // Нормальный вывод ошибки
    console.error("Ошибка подключения к БД:");
    console.error("Текст:", err.message);
    console.error("Код:", err.code);
    console.error("Детали:", err.detail);

    // Если ошибка связана с паролем
    if (err.code === "28P01") {
      console.error("неверный пароль");
    }
  } else {
    console.log("подключено PostgreSQL");
    release();
  }
});

export default pool;
