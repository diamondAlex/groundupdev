-- migrate:up
create table sessions(
    id integer auto_increment not null primary key,
    username varchar(255),
    cookie varchar(255)
);


-- migrate:down
drop table sessions;
