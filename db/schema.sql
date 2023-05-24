CREATE DATABASE hoopoe_forum;

\c users
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR,
  email VARCHAR,
  password VARCHAR,
);

INSERT INTO users (name, email, password)
  VALUES ('rhoopoe', 'rick@mail.com', 'hunter2')