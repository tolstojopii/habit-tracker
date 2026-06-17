import express from "express";
import cors from "cors";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import pool from "./db.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// middleware для токена
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Требуется авторизация" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: "Недействительный токен" });
    }
    req.user = user;
    next();
  });
};

// получение всех привычек
app.get("/api/habits", authenticateToken, async (req, res) => {
  const userId = req.user.userId;

  try {
    const result = await pool.query(
      `SELECT * FROM habits WHERE user_id = $1 ORDER BY created_at DESC`,
      [userId],
    );

    // ✅ Преобразуем completed_dates в массив
    const habits = result.rows.map((habit) => ({
      ...habit,
      completed_dates: Array.isArray(habit.completed_dates)
        ? habit.completed_dates
        : [],
    }));

    res.json(habits);
  } catch (err) {
    console.error("Ошибка получения привычек:", err);
    res.status(500).json({ error: "Ошибка сервера" });
  }
});

// создание привычки
app.post("/api/habits", authenticateToken, async (req, res) => {
  const { name, date, fontFamily, cardColor, glowColor } = req.body;
  const userId = req.user.userId;

  const safeDate = date || new Date().toISOString().split("T")[0];
  const safeFont = fontFamily || "Arial";
  const safeCardColor = cardColor || "#24242b";
  const safeGlowColor = glowColor || "#8b9dc3";

  if (!name) {
    return res.status(400).json({ error: "Название привычки обязательно" });
  }

  try {
    const result = await pool.query(
      `INSERT INTO habits (user_id, name, date, font_family, card_color, glow_color, completed_dates)
       VALUES ($1, $2, $3, $4, $5, $6, $7::jsonb)
       RETURNING *`,
      [
        userId,
        name,
        safeDate,
        safeFont,
        safeCardColor,
        safeGlowColor,
        JSON.stringify([]),
      ],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Не удалось создать привычку" });
    }

    // ✅ Возвращаем с массивом
    const habit = {
      ...result.rows[0],
      completed_dates: [],
    };

    res.status(201).json(habit);
  } catch (err) {
    console.error("Ошибка создания привычки:", err);
    res.status(500).json({ error: "Ошибка сервера" });
  }
});

// удаление
app.delete("/api/habits/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  const userId = req.user.userId;

  try {
    const result = await pool.query(
      `DELETE FROM habits WHERE id = $1 AND user_id = $2 RETURNING id`,
      [id, userId],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "привычка не найдена" });
    }
    return res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error("Ошибка удаления привычки:", err);
    res.status(500).json({ error: "Ошибка сервера" });
  }
});

// обновление
app.put("/api/habits/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { name, fontFamily, cardColor, glowColor } = req.body;
  const userId = req.user.userId;

  try {
    const result = await pool.query(
      `UPDATE habits 
SET name = COALESCE($1, name),
    font_family = COALESCE($2, font_family),
    card_color = COALESCE($3, card_color),
    glow_color = COALESCE($4, glow_color)
WHERE id = $5 AND user_id = $6
RETURNING *`,
      [name, fontFamily, cardColor, glowColor, id, userId],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Привычка не найдена" });
    }

    // ✅ Преобразуем completed_dates в массив
    const habit = {
      ...result.rows[0],
      completed_dates: Array.isArray(result.rows[0].completed_dates)
        ? result.rows[0].completed_dates
        : [],
    };

    return res.status(200).json(habit);
  } catch (err) {
    console.error("Ошибка обновления привычки:", err);
    res.status(500).json({ error: "Ошибка сервера при обновлении привычки" });
  }
});

// отметить привычку (toggle)
app.post("/api/habits/:id/toggle", authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { date } = req.body;
  const userId = req.user.userId;

  try {
    const habitResult = await pool.query(
      `SELECT completed_dates FROM habits WHERE id = $1 AND user_id = $2`,
      [id, userId],
    );

    if (habitResult.rows.length === 0) {
      return res.status(404).json({ error: "Привычка не найдена" });
    }

    // ✅ Преобразуем в массив
    let completedDates = habitResult.rows[0].completed_dates;
    if (!Array.isArray(completedDates)) {
      completedDates = [];
    }

    if (completedDates.includes(date)) {
      completedDates = completedDates.filter((d) => d !== date);
    } else {
      completedDates.push(date);
    }

    const result = await pool.query(
      "UPDATE habits SET completed_dates = $1::jsonb WHERE id = $2 RETURNING *",
      [JSON.stringify(completedDates), id],
    );

    // ✅ Возвращаем с массивом
    const habit = {
      ...result.rows[0],
      completed_dates: completedDates,
    };

    return res.status(200).json(habit);
  } catch (err) {
    console.error("Ошибка, привычка не отмечена", err);
    res.status(500).json({ error: "Ошибка сервера при отметке привычки" });
  }
});

// проверка здоровья
app.get("/api/health", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({ status: "OK", time: result.rows[0].now });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// регистрация
app.post("/api/register", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email и пароль обязательны" });
  }

  if (password.length < 6) {
    return res
      .status(400)
      .json({ error: "Пароль должен быть минимум 6 символов" });
  }

  try {
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const result = await pool.query(
      "INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email, created_at",
      [email, passwordHash],
    );

    const user = result.rows[0];

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        createdAt: user.created_at,
      },
    });
  } catch (err) {
    if (err.code === "23505") {
      return res
        .status(400)
        .json({ error: "Пользователь с таким email уже существует" });
    }
    console.error("Ошибка регистрации:", err);
    res.status(500).json({ error: "Внутренняя ошибка сервера" });
  }
});

// логин
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email и пароль обязательны" });
  }

  try {
    const result = await pool.query(
      "SELECT id, email, password_hash FROM users WHERE email = $1",
      [email],
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Неверный email или пароль" });
    }

    const user = result.rows[0];

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Неверный email или пароль" });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
      },
    });
  } catch (err) {
    console.error("Ошибка логина:", err);
    res.status(500).json({ error: "Внутренняя ошибка сервера" });
  }
});

// профиль
app.get("/api/profile", authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, email, created_at FROM users WHERE id = $1",
      [req.user.userId],
    );
    res.json({ user: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: "Ошибка получения профиля" });
  }
});

// запуск
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(` Сервер запущен на http://localhost:${PORT}`);
});
