
CREATE TYPE role AS ENUM ('user', 'moderator', 'admin');
CREATE TYPE status AS ENUM ('active', 'banned');


CREATE TABLE IF NOT EXISTS "announcements" (
  "id" SERIAL PRIMARY KEY,
  "user_id" integer,
  "title" text NOT NULL,
  "slug" text NOT NULL,
  "body" text NOT NULL,
  "image" varchar NOT NULL DEFAULT('announcementDefault.jpg'),
  "created_at" TIMESTAMP NOT NULL DEFAULT(NOW())
);

CREATE TABLE IF NOT EXISTS "users" (
  "id" SERIAL PRIMARY KEY,
  "username" varchar NOT NULL UNIQUE,
  "email" VARCHAR NOT NULL UNIQUE,
  "password"  varchar NOT NULL,
  "password_changed" TIMESTAMP,
  "image" varchar NOT NULL DEFAULT('userDefault.jpg'),
  "role" role NOT NULL DEFAULT('user'),
  "status" status DEFAULT('active'),
  "created_at" TIMESTAMP NOT NULL DEFAULT(NOW())
);
CREATE TABLE IF NOT EXISTS "posts" (
  "id" SERIAL PRIMARY KEY,
  "title" varchar NOT NULL,
  "image" varchar NOT NULL DEFAULT('postDefault.jpg'),
  "body" text NOT NULL,
  "slug" text NOT NULL,
  "user_id" integer NOT NULL,
  "created_at" TIMESTAMP NOT NULL DEFAULT(NOW())
);
CREATE TABLE IF NOT EXISTS "comments" (
  "id" SERIAL PRIMARY KEY NOT NULL,
  "post_id" integer NOT NULL,
  "body" text NOT NULL,
  "user_id" integer NOT NULL,
  "created_at" TIMESTAMP NOT NULL DEFAULT(NOW())
);

ALTER TABLE "posts" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE;

ALTER TABLE "announcements" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE;

ALTER TABLE "comments" ADD FOREIGN KEY ("post_id") REFERENCES "posts" ("id") ON DELETE CASCADE;

ALTER TABLE "comments" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE;
