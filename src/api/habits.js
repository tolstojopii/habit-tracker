const API_URL = "http://localhost:5000/api";

const getHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

export const fetchHabits = async () => {
  const response = await fetch(`${API_URL}/habits`, {
    method: "GET",
    headers: getHeaders(),
  });

  if (!response.ok) {
    throw new Error("Ошибка загрузки привычек");
  }

  const data = await response.json();
  return data;
};

export const createHabit = async (habitData) => {
  const response = await fetch(`${API_URL}/habits`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(habitData),
  });
  if (!response.ok) {
    throw new Error("Не удалось создать привычку");
  }

  const data = await response.json();
  return data;
};

export const updateHabit = async (id, habitData) => {
  const response = await fetch(`${API_URL}/habits/${id}`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify(habitData),
  });
  if (!response.ok) {
    throw new Error("Не удалось обновить данные привычки");
  }

  const data = await response.json();
  return data;
};

export const deleteHabit = async (id) => {
  const response = await fetch(`${API_URL}/habits/${id}`, {
    method: "DELETE",
    headers: getHeaders(),
  });
  if (!response.ok) {
    throw new Error("Не удалось удалить привычку");
  }

  return response.json();
};

export const toggleHabitDay = async (id, date) => {
  const response = await fetch(`${API_URL}/habits/${id}/toggle`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({ date }),
  });
  if (!response.ok) {
    throw new Error("Не удалось отметить привычку");
  }
  return response.json();
};
