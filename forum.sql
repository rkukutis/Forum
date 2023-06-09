CREATE TABLE "announcements" (
  "id" SERIAL PRIMARY KEY,
  "user_id" integer,
  "body" text NOT NULL,
  "created_at" TIMESTAMP NOT NULL DEFAULT(NOW())
);


CREATE TYPE role AS ENUM ('user', 'moderator', 'admin');
CREATE TYPE status AS ENUM ('active', 'banned');

CREATE TABLE "users" (
  "id" SERIAL PRIMARY KEY,
  "username" varchar NOT NULL UNIQUE,
  "email" VARCHAR NOT NULL UNIQUE,
  "password"  varchar NOT NULL,
  "passwordChanged" TIMESTAMP,
  "role" role NOT NULL DEFAULT('user'),
  "status" status DEFAULT('active'),
  "created_at" TIMESTAMP NOT NULL DEFAULT(NOW())
);
CREATE TABLE "posts" (
  "id" SERIAL PRIMARY KEY,
  "title"  varchar NOT NULL,
  "body"  text NOT NULL,
  "user_id" integer,
  "created_at" TIMESTAMP NOT NULL DEFAULT(NOW())
);
CREATE TABLE "comments" (
  "id" SERIAL PRIMARY KEY,
  "post_id" int,
  "body" text NOT NULL,
  "user_id" integer,
  "created_at" TIMESTAMP NOT NULL DEFAULT(NOW())
);

ALTER TABLE "posts" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");

ALTER TABLE "announcements" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");

ALTER TABLE "comments" ADD FOREIGN KEY ("post_id") REFERENCES "posts" ("id");

ALTER TABLE "comments" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");
