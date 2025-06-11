CREATE TABLE blogs (
    id SERIAL PRIMARY KEY,
    author text,
    url text NOT NULL,
    title text NOT NULL,
    likes integer default 0
);

insert into blogs (author, url, title, likes) values ('James Blunt', 'www.jamesblunt.com', 'A Good Blog Post attracts users', 5);
insert into blogs (author, url, title, likes) values ('Sani Danger', 'www.sanidanger.com', 'Akwayii Babaa', 1);