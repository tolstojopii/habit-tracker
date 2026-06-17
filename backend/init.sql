
CREATE DATABASE habits_db;

\c habits_db;


CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE habits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    date DATE NOT NULL,
    font_family VARCHAR(100) DEFAULT 'Arial',
    card_color VARCHAR(20) DEFAULT '#1e1e3a',
    glow_color VARCHAR(20) DEFAULT '#6a3bc0',
    completed_dates JSONB DEFAULT '[]',
    streak INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE INDEX idx_habits_user_id ON habits(user_id);


\dt