-- migrate:up
ALTER TABLE profile
ADD COLUMN pfp varchar(255);


-- migrate:down
ALTER TABLE profile
DROP COLUMN pfp;
