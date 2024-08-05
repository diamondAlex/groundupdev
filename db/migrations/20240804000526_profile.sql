-- migrate:up
create table profile(
    id integer auto_increment not null primary key,
    name varchar(255),
    username varchar(255),
    description text,
    pfp varchar(255)
);

-- migrate:down
drop table profile;
