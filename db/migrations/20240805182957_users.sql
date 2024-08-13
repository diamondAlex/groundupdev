-- migrate:up
create table users(
    id integer auto_increment not null primary key,
    username varchar(255),
    password varchar(255)
);

-- migrate:down
drop table users;

