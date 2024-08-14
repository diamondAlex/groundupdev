-- migrate:up
create table profile(
    id integer auto_increment not null primary key,
    username varchar(255),
    name varchar(255),
    lastname varchar(255),
    education varchar(255),
    description text
);

-- migrate:down
drop table profile;
