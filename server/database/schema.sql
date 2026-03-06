CREATE USER IF NOT EXISTS 'notefy'@'%' IDENTIFIED BY 'Notefy2026!';
GRANT ALL PRIVILEGES ON notefy.* TO 'notefy'@'%' WITH GRANT OPTION;
FLUSH PRIVILEGES;

CREATE DATABASE IF NOT EXISTS notefy;
USE notefy;

create table user (
  id int unsigned primary key auto_increment not null,
  email varchar(255) not null unique,
  password varchar(255) not null,
  firstname varchar(255),
  lastname varchar(255),
  role varchar(50) not null default 'user',
  created_at timestamp not null default current_timestamp,
  updated_at timestamp not null default current_timestamp on update current_timestamp
);

create table notes (
  id int unsigned primary key auto_increment not null,
  name varchar(25) not null,
  content_id varchar(10) unique,
  slug varchar(10) not null unique,
  is_private boolean not null default false,
  linkshare boolean not null default false,
  password varchar(255),
  user_id int unsigned,
  created_at timestamp not null default current_timestamp,
  updated_at timestamp not null default current_timestamp on update current_timestamp,
  foreign key(user_id) references user(id) on delete cascade
);

create table content (
  id int unsigned primary key auto_increment not null,
  note_id int unsigned not null,
  content text not null,
  created_at timestamp not null default current_timestamp,
  updated_at timestamp not null default current_timestamp on update current_timestamp,
  foreign key(note_id) references notes(id) on delete cascade
);

create table favorite (
  user_id int unsigned not null,
  note_id int unsigned not null,
  created_at timestamp not null default current_timestamp,
  primary key (user_id, note_id),
  foreign key (user_id) references user(id) on delete cascade,
  foreign key (note_id) references notes(id) on delete cascade
);
