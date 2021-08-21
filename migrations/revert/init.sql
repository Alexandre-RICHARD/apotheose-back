-- Revert apov5:init from pg

BEGIN;

DROP TABLE category;

COMMIT;
