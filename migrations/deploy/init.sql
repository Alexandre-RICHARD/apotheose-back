BEGIN;

DROP TABLE IF EXISTS "user" CASCADE;
DROP TABLE IF EXISTS "category" CASCADE;
DROP TABLE IF EXISTS "quiz" CASCADE;
DROP TABLE IF EXISTS "answer" CASCADE;
DROP TABLE IF EXISTS "question" CASCADE;
DROP TABLE IF EXISTS "user_made_quiz" CASCADE;
DROP TABLE IF EXISTS "user_read_article" CASCADE;

-- -----------------------------------------------------
-- Table "category"
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS "category" (
  "id" int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  "fr_category_name" text NOT NULL,
  "en_category_name" text NOT NULL
);

-- -----------------------------------------------------
-- Table "quiz"
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS "quiz" (
  "id" int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  "fr_title" text NOT NULL,
  "en_title" text NOT NULL,
  "category_id" int NOT NULL REFERENCES "category" ("id") ON DELETE CASCADE
);

-- -----------------------------------------------------
-- Table "question"
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS "question" (
  "id" int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  "fr_statement" text NOT NULL,
  "fr_article_link" text NOT NULL,
  "fr_article_title" text NOT NULL,
  "fr_justification" text NOT NULL,
  "en_statement" text NOT NULL,
  "en_article_link" text NOT NULL,
  "en_article_title" text NOT NULL,
  "en_justification" text NOT NULL,
  "quiz_id" int NOT NULL REFERENCES "quiz" ("id") ON DELETE CASCADE
);

-- -----------------------------------------------------
-- Table "answer"
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS "answer" (
  "id" int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  "fr_answer_name" text NOT NULL,
  "en_answer_name" text NOT NULL,
  "good_answer" boolean NOT NULL,
  "question_id" int NOT NULL REFERENCES "question" ("id") ON DELETE CASCADE
);

-- -----------------------------------------------------
-- Table "user"
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS "user" (
  "id" int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  "email" text NOT NULL UNIQUE,
  "firstname" text NOT NULL,
  "lastname" text NOT NULL,
  "password" text NOT NULL,
  "role" text NOT NULL DEFAULT 'user'
);

-- -----------------------------------------------------
-- Table "user_made_quiz"
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS "user_made_quiz" (
  "id" int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  "score_quiz" int NOT NULL,
  "user_id" int NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
  "quiz_id" int NOT NULL REFERENCES "quiz"("id") ON DELETE CASCADE
);

-- -----------------------------------------------------
-- Table "user_read_article"
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS "user_read_article" (
  "id" int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  "read" boolean NOT NULL,
  "user_id" int NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
  "question_id" int NOT NULL REFERENCES "question"("id") ON DELETE CASCADE
);

COMMIT;