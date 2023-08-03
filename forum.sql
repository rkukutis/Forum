
CREATE TYPE role AS ENUM ('user', 'moderator', 'admin');
CREATE TYPE status AS ENUM ('unconfirmed','active', 'banned');


-- CREATE TABLE IF NOT EXISTS "announcements" (
--   "id" SERIAL PRIMARY KEY,
--   "user_id" integer,
--   "title" text NOT NULL,
--   "slug" text NOT NULL,
--   "body" text NOT NULL,
--   "image" VARCHAR DEFAULT 'announcementDefault.jpg' NOT NULL,
--   "created_at" TIMESTAMP DEFAULT NOW() NOT NULL
-- );

CREATE TABLE IF NOT EXISTS "users" (
  "id" SERIAL PRIMARY KEY,
  "username" VARCHAR UNIQUE NOT NULL,
  "email" VARCHAR UNIQUE NOT NULL,
  "email_confirmed" BOOLEAN DEFAULT FALSE NOT NULL,
  "password" VARCHAR NOT NULL,
  "password_changed" TIMESTAMP,
  "password_reset_code" VARCHAR,
  "password_reset_link" VARCHAR,
  "image" VARCHAR DEFAULT 'userDefault.jpg' NOT NULL,
  "role" role DEFAULT 'user' NOT NULL,
  "status" status DEFAULT 'unconfirmed',
  "created_at" TIMESTAMP DEFAULT NOW() NOT NULL 
);
CREATE TABLE IF NOT EXISTS "posts" (
  "id" SERIAL PRIMARY KEY,
  "title" VARCHAR NOT NULL,
  "image" VARCHAR DEFAULT 'postDefault.jpg' NOT NULL,
  "body" text NOT NULL,
  "slug" text NOT NULL,
  "comment_number" integer DEFAULT(0) NOT NULL,
  "user_id" integer NOT NULL,
  "created_at" TIMESTAMP DEFAULT NOW() NOT NULL
);
CREATE TABLE IF NOT EXISTS "comments" (
  "id" SERIAL PRIMARY KEY NOT NULL,
  "post_id" integer NOT NULL,
  "body" text NOT NULL,
  "user_id" integer NOT NULL,
  "created_at" TIMESTAMP DEFAULT NOW() NOT NULL
);

ALTER TABLE "posts" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE;

ALTER TABLE "announcements" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE;

ALTER TABLE "comments" ADD FOREIGN KEY ("post_id") REFERENCES "posts" ("id") ON DELETE CASCADE;

ALTER TABLE "comments" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE;
